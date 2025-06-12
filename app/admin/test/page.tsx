import { generateCourseFromCoach } from "@/app/api/course";

export default function page() {
  generateCourseFromCoach();
  return <div>page</div>;
}
