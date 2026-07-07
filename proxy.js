import { NextResponse } from "next/server";

export function proxy(req) {

  const adminAuth =
    req.cookies.get("admin-auth")?.value;

  const pathname = req.nextUrl.pathname;

  /* PROTECT ADMIN ROUTES */
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin-login" &&
    !adminAuth
  ) {

    return NextResponse.redirect(
      new URL("/admin-login", req.url)
    );

  }

  return NextResponse.next();

}

export const config = {

  matcher: [
    "/admin/:path*",
  ],

};
