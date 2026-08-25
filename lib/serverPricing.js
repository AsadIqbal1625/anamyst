import { connectDB } from "./mongodb";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import Setting from "../models/Setting";
import { getOrderTotals } from "./pricing";

/* Raised for carts the customer can fix themselves — the message is
   safe to show them. */
export class PricingError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PricingError";
    this.status = status;
  }
}

/* REBUILD AND PRICE A CART FROM THE DATABASE.

   The browser supplies only product ids and quantities. Every price,
   discount, fee and total below is read from the database, so a
   tampered client cannot influence what it is charged.

   Both the Razorpay order and the final order record price the cart
   through here, so the amount collected and the amount recorded can
   never disagree. */

export async function priceCart({
  items,
  couponCode = "",
  paymentMethod = "COD",
}) {

  await connectDB();

  const cartItems = Array.isArray(items) ? items : [];

  if (cartItems.length === 0) {
    throw new PricingError("Cart is empty");
  }

  const ids = cartItems.map((i) => i.productId).filter(Boolean);

  const dbProducts = await Product.find({ _id: { $in: ids } }).lean();

  const productMap = Object.fromEntries(
    dbProducts.map((p) => [String(p._id), p])
  );

  let subtotal = 0;

  const products = [];

  for (const item of cartItems) {

    const db = productMap[String(item.productId)];

    const quantity = Math.max(
      1,
      Math.floor(Number(item.quantity) || 1)
    );

    if (!db) {
      throw new PricingError(
        "A product in your cart no longer exists. Please refresh your cart."
      );
    }

    if (typeof db.stock === "number" && db.stock < quantity) {
      throw new PricingError(
        `"${db.name}" has only ${db.stock} left in stock. Please update your cart.`
      );
    }

    subtotal += db.price * quantity;

    products.push({
      productId: String(db._id),
      name: db.name,
      image: db.image,
      quantity,
      price: db.price,
    });

  }

  /* COUPON — re-validated here; an invalid or expired code simply
     yields no discount rather than failing the order */

  let validCouponCode = "";
  let couponDiscount = 0;

  if (couponCode) {

    const coupon = await Coupon.findOne({
      code: String(couponCode).toUpperCase().trim(),
    }).lean();

    const valid =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) &&
      (!coupon.minOrder || subtotal >= coupon.minOrder);

    if (valid) {
      validCouponCode = coupon.code;
      couponDiscount =
        coupon.discountType === "percent"
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);
    }

  }

  const settings = await Setting.findOne({ key: "store" }).lean();

  const totals = getOrderTotals({
    subtotal,
    tiers: settings?.discountTiers,
    shippingFee: settings?.shippingFee,
    codFee: settings?.codFee,
    paymentMethod:
      paymentMethod === "RAZORPAY" ? "RAZORPAY" : "COD",
    couponCode: validCouponCode,
    couponDiscount,
  });

  return {
    products,
    subtotal,
    couponCode: validCouponCode,
    totals,
  };

}
