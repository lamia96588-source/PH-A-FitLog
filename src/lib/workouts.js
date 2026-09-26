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
 * Fetch JSON from the given URL. Retries once after a short pause on
 * transient failures (network error, timeout, 429, 5xx), since the public
 * API rate-limits bursts. Returns null when the endpoint stays unusable.
 * @param {string} url
 * @returns {Promise<{ status: number, body: any } | null>}
 */
async function fetchJson(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (res.status === 404) return { status: 404, body: null };
      if (res.ok || (res.status !== 429 && res.status < 500)) {
        return { status: res.status, body: await res.json() };
      }
    } catch {
      // network error, timeout, or non-JSON body — fall through to retry
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  return null;
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

/** Build-time and per-instance memo of the full list. */
let listCache = null;

/**
 * Fetch every workout from the remote API, trying each host in order.
 * The result is memoized, so repeated calls (generateStaticParams, the
 * home page, detail pages) hit the API once per process — the public API
 * rate-limits bursts during static builds.
 * @returns {Promise<object[]>} normalized workouts, or [] if every host fails
 */
export async function getAllWorkouts() {
  if (listCache) return listCache;
  for (const host of HOSTS) {
    const res = await fetchJson(`${host}/api/fitlog`);
    if (!res) continue;
    const list = extractList(res.body);
    if (!list) continue;
    listCache = sanitizeList(list);
    return listCache;
  }
  return [];
}

/**
 * Fetch a single workout by id. Uses the memoized list when available;
 * otherwise tries the single endpoint on each host, then falls back to
 * fetching (and caching) the full list and finding the id there.
 * @param {string|number} id
 * @returns {Promise<object|null>} the workout, or null if not found
 *   or every host fails
 */
export async function getWorkout(id) {
  const wanted = String(id);
  if (listCache) {
    return listCache.find((item) => String(item.id) === wanted) ?? null;
  }
  for (const host of HOSTS) {
    const res = await fetchJson(
      `${host}/api/fitlog/${encodeURIComponent(wanted)}`
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
  const list = await getAllWorkouts();
  return list.find((item) => String(item.id) === wanted) ?? null;
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
