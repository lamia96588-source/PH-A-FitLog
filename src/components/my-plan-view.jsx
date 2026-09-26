"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePlan } from "@/context/plan-context";
import {
  CheckIcon,
  ClockIcon,
  FlameIcon,
  StarIcon,
  XIcon,
} from "@/components/icons";

export function MyPlanView() {
  const { plan, saved, hydrated, removeFromPlan, toggleDone, toggleSave } =
    usePlan();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(() =>
    searchParams.get("tab") === "saved" ? "saved" : "plan"
  );

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Loading workouts…
      </div>
    );
  }

  const totals = plan.reduce(
    (acc, item) => ({
      minutes: acc.minutes + item.duration,
      calories: acc.calories + item.caloriesBurned,
    }),
    { minutes: 0, calories: 0 }
  );

  const items = tab === "plan" ? plan : saved;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
        MY PLAN
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Exercises" value={plan.length} />
        <MetricCard label="Minutes" value={totals.minutes} />
        <MetricCard label="Calories" value={totals.calories} />
      </div>

      <div className="mt-8 inline-flex rounded-full border border-white/15 bg-zinc-900/70 p-1">
        <TabButton active={tab === "plan"} onClick={() => setTab("plan")}>
          Today&apos;s Plan
        </TabButton>
        <TabButton active={tab === "saved"} onClick={() => setTab("saved")}>
          Saved
        </TabButton>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item) =>
            tab === "plan" ? (
              <PlanRow
                key={item.id}
                item={item}
                onRemove={removeFromPlan}
                onToggleDone={toggleDone}
              />
            ) : (
              <SavedRow key={item.id} item={item} onRemove={toggleSave} />
            )
          )}
        </ul>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
        active ? "bg-accent text-zinc-950" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function StatsRow({ item }) {
  return (
    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
      <span className="flex items-center gap-1">
        <ClockIcon className="h-3.5 w-3.5 text-accent" />
        {item.duration} min
      </span>
      <span className="flex items-center gap-1">
        <FlameIcon className="h-3.5 w-3.5 text-orange-400" />
        {item.caloriesBurned} kcal
      </span>
      <span className="flex items-center gap-1">
        <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
        {item.rating}
      </span>
    </div>
  );
}

function PlanRow({ item, onRemove, onToggleDone }) {
  return (
    <li
      className={`flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:flex-row sm:items-center ${
        item.done ? "opacity-60" : ""
      }`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-full rounded-xl object-cover sm:w-28"
      />
      <div className="min-w-0 flex-1">
        <h3
          className={`font-bold text-white ${item.done ? "line-through" : ""}`}
        >
          {item.name}
        </h3>
        <p className="text-sm text-zinc-400">{item.equipment}</p>
        <StatsRow item={item} />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link
          href={`/workouts/${item.id}`}
          className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-accent/60 hover:text-accent"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onToggleDone(item.id, item.name, item.done)}
          aria-label={item.done ? "Undo done" : "Mark as done"}
          className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            item.done
              ? "border-accent bg-accent/10 text-accent"
              : "border-white/25 text-white hover:border-accent/60"
          }`}
        >
          <CheckIcon className="h-3.5 w-3.5" />
          {item.done ? "Undo done" : "Mark as Done"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id, item.name)}
          aria-label={`Remove ${item.name} from today's plan`}
          title="Remove"
          className="cursor-pointer rounded-full border border-white/25 p-2 text-zinc-300 transition-colors hover:border-red-400/60 hover:text-red-400"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function SavedRow({ item, onRemove }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:flex-row sm:items-center">
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-full rounded-xl object-cover sm:w-28"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-white">{item.name}</h3>
        <p className="text-sm text-zinc-400">{item.equipment}</p>
        <StatsRow item={item} />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link
          href={`/workouts/${item.id}`}
          className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-accent/60 hover:text-accent"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onRemove(item)}
          aria-label={`Remove ${item.name} from saved`}
          title="Remove"
          className="cursor-pointer rounded-full border border-white/25 p-2 text-zinc-300 transition-colors hover:border-red-400/60 hover:text-red-400"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 p-12 text-center">
      <p className="text-2xl font-extrabold uppercase tracking-tight text-zinc-500">
        NOTHING HERE YET
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Browse the library and build today&apos;s five-lift plan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-opacity hover:opacity-85"
      >
        Go to workouts
      </Link>
    </div>
  );
}
