import CourseDetails from "@/components/CourseDetails";
import BackToLastPageButton from "@/components/BackToLastPageButton";
import { Button } from "@/components/ui/button";
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <CourseDetails courseId={slug} />
      <div className="flex flex-col gap-5">
        <Button className="w-24">Book</Button>
        <BackToLastPageButton />
      </div>
    </div>
  );
}
