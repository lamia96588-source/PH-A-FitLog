import Link from "next/link";
import { ClockIcon, FlameIcon, StarIcon } from "@/components/icons";

export function WorkoutCard({ workout }) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition-colors hover:border-accent/60"
    >
      <img
        src={workout.image}
        alt={workout.name}
        loading="lazy"
        className="aspect-video w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-300"
            >
              {group}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold uppercase text-white transition-colors group-hover:text-accent">
          {workout.name}
        </h3>
        <p className="text-sm text-zinc-400">{workout.equipment}</p>
        <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-3 text-sm text-zinc-300">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-accent" />
            {workout.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <FlameIcon className="h-4 w-4 text-orange-400" />
            {workout.caloriesBurned} kcal
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            {workout.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
