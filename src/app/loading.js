export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/5" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60"
          >
            <div className="aspect-video w-full animate-pulse bg-white/10" />
            <div className="flex flex-col gap-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
