import { NextResponse } from "next/server";
import { createAdminToken } from "../../../../lib/adminToken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.AUTH_SECRET;

    if (!adminEmail || !adminPassword || !secret) {
      return NextResponse.json({
        success: false,
        error:
          "Admin auth not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in environment variables.",
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      /* slow down brute-force attempts */
      await new Promise((r) => setTimeout(r, 800));

      return NextResponse.json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = await createAdminToken(secret);

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin-auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
