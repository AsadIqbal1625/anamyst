import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Event from "../../../models/Event";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.type || !body.sessionId) {
      return NextResponse.json({ success: false });
    }

    await connectDB();

    /* DEVICE from user agent */
    const ua = req.headers.get("user-agent") || "";
    const device = /mobile|android|iphone|ipad/i.test(ua)
      ? "Mobile"
      : "Desktop";

    /* GEO from Vercel headers (production only) */
    const country =
      req.headers.get("x-vercel-ip-country") || "";
    const city = decodeURIComponent(
      req.headers.get("x-vercel-ip-city") || ""
    );

    await Event.create({
      type: body.type,
      path: (body.path || "").slice(0, 200),
      productId: body.productId || undefined,
      sessionId: String(body.sessionId).slice(0, 64),
      device,
      country,
      city,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Tracking must never break the site — fail silently
    return NextResponse.json({ success: false });
  }
}
