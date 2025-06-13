import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { Course } from "@/types";
import { useRouter } from "next/navigation";

export const Calendar = ({ course }: { course: Course[] }) => {
  const router = useRouter();
  return (
    <FullCalendar
      plugins={[timeGridPlugin, momentTimezonePlugin]}
      initialView="timeGridAWeek"
      timeZone="Asia/Taipei"
      height={"auto"}
      views={{
        timeGridAWeek: { type: "timeGrid", duration: { days: 7 } },
      }}
      allDaySlot={false}
      slotMinTime={"09:00:00"}
      slotMaxTime={"22:00:00"}
      slotDuration={"00:30:00"}
      eventColor="black"
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      events={course}
      eventClick={(info) => {
        const eventObject = info.event;
        router.push("./courseDetails/" + eventObject.id);
      }}
    />
  );
};
