"use client";

import { Calendar } from "@/components/Calendar";
import CourseBookingSearchAndCancelButton from "@/components/CourseBookingSearchAndCancelButton";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const role = pathname.slice(1);

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
