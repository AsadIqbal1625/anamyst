import mongoose from "mongoose";

/* One record per browser session that built a cart but didn't order.

   Keyed on sessionId rather than phone/email so every abandoned cart
   is recorded — including anonymous ones that never reached checkout.
   Contact details are filled in later if and when they're known, and
   a record is marked recovered (not deleted) once the visitor buys,
   so recovery rate can be measured.

   Auto-deleted after 30 days of inactivity (TTL). */
const AbandonedCheckoutSchema = new mongoose.Schema({
  /* sparse: old records predate this field, and a plain unique index
     would reject more than one of them for having no sessionId */
  sessionId: {
    type: String,
    default: "",
    unique: true,
    sparse: true,
  },

  /* set once the browser is known to belong to a past customer */
  customerId: { type: String, default: "", index: true },

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

  /* marketing consent — messaging without this is not permitted.
     Populated in a later phase; recorded here from the start so the
     admin list can show that consent is missing. */
  consentWhatsapp: { type: Boolean, default: false },
  consentEmail: { type: Boolean, default: false },
  consentAt: { type: Date },

  /* follow-up bookkeeping, so nobody is messaged repeatedly */
  remindedAt: { type: Date },
  reminderCount: { type: Number, default: 0 },

  /* set when this session later placed an order */
  recoveredAt: { type: Date },

  lastActiveAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30,
  },
});

export default mongoose.models.AbandonedCheckout ||
  mongoose.model("AbandonedCheckout", AbandonedCheckoutSchema);
