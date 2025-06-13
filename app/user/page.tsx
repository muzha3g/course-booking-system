"use client";

import { Calendar } from "@/features/calendar/Calendar";

export default function page() {
  return (
    <div className="h-full px-48 max-lg:px-20">
      User page
      <Calendar />
    </div>
  );
}
