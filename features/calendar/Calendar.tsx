import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";

const CalendarComponent = () => {
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
      events={[
        {
          title: "Sample Event",
          start: "2025-06-13T10:00:00Z",
          end: "2025-06-13T12:00:00Z",
        },
      ]}
    />
  );
};

export default CalendarComponent;
