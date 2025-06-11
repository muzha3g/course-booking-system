import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";

export const addCourseToFirebase = async (course: Course) => {
  await setDoc(doc(db, "course", course.id), course);
  console.log(
    `[CREATE] 新課程：${course.coachName} - ${course.courseType} @ ${course.datetime}`
  );
};
