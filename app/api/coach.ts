import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coach } from "@/types";

export const getCoaches = (callback) => {
  return onSnapshot(collection(db, "coach"), (snapshot) => {
    const coaches = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    callback(coaches);
  });
};

export const addCoach = async (data: Coach[]) => {
  await addDoc(collection(db, "coach"), data);
};
