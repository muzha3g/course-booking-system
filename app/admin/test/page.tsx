import { getCoaches } from "@/app/api/coach";
import { getCourses } from "@/app/api/course";

export default function page() {
  getCourses();
  return <div>page</div>;
}
