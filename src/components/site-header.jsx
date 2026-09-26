"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlan } from "@/context/plan-context";

const NAV_LINKS = [
  {
    href: "/",
    label: "Workout",
    match: (path) => path === "/" || path.startsWith("/workouts"),
  },
  {
    href: "/my-plan",
    label: "My Plan",
    match: (path) => path.startsWith("/my-plan"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { planCount, savedCount } = usePlan();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="Fit Log logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-lg font-extrabold tracking-tight text-white">
            FIT<span className="text-accent">LOG</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                  active ? "text-accent" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-85"
          >
            Plan
            <span className="rounded-full bg-zinc-950/15 px-1.5 text-xs tabular-nums">
              {planCount}
            </span>
          </Link>
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:border-white/60"
          >
            Saved
            <span className="text-xs text-zinc-400 tabular-nums">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
