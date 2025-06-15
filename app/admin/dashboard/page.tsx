"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import CoachSection from "@/components/CoachSection";
import { Calendar } from "@/components/Calendar";

export default function Page() {
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

  const role = "admin";

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
            <Calendar role={role} />
          </TabsContent>
          <TabsContent value="Coach">
            <CoachSection />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
