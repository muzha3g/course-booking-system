import CourseDetails from "@/components/CourseDetails";
import BackToLastPageButton from "@/components/BackToLastPageButton";
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <CourseDetails courseId={slug} />
      <BackToLastPageButton />
    </div>
  );
}
