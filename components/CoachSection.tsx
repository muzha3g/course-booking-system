"use client";

import { CoachCard } from "@/components/CoachCard";
import { AddCoachSheet } from "./Coach/AddCoachSheet";
import { getCoachesInRealTime } from "@/app/api/coach";
import { useEffect, useState } from "react";
import { Coach } from "@/types";

export function CoachSection() {
  const [coachList, setCoachList] = useState<Coach[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  useEffect(() => {
    const unsubscribe = getCoachesInRealTime((coachData: Coach[]) => {
      setCoachList(coachData);
      setLoading(false);
      return () => unsubscribe();
    });
  }, []);

  const handleCardClick = (coach: Coach) => {
    setSelectedCoach(coach);
  };

  if (loading) return <p>Loading...</p>;
  return (
    <main className="p-1 py-2">
      <AddCoachSheet
        coach={selectedCoach}
        onClick={() => setSelectedCoach(null)}
      />
      <section className="grid grid-cols-4 gap-5 py-5">
        {coachList?.map((coach, index) => (
          <CoachCard
            key={index}
            coachName={coach.name}
            onClick={() => handleCardClick(coach)}
          />
        ))}
      </section>
    </main>
  );
}
