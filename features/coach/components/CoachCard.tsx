import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import portrait from "@/app/assets/01_portrait.png";

export function CoachCard({ coachName }: { coachName: string }) {
  return (
    <Card className="w-full max-w-2xs gap-0 ">
      <div className="flex justify-center">
        <Image src={portrait} width={200} height={200} alt="portrait" />
      </div>
      <CardHeader>
        <CardTitle>{coachName}</CardTitle>
      </CardHeader>
    </Card>
  );
}
