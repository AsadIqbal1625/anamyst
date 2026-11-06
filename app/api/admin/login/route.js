import { NextResponse } from "next/server";
import { createAdminToken } from "../../../../lib/adminToken";
import { connectDB } from "../../../../lib/mongodb";
import { safeEqual } from "../../../../lib/safeEqual";
import LoginAttempt from "../../../../models/LoginAttempt";

const MAX_ATTEMPTS = 5; // per 15 min (TTL on the model)

function lockedOut() {
  return NextResponse.json(
    {
      success: false,
      error: "Too many failed attempts. Try again in 15 minutes.",
    },
    { status: 429 }
  );
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    /* LOCKOUT: too many recent failures from this IP → block */
    await connectDB();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const failures = await LoginAttempt.countDocuments({ key: ip });

    if (failures >= MAX_ATTEMPTS) {
      return lockedOut();
    }

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

    /* count this attempt BEFORE testing the password. If it were recorded
       only after a failure, a burst of parallel guesses would all pass
       the check above and the lockout would never apply to them. */
    await LoginAttempt.create({ key: ip });

    if ((await LoginAttempt.countDocuments({ key: ip })) > MAX_ATTEMPTS) {
      return lockedOut();
    }

    const credsOk =
      safeEqual(email, adminEmail) & safeEqual(password, adminPassword);

    if (!credsOk) {
      /* slow down brute-force attempts */
      await new Promise((r) => setTimeout(r, 800));

      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* success → clear this IP's failure history */
    await LoginAttempt.deleteMany({ key: ip }).catch(() => {});

    /* 24h session. The token is stateless, so logging out can't revoke
       a stolen cookie — a short life limits how long it stays useful. */
    const token = await createAdminToken(secret, 24 * 60 * 60 * 1000);

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin-auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return res;
  } catch (error) {

    console.error("login error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}
