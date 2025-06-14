"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CiCalendar } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import Image from "next/image";
import testImage from "@/public/test.png";

import { getCourse } from "@/app/api/course";
import { useEffect, useState } from "react";
import { Course } from "@/types";

export default function CourseDetails({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState<Boolean>(true);
  const [course, setCourse] = useState<Course>();
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const getRole = localStorage.getItem("role");
    setRole(getRole);
  });

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
    <div className="flex justify-center items-baseline w-full">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <CardDescription>
            {" "}
            <div className="text-gray-700 flex items-center gap-2">
              <CiCalendar />
              {course.date.slice(0, 10)}
            </div>
            <div className="text-gray-700 flex items-center gap-2">
              <IoTimeOutline />
              {course.date.slice(10)}
            </div>
          </CardDescription>
          {role === "admin" && <CardAction>{course.coachName}</CardAction>}
        </CardHeader>

        {role === "admin" ? (
          course.reservations.length > 0 ? (
            <CardContent>
              <p className="text-base font-bold">Students</p>
              <div className="grid grid-cols-2 gap-3 my-2">
                {course.reservations.map((data, index) => (
                  <Card key={index} className="">
                    <CardContent>{data.userName}</CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          ) : (
            <CardContent className="text-center text-gray-500">
              No Reservation
            </CardContent>
          )
        ) : (
          <CardContent>
            <hr />
            <div className="flex shrink-0 grow-0 items-start ">
              <Image
                src={testImage}
                alt=""
                width={150}
                height={150}
                priority={true}
              />
              <div className="p-6">
                <p className="text-lg font-bold"> {course.coachName}</p>
                <p>{course.coachDescription}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
