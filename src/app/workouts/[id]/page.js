import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkout } from "@/lib/workouts";
import { WorkoutActions } from "@/components/workout-actions";
import { StarIcon } from "@/components/icons";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) return { title: "Workout not found — Fit Log" };
  return { title: `${workout.name} — Fit Log` };
}

export default async function WorkoutDetailPage({ params }) {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) notFound();

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <img
            src={workout.image}
            alt={workout.name}
            className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent"
              >
                {group}
              </span>
            ))}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
            {workout.name}
          </h1>
          <p className="mt-4 leading-7 text-zinc-400">{workout.description}</p>

          <table className="mt-8 w-full text-sm">
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label} className="border-b border-white/10">
                  <th
                    scope="row"
                    className="py-2.5 text-left font-medium text-zinc-500"
                  >
                    {label}
                  </th>
                  <td className="py-2.5 text-right font-semibold text-white">
                    {value}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-white/10">
                <th
                  scope="row"
                  className="py-2.5 text-left font-medium text-zinc-500"
                >
                  Rating
                </th>
                <td className="py-2.5 text-right font-semibold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    {workout.rating}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Instructions
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-300 marker:font-bold marker:text-accent">
              {workout.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-8">
            <WorkoutActions workout={workout} />
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-zinc-400 transition-colors hover:text-accent"
      >
        ← Back to the library
      </Link>
    </div>
  );
}
