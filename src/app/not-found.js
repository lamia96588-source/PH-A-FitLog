import Link from "next/link";

export const metadata = { title: "404 — Fit Log" };

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
        404 — PAGE NOT FOUND
      </p>
      <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        No reps for this page.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
        The page you are after isn&apos;t in our library. Head back and pick a
        lift instead.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-opacity hover:opacity-85"
      >
        Go to workouts
      </Link>
    </div>
  );
}
