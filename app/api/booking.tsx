import { doc, setDoc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

    console.log("courseToBook:", courseToBook);
    console.log("userId:", userId);
    console.log("userName:", userName);

    const isUserBookAlready = courseToBook?.reservations.some(
      (data) => data.userId === userId
    );
    if (isUserBookAlready) {
      return "User already booked this course.";
    } else {
      //   await updateDoc(courseToBookRef, {
      //     reservations: arrayUnion({ userId, userName }),
      //   });

      updateDoc(courseToBookRef, {
        reservations: arrayUnion({ userId, userName }),
      }).then(() => {});

      return "Booking Success";
    }
  } catch (e) {
    throw new Error("Failed to addUserToCourseReservation.");
  }
};
