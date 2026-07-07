import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "page_view",
      "product_view",
      "add_to_cart",
      "checkout_started",
      "purchase",
    ],
    required: true,
  },

  path: {
    type: String,
  },

  country: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  device: {
    type: String,
    default: "",
  },

  productId: {
    type: String,
  },

  sessionId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "90d", // auto-delete after 90 days (keeps free DB tier small)
  },
});

EventSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema);
