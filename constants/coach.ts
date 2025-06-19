export const times = Array.from({ length: 13 }, (_, i) => ({
  label: `${String(i + 9).padStart(2, "0")}:00 - ${String(i + 10).padStart(
    2,
    "0"
  )}:00`,
  value: String(i + 9),
}));

export const weekdays = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "0" },
];

export const courseTypes = ["Basic Skating", "Figure Skating", "Ice ball"];
export const defaultAvailableTime = { courseType: "", weekday: "", time: "" };
