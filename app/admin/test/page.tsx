import { generateCourseFromCoach } from "@/app/api/course";
import { getCoaches } from "@/app/api/coach";

export default async function page() {
  generateCourseFromCoach();
  const coach = await getCoaches();
  console.log(coach);
  return <div>page</div>;
}
