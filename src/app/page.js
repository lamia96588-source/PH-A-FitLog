import { Hero } from "@/components/hero";
import { LibrarySection } from "@/components/library";
import { getAllWorkouts } from "@/lib/workouts";

export default async function Home() {
  const workouts = await getAllWorkouts();

  return (
    <>
      <Hero />
      <LibrarySection workouts={workouts} />
    </>
  );
}
