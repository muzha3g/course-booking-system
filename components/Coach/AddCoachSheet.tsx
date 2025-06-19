"use client";

import { Button } from "@/components/ui/button";
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
import { Coach } from "@/types";
import { useCoachForm } from "@/hooks/useCoachForm";
import { CoachForm } from "./CoachForm";
import { defaultAvailableTime } from "@/constants/coach";

interface AddCoachSheetProps {
  coach?: Coach | null;
  onClick?: () => void;
}

export function AddCoachSheet({ coach, onClick }: AddCoachSheetProps) {
  const {
    form,
    fields,
    append,
    remove,
    watchedAvailableTimes,
    isSheetOpen,
    setIsSheetOpen,
    isEditing,
    onSubmit,
    handleDelete,
    resetValueOnAvailableTime,
    isLastRowFilled,
    getOccupiedSlots,
  } = useCoachForm(coach, onClick);

  const handleAddClick = () => {
    form.reset({
      name: "",
      description: "",
      availableTimes: [defaultAvailableTime],
    });
    setIsSheetOpen(true);
    onClick?.();
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" onClick={handleAddClick}>
          <MdOutlineAddCircle />
          Add Coach
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[500px] !max-w-none">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {isEditing ? "Edit Coach" : "New Coach"}
          </SheetTitle>
        </SheetHeader>

        <section className="flex-1 px-4">
          <CoachForm
            form={form}
            fields={fields}
            append={append}
            remove={remove}
            watchedAvailableTimes={watchedAvailableTimes}
            resetValueOnAvailableTime={resetValueOnAvailableTime}
            isLastRowFilled={isLastRowFilled}
            getOccupiedSlots={getOccupiedSlots}
            onSubmit={onSubmit}
          />
        </section>

        <SheetFooter>
          <Button type="submit" form="coach-info-form">
            {isEditing ? "Update" : "Create"}
          </Button>

          {isEditing && (
            <Button
              variant="destructive"
              onClick={() => handleDelete(coach!.id)}
            >
              Delete
            </Button>
          )}

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
