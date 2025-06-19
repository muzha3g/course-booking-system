import { NextResponse, NextRequest } from "next/server";
// import { getAuth } from "firebase/auth";

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

    // const token = request.cookies.get("firebase_token")?.value;
    // const decodedToken = getAuth()
    //   .verifyIdToken(token)
    //   .then((t) => t);

    // console.log("decodedToken: ", decodedToken);

    // if (!decodedToken.isAdmin) {
    //   return NextResponse.redirect(new URL("/admin/login", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
