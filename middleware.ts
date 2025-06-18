import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminUid = "BbIaW4JydRg53yPj1qBwI2bx4Ma2";
  console.log("--- Middleware Started ---");
  console.log("Request URL:", request.url);
  console.log("Request Pathname:", request.nextUrl.pathname);

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const userUid = localStorage.getItem("user_uid");
    console.log("request.nextUrl.pathname.startsWit", userUid);

    if (userUid !== adminUid) {
      console.log("userUid !== adminUid)");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/"],
};
