/**
 * Fit Log data access layer.
 *
 * Plain ESM JavaScript with zero imports so it runs both in Next.js
 * (server components / route handlers) and under plain Node.
 *
 * Sources of truth for the remote API, tried in order:
 *  1. https://api.abcz.workers.dev     (assignment primary; currently Cloudflare
 *     rate limited, HTTP 429 with an HTML error page)
 *  2. https://api.api-store.workers.dev (assignment alternative; fully working)
 */

const HOSTS = [
  "https://api.abcz.workers.dev",
  "https://api.api-store.workers.dev",
];

const NUMERIC_FIELDS = ["duration", "caloriesBurned", "sets", "reps", "rating"];

/**
 * Fetch JSON from the given URL, or return null on any failure
 * (network error, timeout, non-2xx status, or body that is not JSON).
 * @param {string} url
 * @returns {Promise<{ status: number, body: any } | null>}
 */
async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const body = await res.json();
    return { status: res.status, body };
  } catch {
    return null;
  }
}

/**
 * Accept either a bare array or a wrapper object ({ data | workouts | items }).
 * @param {any} body
 * @returns {any[] | null} the list, or null if the shape is unrecognized
 */
function extractList(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    for (const key of ["data", "workouts", "items"]) {
      if (Array.isArray(body[key])) return body[key];
    }
  }
  return null;
}

/**
 * Keep only items that look like a workout: an object with a non-null id
 * and a name. Numeric fields are coerced to numbers where the coercion
 * succeeds (values like reps "6-8" that are not numeric are left as-is).
 * @param {any[]} list
 * @returns {object[]}
 */
function sanitizeList(list) {
  const result = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object" || raw.id == null || !raw.name) continue;
    const item = { ...raw };
    for (const field of NUMERIC_FIELDS) {
      const coerced = Number(item[field]);
      if (Number.isFinite(coerced)) item[field] = coerced;
    }
    result.push(item);
  }
  return result;
}

/**
 * Fetch every workout from the remote API, trying each host in order.
 * @returns {Promise<object[]>} normalized workouts, or [] if every host fails
 */
export async function getAllWorkouts() {
  for (const host of HOSTS) {
    const res = await fetchJson(`${host}/api/fitlog`);
    if (!res) continue;
    const list = extractList(res.body);
    if (!list) continue;
    return sanitizeList(list);
  }
  return [];
}

/**
 * Fetch a single workout by id, trying each host in order.
 * The single endpoints proved reliable in testing (real id -> 200,
 * unknown id -> 404), so no list-and-find fallback is used.
 * @param {string|number} id
 * @returns {Promise<object|null>} the workout, or null if not found
 *   or every host fails
 */
export async function getWorkout(id) {
  for (const host of HOSTS) {
    const res = await fetchJson(
      `${host}/api/fitlog/${encodeURIComponent(String(id))}`
    );
    if (!res) continue;
    if (res.status === 404) return null;
    const body = res.body;
    if (!body || typeof body !== "object" || body.id == null || !body.name) {
      continue;
    }
    const [normalized] = sanitizeList([body]);
    return normalized;
  }
  return null;
}

/**
 * Filter workouts by a case-insensitive substring match on name and
 * muscle groups, then sort them. Pure: returns a new array.
 * @param {object[]} items workouts to process
 * @param {string} query search text ("" or undefined matches everything)
 * @param {string} [sort] "duration" | "caloriesBurned" | "rating"
 *   (rating sorts descending; the others ascending; default "duration")
 * @returns {object[]}
 */
export function filterAndSortWorkouts(items, query, sort) {
  const needle = String(query ?? "").trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (!needle) return true;
    const name = String(item.name ?? "").toLowerCase();
    const muscles = Array.isArray(item.muscleGroups)
      ? item.muscleGroups.join(" ").toLowerCase()
      : "";
    return name.includes(needle) || muscles.includes(needle);
  });

  const descending = sort === "rating";
  const key = descending ? "rating" : sort === "caloriesBurned" ? "caloriesBurned" : "duration";
  return filtered.sort((a, b) => {
    const diff = Number(a[key]) - Number(b[key]);
    if (diff !== 0) return descending ? -diff : diff;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
}
