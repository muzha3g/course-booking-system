import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDays, format } from "date-fns";

type AvailableTime = {
  courseType: string;
  time: string;
  weekday: string;
};

type Coach = {
  id: string;
  name: string;
  description: string;
  availableTimes: AvailableTime[];
};

type Course = {
  id: string;
  coachId: string;
  coachName: string;
  coachDescription: string;
  courseType: string;
  date: string;
  datetime: string;
  reservations: [] | never[];
};

const coaches: Coach[] = [];

const getAllCoach = async () => {
  const querySnapshot = await getDocs(collection(db, "coach"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    coaches.push(data);
  });
};

const writeCourseDataToFirebase = async (course: Course) => {
  await setDoc(doc(db, "course", course.id), course);
  console.log(
    `[CREATE] 新課程：${course.coachName} - ${course.courseType} @ ${course.datetime}`
  );
};

const allCourses = [];

const getAllCourse = async () => {
  const q = query(collection(db, "course"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    allCourses.push(doc.data());
  });
};

getAllCourse();

const generateCourseData = async (days = 14) => {
  await getAllCoach();

  const courses = [];
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
          courses.push(course);
        }
      }
    }
  }

  for (const course of courses) {
    writeCourseDataToFirebase(course);
  }
};

export default function Page() {
  generateCourseData();
  return <h1>Admin index</h1>;
}
