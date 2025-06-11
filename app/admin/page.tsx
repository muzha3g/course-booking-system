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

type AvailableTimes = {
  courseType: string;
  time: string;
  weekday: string;
};

type Coach = {
  id: string;
  name: string;
  description: string;
  availableTimes: AvailableTimes[];
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

const coachData: Coach[] = [];

const getCoachData = async () => {
  const querySnapshot = await getDocs(collection(db, "coach"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    coachData.push(data);
  });
};

const writeCourseDataToFirebase = async (course: Course) => {
  await setDoc(doc(db, "course", course.id), course);
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
  await getCoachData();

  const courses = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dayIndex = date.getDay();

    coachData.forEach((coach) => {
      coach.availableTimes.forEach(async ({ courseType, time, weekday }) => {
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
            return;
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

          writeCourseDataToFirebase(course);
        }
      });
    });
  }
};

export default function Page() {
  getCoachData();
  generateCourseData();
  return <h1>Admin index</h1>;
}
