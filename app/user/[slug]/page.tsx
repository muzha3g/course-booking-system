"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { subscribeToAuthChanges } from "@/app/api/auth";
import { useEffect, useState } from "react";
import { getUserBookingCourses } from "@/app/api/booking";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Course } from "@/types";
import { deleteUserFromCourseReservation } from "@/app/api/booking";
import { logout } from "@/app/api/auth";

export default function Page() {
  const params = useParams();
  const { slug } = params;

  const router = useRouter();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingRecord, setBookingRecord] = useState<Course[]>();
  const [cancelTrigger, setCancelTrigger] = useState<number>(1);

  const handleCancelBooking = (courseId: string) => {
    deleteUserFromCourseReservation(slug, courseId).then(() => {
      setCancelTrigger(cancelTrigger + 1);
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/user");
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const data = await getUserBookingCourses(slug);
        setBookingRecord(data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [cancelTrigger, slug]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.uid != slug) {
        router.push("/user");
      }
    }
  }, [user, loading, slug, router]);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p>User data not available, redirecting...</p>;
  }

  console.log(user);

  return (
    <>
      <nav className="flex justify-end p-8 ">
        <Button onClick={handleLogout}>Logout</Button>
      </nav>
      <div className="min-h-screen flex flex-col items-center py-10 gap-10">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Hi {user.displayName}</CardTitle>
          </CardHeader>

          <CardContent>
            <p>{bookingRecord ? "Booking Record" : "No Booking Record"}</p>
            <section className="space-y-2">
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
