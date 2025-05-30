import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import portrait from "@/app/assets/01_portrait.png";

export function CoachCard() {
  return (
    <Card className="w-full max-w-3xs gap-0">
      <div className="flex justify-center">
        <Image src={portrait} width={150} height={200} alt="portrait" />
      </div>

      <CardHeader>
        <CardTitle>Name</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
