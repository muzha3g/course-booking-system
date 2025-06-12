"use client";

import { CoachCard } from "./components/CoachCard";
import { AddCoachSheet } from "./components/AddCoachSheet";

export default function CoachSection() {
  return (
    <main className="p-1 py-2">
      <AddCoachSheet />
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
