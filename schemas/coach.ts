import { z } from "zod";

export const coachFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  availableTimes: z
    .array(
      z.object({
        courseType: z.string().nonempty("Course type is required"),
        weekday: z.string().nonempty("Weekday is required"),
        time: z.string().nonempty("Time is required"),
      })
    )
    .nonempty("At least one available time is required"),
});

export type CoachFormValues = z.infer<typeof coachFormSchema>;
