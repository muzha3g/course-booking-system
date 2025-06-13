import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const CalendarComponent = () => {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridAWeek"
      timeZone="Asia/Taipei"
      height={500}
      views={{
        timeGridAWeek: { type: "timeGrid", duration: { days: 7 } },
      }}
      allDaySlot={false}
      slotMinTime={"09:00:00"}
      slotMaxTime={"22:00:00"}
      slotDuration={{ hours: 1 }}
      events={[
        {
          title: "Sample Event",
          start: "2025-06-13T10:00:00",
          end: "2025-06-13T12:00:00",
        },
        {
          title: "Other Event",
          start: "2025-06-13T10:00:00",
          end: "2025-06-13T12:00:00",
        },
      ]}
    />
  );
};

export default CalendarComponent;
