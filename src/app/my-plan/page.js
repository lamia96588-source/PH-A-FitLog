import { Suspense } from "react";
import { MyPlanView } from "@/components/my-plan-view";

export const metadata = { title: "My Plan — Fit Log" };

export default function MyPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Loading workouts…
        </div>
      }
    >
      <MyPlanView />
    </Suspense>
  );
}
