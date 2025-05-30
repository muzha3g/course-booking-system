import { Button } from "@/components/ui/button";
import { CoachCard } from "./components/CoachCard";

export default function CoachSection() {
  return (
    <main className="p-1 py-2">
      <Button variant="outline" className="hover:cursor-pointer">
        Add Coach
      </Button>
      <section className="grid grid-cols-4 gap-5 py-5">
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
        <CoachCard />
      </section>
    </main>
  );
}
