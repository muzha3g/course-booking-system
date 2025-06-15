import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCourses } from "./course";

export function subscribeToAuthChanges(callback: any) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe;
}

export async function getUserBookingCourses(userId: string) {
  const courses = await getCourses();

  const bookedCourses = courses.filter((course) => {
    return course.reservations.some(
      (reservation) => reservation.userId === userId
    );
  });
  return bookedCourses;
}
