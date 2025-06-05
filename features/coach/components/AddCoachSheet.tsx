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
import { useForm, useWatch, Controller } from "react-hook-form";
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

import { useState, useEffect } from "react";

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

const defaultAvailableTime = { courseType: "", weekday: "", time: "" };

const courseTypes = ["Basic Skating", "Figure Skating", "Ice ball"];

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
      availableTimes: [defaultAvailableTime],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await addDoc(collection(db, "coach"), data);
      alert("Coach added successfully!");
      form.reset();
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error adding coach:", error);
      alert("Failed to add coach. Please try again.");
      setIsSheetOpen(true);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availableTimes",
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isSheetOpen) {
      form.reset();
    }
  }, [isSheetOpen]);

  function resetValueOnAvailableTime(index: number) {
    form.setValue(`availableTimes.${index}.courseType`, "");
    form.setValue(`availableTimes.${index}.weekday`, "");
    form.setValue(`availableTimes.${index}.time`, "");
    form.clearErrors(`availableTimes.${index}` as const);
  }

  const watchedAvailableTimes = useWatch({
    control: form.control,
    name: "availableTimes",
  });

  const isLastRowFilled = () => {
    if (!watchedAvailableTimes || watchedAvailableTimes.length === 0) {
      return false;
    }
    const lastEntry = watchedAvailableTimes[watchedAvailableTimes.length - 1];
    return (
      lastEntry.courseType !== "" &&
      lastEntry.weekday !== "" &&
      lastEntry.time !== ""
    );
  };

  const getOccupiedSlots = (currentIndex: number) => {
    const occupied = new Set<string>();
    watchedAvailableTimes.forEach((item, index) => {
      if (index !== currentIndex && item.weekday && item.time) {
        occupied.add(`${item.weekday}-${item.time}`);
      }
    });
    return occupied;
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
          <MdOutlineAddCircle />
          Add Coach
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[500px] !max-w-none">
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

              {fields.map((field, index) => {
                const occupiedSlots = getOccupiedSlots(index);
                const currentWeekday = watchedAvailableTimes[index]?.weekday;
                return (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="">
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

                    <div className="">
                      <Controller
                        control={form.control}
                        name={`availableTimes.${index}.weekday`}
                        render={({ field: selectField }) => (
                          <Select
                            // onValueChange={selectField.onChange}
                            value={selectField.value}
                            onValueChange={(val) => {
                              selectField.onChange(val);
                              form.setValue(`availableTimes.${index}.time`, "");
                            }}
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
                      {form.formState.errors.availableTimes?.[index]
                        ?.weekday && (
                        <p className="text-red-500 text-sm">
                          {
                            form.formState.errors.availableTimes[index]?.weekday
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="">
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
                                <SelectItem
                                  key={t}
                                  value={t}
                                  disabled={
                                    !!(
                                      currentWeekday &&
                                      occupiedSlots.has(
                                        `${currentWeekday}-${t}`
                                      )
                                    )
                                  }
                                >
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
                    {fields.length > 1 ? (
                      <Button
                        className="round"
                        type="button"
                        variant="secondary"
                        onClick={() => remove(index)}
                      >
                        d
                      </Button>
                    ) : (
                      <Button
                        className="round"
                        type="button"
                        variant="secondary"
                        onClick={() => resetValueOnAvailableTime(index)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                );
              })}
              {form.formState.errors.availableTimes && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.availableTimes.message}
                </p>
              )}
              <div className="my-4">
                {isLastRowFilled() && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => append(defaultAvailableTime)}
                    className="rounded-full"
                  >
                    Add Other Time
                  </Button>
                )}
              </div>
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
