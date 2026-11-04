import { connectDB } from "./mongodb";
import RateLimit from "../models/RateLimit";

export function clientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/* Per-IP limit over a rolling ~10 minute window, stored in Mongo so it
   works across serverless instances.

   Returns a ready-made 429 Response when the caller is over `max`,
   otherwise records the hit and returns null:

     const limited = await rateLimit(req, "orders", 8);
     if (limited) return limited;
*/
export async function rateLimit(req, bucket, max) {
  try {
    await connectDB();

    const key = `${bucket}:${clientIp(req)}`;

    const hits = await RateLimit.countDocuments({ key });

    if (hits >= max) {
      return Response.json(
        {
          success: false,
          error:
            "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    await RateLimit.create({ key });
  } catch (error) {
    /* never block real customers because the limiter itself failed */
    console.error("rate limit error:", error);
  }

  return null;
}
