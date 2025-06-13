import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CourseDetails() {
  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Course Title</CardTitle>
          <CardDescription>Coach name</CardDescription>
          <CardAction>
            2025/06/19 <br />
            15:00 - 16:00
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Students</p>
          <Card>
            <CardContent>Students Name</CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
