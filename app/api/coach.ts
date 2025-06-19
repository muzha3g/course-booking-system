import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coach } from "@/types";

export const getCoachesInRealTime = (callback) => {
  return onSnapshot(collection(db, "coach"), (snapshot) => {
    const coaches = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    callback(coaches);
  });
};

export const getCoaches = async () => {
  const querySnapshot = await getDocs(collection(db, "coach"));
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
};

export const addCoach = async (data: Coach[]) => {
  await addDoc(collection(db, "coach"), data);
};

export const updateCoach = async (coach: Coach) => {
  const coachRef = doc(db, "coach", coach.id);
  await updateDoc(coachRef, coach);
};
