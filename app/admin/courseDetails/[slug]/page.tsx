import admin from "@/lib/firebaseAdmin";
import { GetServerSidePropsContext } from "next";

export async function requireAdmin(context: GetServerSidePropsContext) {
  const token = context.req.cookies?.firebase_token;

  if (!token) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.isAdmin) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Admin auth failed", error);
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}

import CourseDetails from "@/components/CourseDetails";
import BackToLastPageButton from "@/components/BackToLastPageButton";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="min-h-screen flex flex-col items-center py-24 gap-10">
      <CourseDetails courseId={slug} />
      <BackToLastPageButton />
    </div>
  );
}
