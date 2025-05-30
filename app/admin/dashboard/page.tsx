import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <nav className="flex justify-end p-10">
        <Button>Logout</Button>
      </nav>

      <main className="h-screen px-48 py-5">
        <Tabs defaultValue="Schedule">
          <TabsList>
            <TabsTrigger value="Schedule">Schedule</TabsTrigger>
            <TabsTrigger value="Coach">Coach</TabsTrigger>
          </TabsList>
          <TabsContent value="Schedule">Schedule</TabsContent>
          <TabsContent value="Coach">Coach</TabsContent>
        </Tabs>
      </main>
    </>
  );
}
