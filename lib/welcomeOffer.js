import { connectDB } from "./mongodb";
import Order from "../models/Order";
import WelcomeOffer from "../models/WelcomeOffer";
import {
  WELCOME_DISCOUNT,
  WELCOME_ORDER_LIMIT,
  isValidMobile,
  normalizePhone,
} from "./welcomeOfferConfig";

/* SERVER ONLY. How many rupees of welcome discount this mobile number
   gets on its next order: the full amount while it has claimed the
   offer and placed fewer than the allowed number of orders, else 0.
   Cancelled orders don't use up a turn. */

export async function getWelcomeDiscount(phone) {

  if (!isValidMobile(phone)) return 0;

  const digits = normalizePhone(phone);

  await connectDB();

  const claimed = await WelcomeOffer.exists({ phone: digits });

  if (!claimed) return 0;

  /* orders store the number as typed, so match on its last 10 digits */
  const orders = await Order.countDocuments({
    phone: new RegExp(`${digits}$`),
    orderStatus: { $ne: "Cancelled" },
  });

  return orders < WELCOME_ORDER_LIMIT ? WELCOME_DISCOUNT : 0;

}
