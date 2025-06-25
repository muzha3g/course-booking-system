import { NextResponse, NextRequest } from "next/server";
import admin from "./lib/firebaseAdmin";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const token = request.cookies.get("firebase_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const isAdmin = (await admin.auth().verifyIdToken(token)).isAdmin;
      if (isAdmin) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      console.error("Token verification failed", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
