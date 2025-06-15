"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { subscribeToAuthChanges } from "@/app/api/user";
import { useEffect, useState } from "react";
import React from "react";
import { getUserBookingCourses } from "@/app/api/user";
import { Button } from "@/components/ui/button";

interface paramsProps {
  params: Promise<{
    slug: string;
  }>;
}

import { Course } from "@/types";

export default function Page({ params }: paramsProps) {
  const resolvedParams = React.use(params);
  const userIdSlug = resolvedParams.slug;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingRecord, setBookingRecord] = useState<Course[]>();

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
  }, [userIdSlug]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Hi {user}</CardTitle>
          <CardDescription>Below is your booking record.</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Booking Record</p>
          <section className="">
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
                  <Button variant={"secondary"}>Cancel</Button>
                </Card>
              ))}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
