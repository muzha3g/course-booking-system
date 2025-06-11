import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "../../types";

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
