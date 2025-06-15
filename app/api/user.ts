import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function subscribeToAuthChanges(callback: any) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe;
}
