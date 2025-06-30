import CourseDetails from "@/components/CourseDetails";
import BackToLastPageButton from "@/components/BackToLastPageButton";
import { verifyIdToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase_token")?.value;

  if (!token) redirect("/admin/login");

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken?.admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <CourseDetails courseId={slug} />
      <BackToLastPageButton />
    </div>
  );
}
