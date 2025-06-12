import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDays, format } from "date-fns";
import { getCoaches } from "./coach";
import { Course, Coach } from "@/types";

export const getCourses = async () => {
  try {
    const courses: Course[] = [];
    const querySnapshot = await getDocs(collection(db, "course"));
    querySnapshot.forEach((doc) => {
      courses.push(doc.data() as Course);
    });
    return courses;
  } catch (error) {
    console.error("Error fetching coaches:", error);
    throw new Error("Failed to fetch coaches.");
  }
};

export const addCourseToFirebase = async (course: Course) => {
  await setDoc(doc(db, "course", course.id), course);
  console.log(
    `[CREATE] 新課程：${course.coachName} - ${course.courseType} @ ${course.datetime}`
  );
};

export const generateCourseFromCoach = async (days = 14) => {
  const coaches: Coach[] = await getCoaches();
  const newCourses: Course[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dayIndex = date.getDay();

    for (const coach of coaches) {
      for (const { courseType, time, weekday } of coach.availableTimes) {
        if (Number(weekday) == dayIndex) {
          const hour = Number(time.slice(0, 2));
          const datetime = new Date(date);
          datetime.setHours(hour, 0, 0, 0);
          const iso = datetime.toISOString();

          const courseQuery = query(
            collection(db, "course"),
            where("coachId", "==", coach.id),
            where("datetime", "==", datetime)
          );

          const snapshot = await getDocs(courseQuery);
          if (!snapshot.empty) {
            console.log(
              `[SKIP] 已存在課程：${coach.name} - ${courseType} @ ${datetime}`
            );
            continue;
          }

          const course = {
            id: coach.id + iso,
            coachId: coach.id,
            coachName: coach.name,
            coachDescription: coach.description,
            courseType,
            date: format(datetime, "yyyy-MM-dd"),
            datetime: iso,
            reservations: [],
          };
          newCourses.push(course as Course);
        }
      }
    }
  }

  for (const course of newCourses) {
    addCourseToFirebase(course);
  }
};
