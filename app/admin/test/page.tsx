import { generateCourseFromCoach } from "@/app/api/course";

export default async function page() {
  generateCourseFromCoach();

  return <div>page</div>;
}
