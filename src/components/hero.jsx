import { assetUrl } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_75%_10%,rgba(204,255,0,0.09),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            WORKOUT LIBRARY
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
            Fit Log is your personal gym companion — browse twelve coach-picked
            lifts, stack a five-lift plan for today, and keep an eye on the
            calories you are about to burn.
          </p>
          <a
            href="#library"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-opacity hover:opacity-85"
          >
            BROWSE WORKOUTS
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src={assetUrl("/banner.png")}
            alt="Lifter training in the gym"
            width={334}
            height={334}
            className="h-auto w-full max-w-[380px] rounded-2xl border border-white/10 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
