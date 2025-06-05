"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdOutlineAddCircle } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFieldArray } from "react-hook-form";

const times = Array.from(
  { length: 13 },
  (_, i) => `${i + 9}:00 - ${i + 10}:00`
);
const weekdays = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "0" },
];

const courseTypes = ["Basic Skating", "Figure Skating", "Ice ball"];

// const addCoach = async () => {
//   try {
//     const docRef = await addDoc(collection(db, "users"), {
//       first: "Ada",
//       last: "Lovelace",
//       born: 1815,
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// };

const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  availableTimes: z
    .array(
      z.object({
        courseType: z.string(),
        weekday: z.string(),
        time: z.string(),
      })
    )
    .nonempty(),
});

export function AddCoachSheet() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      availableTimes: [{ courseType: "", weekday: "", time: "" }],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    alert(data);
    console.log(data);
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availableTimes",
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <MdOutlineAddCircle />
          Add Coach
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">New Coach</SheetTitle>
        </SheetHeader>
        <section className="flex-1 px-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="coach-info-form"
          >
            <Label>Name</Label>
            <Input {...form.register("name")} required />

            <Label>Description</Label>
            <Textarea {...form.register("description")} required />
            <div className="space-y-3 py-1">
              <Label>Available Times</Label>
              {fields.map((field, index) => (
                <div className="flex gap-1" key={index}>
                  <Select
                    {...form.register(
                      `availableTimes.${index}.courseType` as const
                    )}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="type" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    {...form.register(
                      `availableTimes.${index}.weekday` as const
                    )}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="weekday" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekdays.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    {...form.register(`availableTimes.${index}.time` as const)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </form>
        </section>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" form="coach-info-form">
              Create
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
