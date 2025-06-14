import { doc, setDoc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Data = {
  userId: string;
  userName: string;
};

export const addUserToCourseReservation = async (
  courseId: string,
  userId: string,
  userName: string
) => {
  try {
    const convertedCourseId = courseId.replace(/%3A/g, ":");
    const courseToBookRef = doc(db, "course", convertedCourseId);
    const courseToBookSnap = await getDoc(courseToBookRef);
    const courseToBook = courseToBookSnap.data();

    const isUserBookAlready = courseToBook?.reservations.some(
      (data: Data) => data.userId === userId
    );
    if (isUserBookAlready) {
      return "User already booked this course.";
    } else {
      updateDoc(courseToBookRef, {
        reservations: arrayUnion({ userId, userName }),
      }).then(() => {});

      return "Booking Success";
    }
  } catch (e) {
    throw new Error("Failed to addUserToCourseReservation.");
  }
};
