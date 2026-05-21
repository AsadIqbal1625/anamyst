import { NextResponse }
from "next/server";

export function middleware(req) {

  const adminAuth =

    req.cookies.get(
      "admin-auth"
    );

  const isAdminPage =

    req.nextUrl.pathname
      .startsWith("/admin");

  const isLoginPage =

    req.nextUrl.pathname ===
    "/admin-login";

  /* NOT LOGGED IN */
  if (

    isAdminPage &&
    !adminAuth

  ) {

    return NextResponse.redirect(

      new URL(
        "/admin-login",
        req.url
      )

    );

  }

  /* ALREADY LOGGED IN */
  if (

    isLoginPage &&
    adminAuth

  ) {

    return NextResponse.redirect(

      new URL(
        "/admin",
        req.url
      )

    );

  }

  return NextResponse.next();

}

export const config = {

  matcher: [

    "/admin/:path*",

    "/admin-login",

  ],

};