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
function tooManyRequests() {
  return Response.json(
    {
      success: false,
      error:
        "Too many requests. Please wait a few minutes and try again.",
    },
    { status: 429 }
  );
}

export async function rateLimit(req, bucket, max) {
  try {
    await connectDB();

    const key = `${bucket}:${clientIp(req)}`;

    /* already over: refuse without writing, so a flood of blocked
       requests can't keep filling the collection */
    if ((await RateLimit.countDocuments({ key })) >= max) {
      return tooManyRequests();
    }

    /* record, THEN recount. Counting alone lets a burst of parallel
       requests all see the same low number and all get through. */
    await RateLimit.create({ key });

    if ((await RateLimit.countDocuments({ key })) > max) {
      return tooManyRequests();
    }
  } catch (error) {
    /* never block real customers because the limiter itself failed */
    console.error("rate limit error:", error);
  }

  return null;
}
