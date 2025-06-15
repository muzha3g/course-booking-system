"use client";

import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import CourseBookingButton from "@/components/CourseBookingButton";
import CourseBookingSearchAndCancelButton from "@/components/CourseBookingSearchAndCancelButton";

export default function page() {
  const role = "user";
  return (
    <>
      <nav className="flex justify-end p-10">
        {/* <Button variant={"outline"}>Search / Cancel Booking</Button> */}
        {/* <CourseBookingButton /> */}
        <CourseBookingSearchAndCancelButton />
      </nav>
      <div className="h-full px-48 max-lg:px-20">
        <Calendar role={role} />
      </div>
    </>
  );
}
