import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("--- Middleware Started ---");

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const token = request.cookies.get("firebase_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
