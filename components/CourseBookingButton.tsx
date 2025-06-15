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

export default function CourseBookingButton({
  courseId,
}: {
  courseId: string;
}) {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const handleClick = async () => {
    if (name.trim() == "" || phone.trim() === "") {
      alert("please fill out all the fields");
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
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <Dialog>
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
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  name="phone-number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleClick}>
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
