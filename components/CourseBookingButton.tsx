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
import { handleUserLogin } from "@/app/api/auth";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";

export default function CourseBookingButton({
  courseId,
}: {
  courseId: string;
}) {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    const validationResult = InputSchema.safeParse({ phone, name });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        if (err.path[0] === "name") {
          setNameErrorMessage(err.message);
        } else if (err.path[0] === "phone") {
          setPhoneErrorMessage(err.message);
        }
      });
      return;
    }

    try {
      const result = await handleUserLogin(courseId, name, phone);
      console.log("Booking result:", result);
      if (result === "User already booked this course.") {
        toast(result);
      } else {
        toast("Booking successfully");
      }

      setName("");
      setPhone("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const InputSchema = z.object({
    phone: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
    name: z.string().min(1, { message: "Name is required." }),
  });

  return (
    <>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form>
          <DialogTrigger asChild>
            <Button className="w-24">Book</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Fill out form to book course</DialogTitle>
              <DialogDescription>
                Please enter tour details to book the course.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Real Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  className={nameErrorMessage && "border-red-500"}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameErrorMessage("");
                  }}
                />
                {nameErrorMessage && (
                  <p className="text-red-500 text-sm">{nameErrorMessage}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  name="phone-number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneErrorMessage("");
                  }}
                  placeholder="format : 0987654321"
                  className={phoneErrorMessage && "border-red-500"}
                />
                {phoneErrorMessage && (
                  <p className="text-red-500 text-sm">{phoneErrorMessage}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
