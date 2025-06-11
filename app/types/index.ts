export type AvailableTime = {
  courseType: string;
  time: string;
  weekday: string;
};

export type Coach = {
  id: string;
  name: string;
  description: string;
  availableTimes: AvailableTime[];
};

export type Course = {
  id: string;
  coachId: string;
  coachName: string;
  coachDescription: string;
  courseType: string;
  date: string;
  datetime: string;
  reservations: [] | never[];
};
