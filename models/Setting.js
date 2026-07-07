import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "store",
      unique: true,
    },

    storeName: {
      type: String,
      default: "ANAMYST",
    },

    supportEmail: {
      type: String,
      default: "team@anamyst.com",
    },

    phone: {
      type: String,
      default: "+91 8957851141",
    },

    whatsapp: {
      type: String,
      default: "+91 8840305018",
    },

    address: {
      type: String,
      default: "Lucknow, Uttar Pradesh, India",
    },

    instagram: {
      type: String,
      default: "https://instagram.com/anamyst_official",
    },

    codEnabled: {
      type: Boolean,
      default: true,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    freeShippingAbove: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);
