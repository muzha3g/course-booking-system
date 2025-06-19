import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coachFormSchema, CoachFormValues } from "@/schemas/coach";
import { defaultAvailableTime } from "@/constants/coach";
import { addCoach, updateCoach, deleteCoach } from "@/app/api/coach";
import { Coach } from "@/types";

export function useCoachForm(coach?: Coach | null, onSuccess?: () => void) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const isEditing = coach !== null;

  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: "",
      description: "",
      availableTimes: [defaultAvailableTime],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availableTimes",
  });

  const watchedAvailableTimes = useWatch({
    control: form.control,
    name: "availableTimes",
  });

  const onSubmit = async (data: CoachFormValues) => {
    try {
      if (isEditing && coach?.id) {
        await updateCoach({ id: coach.id, ...data });
      } else {
        await addCoach(data);
      }
      form.reset();
      setIsSheetOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving coach:", error);
      alert("Failed to save coach. Please try again.");
    }
  };

  const handleDelete = async (coachId: string) => {
    try {
      await deleteCoach(coachId);
      setIsSheetOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting coach:", error);
      alert("Failed to delete coach. Please try again.");
    }
  };

  const resetValueOnAvailableTime = (index: number) => {
    form.setValue(`availableTimes.${index}.courseType`, "");
    form.setValue(`availableTimes.${index}.weekday`, "");
    form.setValue(`availableTimes.${index}.time`, "");
    form.clearErrors(`availableTimes.${index}` as const);
  };

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

  useEffect(() => {
    if (coach) {
      form.reset({
        name: coach.name,
        description: coach.description,
        availableTimes: coach.availableTimes,
      });
      setIsSheetOpen(true);
    }
  }, [coach, form]);

  useEffect(() => {
    if (!isSheetOpen) {
      form.reset();
    }
  }, [isSheetOpen, form]);

  return {
    form,
    fields,
    append,
    remove,
    watchedAvailableTimes,
    isSheetOpen,
    setIsSheetOpen,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit),
    handleDelete,
    resetValueOnAvailableTime,
    isLastRowFilled,
    getOccupiedSlots,
  };
}
