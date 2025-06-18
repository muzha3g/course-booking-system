import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminUid = "BbIaW4JydRg53yPj1qBwI2bx4Ma2";
  console.log("--- Middleware Started ---");

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const userUid = request.cookies.get("user_uid")?.value;

    if (userUid !== adminUid) {
      console.log("userUid !== adminUid)");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
