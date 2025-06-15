"use client";

import { CoachCard } from "./components/CoachCard";
import { AddCoachSheet } from "./components/AddCoachSheet";
import { getCoaches } from "@/app/api/coach";
import { useEffect, useState, useContext } from "react";
import { Context } from "@/context";
import { Coach } from "@/types";

export default function CoachSection() {
  const [coachList, setCoachList] = useState<Coach[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { countOnCreateNewCoach } = useContext(Context);

  useEffect(() => {
    getCoaches().then((data) => {
      setCoachList(data);
      setLoading(false);
    });
  }, [countOnCreateNewCoach]);

  if (loading) return <p>Loading...</p>;
  return (
    <main className="p-1 py-2">
      <AddCoachSheet />
      <section className="grid grid-cols-4 gap-5 py-5">
        {coachList.map((coach, index) => (
          <CoachCard key={index} coachName={coach.name} />
        ))}
      </section>
    </main>
  );
}
