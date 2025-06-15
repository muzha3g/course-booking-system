import { doc, setDoc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCourse } from "./course";
import { getCourses } from "./course";

type Data = {
  userId: string;
  userName: string;
};

export async function addUserToCourseReservation(
  courseId: string,
  userId: string,
  userName: string
) {
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
}

export async function deleteUserFromCourseReservation(
  userId: string,
  courseId: string
) {
  const courseRef = doc(db, "course", courseId);
  const course = await getCourse(courseId);
  const newReservations = course?.reservations.filter(
    (data) => data.userId !== userId
  );
  console.log(newReservations);
  await updateDoc(courseRef, {
    reservations: newReservations,
  });
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
