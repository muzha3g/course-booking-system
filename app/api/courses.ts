import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "../types";

const courseConverter = {
  toFirestore: (course: Course) => {
    const { ...data } = course;
    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Course => {
    const data = snapshot.data(options);
    return {
      id: data.id,
      coachId: data.coachId,
      coachName: data.coachName,
      coachDescription: data.coachDescription,
      courseType: data.courseType,
      date: data.date,
      datetime: data.datetime,
      reservations: data.reservations || [],
    } as Course;
  },
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const coursesCollectionRef = collection(db, "course").withConverter(
      courseConverter
    );
    const q = query(coursesCollectionRef);
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      courses.push(doc.data());
    });
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses.");
  }
};

export const addCourse = async (course: Course): Promise<void> => {
  try {
    await setDoc(
      doc(db, "course", course.id).withConverter(courseConverter),
      course
    );
    console.log(
      `[CREATE] 新課程：${course.coachName} - ${course.courseType} @ ${course.datetime}`
    );
  } catch (error) {
    console.error("Error writing course data:", error);
    throw new Error("Failed to add course.");
  }
};

export const checkCourseExists = async (
  coachId: string,
  datetime: Date
): Promise<boolean> => {
  try {
    const coursesCollectionRef = collection(db, "course").withConverter(
      courseConverter
    );
    const q = query(
      coursesCollectionRef,
      where("coachId", "==", coachId),
      where("datetime", "==", datetime)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking course existence:", error);
    throw new Error("Failed to check course existence.");
  }
};
