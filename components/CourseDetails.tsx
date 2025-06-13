"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCourse } from "@/app/api/course";
import { useEffect, useState } from "react";
import { Course } from "@/types";

export default function CourseDetails({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState<Boolean>(true);
  const [course, setCourse] = useState<Course>();

  useEffect(() => {
    try {
      const fetchCourse = async (courseId: string) => {
        const fetchedCourse = await getCourse(courseId);
        setCourse(fetchedCourse);
      };
      fetchCourse(courseId);
    } catch (error) {
      console.error("Error fetching course details on CourseDetails:", error);
      throw new Error("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  if (loading || !course) return <div> Loading...</div>;

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.coachName}</CardDescription>
          <CardAction>{course.date}</CardAction>
        </CardHeader>
        {course.reservations.length > 0 ? (
          <CardContent>
            <p>Students</p>
            <Card>
              <CardContent>Students Name</CardContent>
            </Card>
          </CardContent>
        ) : (
          <CardContent className="text-center text-gray-500">
            No Reservation
          </CardContent>
        )}
      </Card>
    </div>
  );
}
