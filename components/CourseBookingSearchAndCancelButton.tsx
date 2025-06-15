"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";

export default function CourseBookingSearchAndCancelButton() {
  const [phone, setPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const InputSchema = z.object({
    phone: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = InputSchema.safeParse({ phone });

    if (!validationResult.success) {
      setErrorMessage(validationResult.error.errors[0].message);
      console.log(
        "Validation Error:",
        validationResult.error.errors[0].message
      );
      return;
    }

    console.log("Validation Success:", validationResult.data);
    console.log("Form submitted successfully!");

    try {
    } catch {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Search / Cancel Booking </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search / Cancel Booking </DialogTitle>
          <DialogDescription>
            Please enter your phone number to search booking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                name="phone-number"
                value={phone}
                className={errorMessage && "border-red-500"}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMessage("");
                }}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
