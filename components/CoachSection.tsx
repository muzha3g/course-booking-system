"use client";

import { CoachCard } from "@/components/CoachCard";
import { AddCoachSheet } from "@/components/AddCoachSheet";
import { getCoaches } from "@/app/api/coach";
import { useEffect, useState } from "react";
import { Coach } from "@/types";

export function CoachSection() {
  const [coachList, setCoachList] = useState<Coach[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = getCoaches((coachData: Coach[]) => {
      setCoachList(coachData);
      setLoading(false);
      return () => unsubscribe();
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <main className="p-1 py-2">
      <AddCoachSheet />
      <section className="grid grid-cols-4 gap-5 py-5">
        {coachList?.map((coach, index) => (
          <CoachCard key={index} coachName={coach.name} />
        ))}
      </section>
    </main>
  );
}
