import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    address: {
      type: String,
    },

    totalOrders: {
      type: Number,
      default: 1,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    lastOrderDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.Customer ||
  mongoose.model(
    "Customer",
    CustomerSchema
  );