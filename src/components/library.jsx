"use client";

import { useMemo, useState } from "react";
import { filterAndSortWorkouts } from "@/lib/workouts";
import { WorkoutCard } from "@/components/workout-card";
import { ChevronDownIcon, SearchIcon, XIcon } from "@/components/icons";

const SORT_OPTIONS = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export function LibrarySection({ workouts }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("duration");

  const visible = useMemo(
    () => filterAndSortWorkouts(workouts, query, sort),
    [workouts, query, sort]
  );

  return (
    <section
      id="library"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            THE LIBRARY
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or muscle group"
              aria-label="Search workouts by name or muscle group"
              className="h-11 w-full rounded-full border border-white/15 bg-zinc-900/70 pl-10 pr-9 text-sm text-white placeholder:text-zinc-500 focus:border-accent/60 focus:outline-none sm:w-64"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="library-sort"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-400"
            >
              Sort By
            </label>
            <div className="relative">
              <select
                id="library-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 cursor-pointer appearance-none rounded-full border border-white/15 bg-zinc-900/70 py-0 pl-4 pr-10 text-sm font-semibold text-white focus:border-accent/60 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {workouts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-8 text-center text-sm text-zinc-400">
          Couldn&apos;t load workouts right now — the API may be down. Refresh
          the page to try again.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-8 text-center text-sm text-zinc-400">
          No workouts match &quot;{query}&quot;.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </section>
  );
}
