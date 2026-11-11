import mongoose from "mongoose";

/* A mobile number that claimed the welcome offer through the popup.
   The discount itself is decided at checkout from this record plus the
   number's order history, never from anything the browser says. */

const WelcomeOfferSchema = new mongoose.Schema(
  {
    /* 10 digits, no country code */
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    sessionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WelcomeOffer ||
  mongoose.model("WelcomeOffer", WelcomeOfferSchema);
