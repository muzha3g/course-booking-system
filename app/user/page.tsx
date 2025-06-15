"use client";

import { Calendar } from "@/components/Calendar";
import CourseBookingSearchAndCancelButton from "@/components/CourseBookingSearchAndCancelButton";

export default function page() {
  const role = "user";
  return (
    <>
      <nav className="flex justify-end p-10">
        <CourseBookingSearchAndCancelButton />
      </nav>
      <div className="h-full px-48 max-lg:px-20">
        <Calendar role={role} />
      </div>
    </>
  );
}
