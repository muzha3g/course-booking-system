import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  addDays,
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { getCoaches } from "./coach";
import { Course, Coach } from "@/types";

export const getCourse = async (courseId: string) => {
  try {
    const convertedCourseId = courseId.replace(/%3A/g, ":");
    const courses = await getCourses();
    return courses.find((course) => course.id == convertedCourseId);
  } catch (error) {
    console.error("Error fetching course", error);
    throw new Error("Failed to fetch course.");
  }
};

export const getCourses = async () => {
  try {
    const courses: Course[] = [];
    const querySnapshot = await getDocs(collection(db, "course"));
    querySnapshot.forEach((doc) => {
      courses.push(doc.data() as Course);
    });
    return courses;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw new Error("Failed to fetch course.");
  }
};

export const addCourseToFirebase = async (course: Course) => {
  await setDoc(doc(db, "course", course.id), course);
  console.log(
    `[CREATE] 新課程：${course.coachName} - ${course.title} @ ${course.date}`
  );
};

export const generateCourseFromCoach = async (days = 14) => {
  const coaches: Coach[] = await getCoaches();
  const newCourses: Course[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const currentDate = addDays(today, i);
    const currentDayIndex = currentDate.getDay();

    for (const coach of coaches) {
      for (const availableTimes of coach.availableTimes) {
        const { courseType, time, weekday } = availableTimes;
        if (Number(weekday) === currentDayIndex) {
          const hour = Number(time);

          let startDatetime = setHours(currentDate, hour);
          startDatetime = setMinutes(startDatetime, 0);
          startDatetime = setSeconds(startDatetime, 0);
          startDatetime = setMilliseconds(startDatetime, 0);
          const startISO = startDatetime.toISOString();

          let endDatetime = setHours(startDatetime, hour + 1);
          endDatetime = setMinutes(endDatetime, 0);
          endDatetime = setSeconds(endDatetime, 0);
          endDatetime = setMilliseconds(endDatetime, 0);

          const endISO = endDatetime.toISOString();

          const courseQuery = query(
            collection(db, "course"),
            where("coachId", "==", coach.id),
            where("start", "==", startISO)
          );

          const snapshot = await getDocs(courseQuery);
          if (!snapshot.empty) {
            console.log(
              `[SKIP] 已存在課程：${coach.name} - ${courseType} @ ${currentDate}`
            );
            continue;
          }

          const course = {
            id: coach.id + startISO,
            coachId: coach.id,
            coachName: coach.name,
            coachDescription: coach.description,
            title: courseType,
            date:
              format(startDatetime, "yyyy-MM-dd") +
              " " +
              `${hour}:00 - ${hour + 1}:00`,
            reservations: [],
            start: startISO,
            end: endISO,
          };
          newCourses.push(course as Course);
        }
      }
    }
  }

  const promises = newCourses.map((course) => addCourseToFirebase(course));
  await Promise.all(promises);
  console.log(`Successfully added ${newCourses.length} new courses.`);
};
