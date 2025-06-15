"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { subscribeToAuthChanges } from "@/app/api/user";
import { useEffect, useState } from "react";
import React from "react";
import { getUserBookingCourses } from "@/app/api/booking";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface paramsProps {
  params: Promise<{
    slug: string;
  }>;
}

import { Course } from "@/types";
import { deleteUserFromCourseReservation } from "@/app/api/booking";
import { logout } from "@/app/api/auth";

export default function Page({ params }: paramsProps) {
  const resolvedParams = React.use(params);
  const userIdSlug = resolvedParams.slug;

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingRecord, setBookingRecord] = useState<Course[]>();
  const [cancelTrigger, setCancelTrigger] = useState<number>(1);

  const handleCancelBooking = (courseId: string) => {
    deleteUserFromCourseReservation(userIdSlug, courseId);
    setCancelTrigger(cancelTrigger + 1);
  };

  const handleLogout = () => {
    logout();
    router.push("/user");
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser: any) => {
      console.log("onAuthStateChanged callback:", currentUser.displayName);
      setUser(currentUser.displayName);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const data = await getUserBookingCourses(userIdSlug);
        setBookingRecord(data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [cancelTrigger, userIdSlug]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <nav className="flex justify-end p-8 ">
        <Button onClick={handleLogout}>Logout</Button>
      </nav>
      <div className="min-h-screen flex flex-col items-center py-10 gap-10">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Hi {user}</CardTitle>
          </CardHeader>

          <CardContent>
            <p>{bookingRecord ? "No Booking Record" : "Booking Record"}</p>
            <section>
              {bookingRecord &&
                bookingRecord?.map((record) => (
                  <Card
                    key={record.id}
                    className="flex flex-row justify-between p-3 gap-1"
                  >
                    <div>
                      <CardDescription>
                        {record.title} ░ {record.coachName}
                      </CardDescription>
                      <CardDescription>{record.date}</CardDescription>
                    </div>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleCancelBooking(record.id)}
                    >
                      Cancel
                    </Button>
                  </Card>
                ))}
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
