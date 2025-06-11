import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDays, format } from "date-fns";
import { addCourseToFirebase } from "./addCourseToFirebase";
import { getCoaches } from "./coach";
import { Course, Coach } from "@/types";

export const generateCourseData = async (days = 14) => {
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
