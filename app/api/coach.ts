import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coach } from "@/types";

export const getCoaches = async (): Promise<Coach[]> => {
  try {
    const coaches: Coach[] = [];
    const querySnapshot = await getDocs(collection(db, "coach"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      coaches.push({ id: doc.id, ...data } as Coach);
    });
    return coaches;
  } catch (error) {
    console.error("Error fetching coaches:", error);
    throw new Error("Failed to fetch coaches.");
  }
};
