import mongoose from "mongoose";

/* What the customer agreed to pay for, saved just before Razorpay opens.
   Once money has been taken, the order is built from this snapshot, so a
   closed browser or a product selling out cannot leave a customer charged
   with no order. Auto-deleted after 7 days (webhook retries stop long
   before that). */
const PendingOrderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true },

  details: { type: Object, required: true },
  products: { type: Array, required: true },
  totals: { type: Object, required: true },
  couponCode: { type: String, default: "" },

  notifyEmail: { type: Boolean, default: true },
  notifyWhatsapp: { type: Boolean, default: false },
  sessionId: { type: String, default: "" },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

export default mongoose.models.PendingOrder ||
  mongoose.model("PendingOrder", PendingOrderSchema);
