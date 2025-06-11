import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coach } from "../types";

const coachConverter = {
  toFirestore: (coach: Coach) => {
    const { ...data } = coach;
    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Coach => {
    const data = snapshot.data(options);
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      availableTimes: data.availableTimes,
    } as Coach;
  },
};

export const getCoaches = async (): Promise<Coach[]> => {
  try {
    const coachesCollectionRef = collection(db, "coach").withConverter(
      coachConverter
    );
    const queryCoachSnapshot = await getDocs(coachesCollectionRef);
    const coaches: Coach[] = [];
    queryCoachSnapshot.forEach((doc) => {
      coaches.push(doc.data());
    });
    return coaches;
  } catch (error) {
    console.error("Error fetching coaches:", error);
    throw new Error("Failed to fetch coaches.");
  }
};
