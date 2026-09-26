"use client";

import { usePlan } from "@/context/plan-context";
import { BookmarkIcon, CheckIcon, PlusIcon } from "@/components/icons";

export function WorkoutActions({ workout }) {
  const { addToPlan, toggleSave, planIds, savedIds, planIsFull } = usePlan();

  const inPlan = planIds.has(workout.id);
  const isSaved = savedIds.has(workout.id);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => addToPlan(workout)}
        disabled={inPlan || planIsFull}
        title={
          planIsFull && !inPlan
            ? "Plan is full — remove a lift first"
            : undefined
        }
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {inPlan ? (
          <>
            <CheckIcon className="h-4 w-4" />
            In today&apos;s plan
          </>
        ) : (
          <>
            <PlusIcon className="h-4 w-4" />
            Add to today&apos;s plan
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => toggleSave(workout)}
        className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full border px-6 text-sm font-bold uppercase tracking-wider transition-colors ${
          isSaved
            ? "border-accent bg-accent/10 text-accent"
            : "border-white/25 text-white hover:border-white/60"
        }`}
      >
        <BookmarkIcon className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved for later" : "Save for later"}
      </button>
    </div>
  );
}
