import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Fit Log logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-base font-extrabold tracking-tight text-white">
            FIT<span className="text-accent">LOG</span>
          </span>
        </Link>
        <p className="text-sm text-zinc-500">
          © 2026 Fit Log. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
