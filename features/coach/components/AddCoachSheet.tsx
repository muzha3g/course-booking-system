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
import { useForm, Controller } from "react-hook-form";
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

import { useState } from "react";

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
//     const docRef = await addDoc(collection(db, "coaches"), {
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
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  availableTimes: z
    .array(
      z.object({
        courseType: z.string().nonempty("Course type is required"),
        weekday: z.string().nonempty("Weekday type is required"),
        time: z.string().nonempty("Time type is required"),
      })
    )
    .nonempty("At least one available time is required"),
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
    setIsSheetOpen(false);
    form.reset();
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availableTimes",
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
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
            <Input
              {...form.register("name")}
              className={form.formState.errors.name ? "border-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}

            <Label>Description</Label>
            <Textarea
              {...form.register("description")}
              className={
                form.formState.errors.description ? "border-red-500" : ""
              }
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}

            <div className="space-y-3 py-1">
              <Label>Available Times</Label>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Controller
                      control={form.control}
                      name={`availableTimes.${index}.courseType`}
                      render={({ field: selectField }) => (
                        <Select
                          onValueChange={selectField.onChange}
                          value={selectField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Course Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {courseTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.availableTimes?.[index]
                      ?.courseType && (
                      <p className="text-red-500 text-sm">
                        {
                          form.formState.errors.availableTimes[index]
                            ?.courseType?.message
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <Controller
                      control={form.control}
                      name={`availableTimes.${index}.weekday`}
                      render={({ field: selectField }) => (
                        <Select
                          onValueChange={selectField.onChange}
                          value={selectField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Weekday" />
                          </SelectTrigger>
                          <SelectContent>
                            {weekdays.map((d) => (
                              <SelectItem key={d.value} value={d.value}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.availableTimes?.[index]?.weekday && (
                      <p className="text-red-500 text-sm">
                        {
                          form.formState.errors.availableTimes[index]?.weekday
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <Controller
                      control={form.control}
                      name={`availableTimes.${index}.time`}
                      render={({ field: selectField }) => (
                        <Select
                          onValueChange={selectField.onChange}
                          value={selectField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {times.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.availableTimes?.[index]?.time && (
                      <p className="text-red-500 text-sm">
                        {
                          form.formState.errors.availableTimes[index]?.time
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {form.formState.errors.availableTimes && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.availableTimes.message}
                </p>
              )}
            </div>
          </form>
        </section>
        <SheetFooter>
          <Button
            type="submit"
            form="coach-info-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            Create
          </Button>

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
