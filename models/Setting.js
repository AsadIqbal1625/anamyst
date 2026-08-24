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

    campaign: {
      enabled: { type: Boolean, default: false },
      title: { type: String, default: "DIWALI OFFER" },
      tagline: { type: String, default: "On this auspicious occasion" },
      emoji: { type: String, default: "🪔" },
      image: { type: String, default: "" },
    },

    discountTiers: {
      type: [
        {
          label: { type: String, default: "" },
          minAmount: { type: Number, required: true },
          discountPercent: { type: Number, default: 0 },
          freeShipping: { type: Boolean, default: false },
          active: { type: Boolean, default: true },
        },
      ],
      default: [
        {
          label: "Free Shipping",
          minAmount: 499,
          discountPercent: 0,
          freeShipping: true,
          active: true,
        },
        {
          label: "5% Off",
          minAmount: 999,
          discountPercent: 5,
          freeShipping: false,
          active: true,
        },
        {
          label: "10% Off",
          minAmount: 1999,
          discountPercent: 10,
          freeShipping: false,
          active: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);
