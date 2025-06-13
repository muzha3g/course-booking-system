import CourseDetails from "@/components/CourseDetails";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div>Course details {slug}</div>
      <CourseDetails courseId={slug} />
    </main>
  );
}
