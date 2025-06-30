"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CoachSection } from "@/components/CoachSection";
import { Calendar } from "@/components/Calendar";
import { logout } from "@/app/api/auth";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const role = pathname.split("/")[1];

  const handleLogout = () => {
    try {
      logout();
      deleteCookie("user_uid");
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const tokenResult = await getIdTokenResult(user);
      if (!tokenResult.claims.admin) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, []);

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
