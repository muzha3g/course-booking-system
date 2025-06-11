import { generateCourseData } from "@/app/api/generateCourseData";

export default function page() {
  generateCourseData();
  return <div>page</div>;
}
