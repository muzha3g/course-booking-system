"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import CoachSection from "@/features/coach/CoachSection";
import { Calendar } from "@/features/calendar/Calendar";
import { getCourses } from "@/app/api/course";
import { useEffect, useState } from "react";
import { Course } from "@/types";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/admin/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  useEffect(() => {
    try {
      const fetchCourses = async () => {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      };
      fetchCourses();
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <>Loading</>;

  return (
    <>
      <nav className="flex justify-end pt-10 pr-10">
        <Button className="hover:cursor-pointer" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <main className="h-full px-48 max-lg:px-20">
        <Tabs defaultValue="Schedule">
          <TabsList>
            <TabsTrigger value="Schedule">Schedule</TabsTrigger>
            <TabsTrigger value="Coach">Coach</TabsTrigger>
          </TabsList>
          <TabsContent value="Schedule">
            <Calendar course={courses} />
          </TabsContent>
          <TabsContent value="Coach">
            <CoachSection />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
