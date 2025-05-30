"use client";

import { Button } from "@/components/ui/button";
import { CoachCard } from "./components/CoachCard";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const addCoach = async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

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
