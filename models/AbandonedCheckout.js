import mongoose from "mongoose";

/* One record per contact (phone/email) who reached checkout but
   didn't order. Auto-deleted after 30 days of inactivity (TTL). */
const AbandonedCheckoutSchema = new mongoose.Schema({
  phone: { type: String, default: "", index: true },
  email: { type: String, default: "" },
  name: { type: String, default: "" },

  cart: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],

  cartValue: { type: Number, default: 0 },

  lastActiveAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30,
  },
});

export default mongoose.models.AbandonedCheckout ||
  mongoose.model("AbandonedCheckout", AbandonedCheckoutSchema);
