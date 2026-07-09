import { NextResponse } from "next/server";
import { verifyAdminToken } from "./lib/adminToken";

/* API endpoints the storefront needs without login */
const PUBLIC_API = [
  { path: "/api/coupons/validate" },
  { path: "/api/coupons/active" },
  { path: "/api/settings", methods: ["GET"] },
  { path: "/api/orders", methods: ["POST"], exact: true },
  { path: "/api/products", methods: ["GET"] },
  { path: "/api/track-order" },
  { path: "/api/testimonials", methods: ["GET"] },
  { path: "/api/notices", methods: ["GET"] },
];

function isPublic(pathname, method) {
  return PUBLIC_API.some((rule) => {
    const match = rule.exact
      ? pathname === rule.path
      : pathname === rule.path ||
        pathname.startsWith(rule.path + "/");

    return (
      match && (!rule.methods || rule.methods.includes(method))
    );
  });
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const isApi = pathname.startsWith("/api");

  if (isApi && isPublic(pathname, method)) {
    return NextResponse.next();
  }

  /* everything else in the matcher needs a valid admin session */
  const token = req.cookies.get("admin-auth")?.value;

  const valid = await verifyAdminToken(
    process.env.AUTH_SECRET,
    token
  );

  if (valid) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.redirect(
    new URL("/admin-login", req.url)
  );
}

export const config = {

  matcher: [
    "/admin/:path*",
    "/api/dashboard/:path*",
    "/api/analytics/:path*",
    "/api/customers/:path*",
    "/api/coupons/:path*",
    "/api/settings/:path*",
    "/api/orders/:path*",
    "/api/orders",
    "/api/products/:path*",
    "/api/products",
    "/api/upload/:path*",
    "/api/seed/:path*",
    "/api/test/:path*",
    "/api/testimonials/:path*",
    "/api/testimonials",
    "/api/notices/:path*",
    "/api/notices",
    "/api/inventory/:path*",
  ],

};
