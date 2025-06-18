import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getCoaches = (callback) => {
  return onSnapshot(collection(db, "coach"), (snapshot) => {
    const coaches = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    callback(coaches);
  });
};
