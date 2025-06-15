import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function subscribeToAuthChanges(callback) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe;
}
