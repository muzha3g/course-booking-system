"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { Course } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourses } from "@/app/api/course";

export const Calendar = ({ state }: { state: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const fetchCourses = async () => {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      };
      fetchCourses();
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <>Loading</>;

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
      events={courses}
      eventClick={(info) => {
        const eventObject = info.event;
        if (state === "user") {
          router.push("./user/courseDetails/" + eventObject.id);
        } else if (state === "admin") {
          router.push("./courseDetails/" + eventObject.id);
        }
      }}
    />
  );
};
