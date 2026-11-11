import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import WelcomeOffer from "../../../models/WelcomeOffer";
import AbandonedCheckout from "../../../models/AbandonedCheckout";
import { rateLimit } from "../../../lib/rateLimit";
import { getWelcomeDiscount } from "../../../lib/welcomeOffer";
import {
  isValidMobile,
  normalizePhone,
} from "../../../lib/welcomeOfferConfig";

/* PUBLIC.
   action "claim" (the popup): records the number and its consent to be
   messaged, and says whether the discount applies.
   action "check" (the checkout): only says whether the discount applies,
   so the page can show the same total the server will charge. */

export async function POST(req) {

  try {

    const body = await req.json();

    const claiming = body.action !== "check";

    /* claims write to the database, so they get the tighter limit */
    const limited = claiming
      ? await rateLimit(req, "welcome-claim", 10)
      : await rateLimit(req, "welcome-check", 40);

    if (limited) return limited;

    if (!isValidMobile(body.phone)) {
      return NextResponse.json({
        success: false,
        error: "Please enter a valid 10-digit mobile number",
      });
    }

    const phone = normalizePhone(body.phone);

    if (claiming) {

      const sessionId = String(body.sessionId || "").trim().slice(0, 64);

      await connectDB();

      try {

        await WelcomeOffer.updateOne(
          { phone },
          { $setOnInsert: { phone, sessionId } },
          { upsert: true }
        );

      } catch (err) {

        /* two claims for the same number at once: the other one saved it */
        if (err?.code !== 11000) throw err;

      }

      /* the popup states that we may message this number, so record
         that consent on the visitor's saved cart */
      if (sessionId) {
        await AbandonedCheckout.updateOne(
          { sessionId },
          {
            $set: {
              phone,
              consentWhatsapp: true,
              consentAt: new Date(),
            },
          }
        );
      }

    }

    const amount = await getWelcomeDiscount(phone);

    return NextResponse.json({
      success: true,
      eligible: amount > 0,
      amount,
    });

  } catch (error) {

    console.error("welcome-offer error:", error);

    return NextResponse.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}
