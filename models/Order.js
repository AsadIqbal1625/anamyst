import mongoose from "mongoose";

const OrderSchema =
  new mongoose.Schema(

    {

      customerName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
      },

      state: {
        type: String,
      },

      pincode: {
        type: String,
      },

      products: [
        {
          productId: String,
          name: String,
          image: String,
          quantity: Number,
          price: Number,
        },
      ],
     orderId: {
      type: String,
      },
      totalAmount: {
        type: Number,
        required: true,
      },

      paymentMethod: {
        type: String,
        default: "COD",
      },
      paymentId: {
        type: String,
      },

      razorpayOrderId: {
        type: String,
      },

      paymentStatus: {
        type: String,
        default: "Pending",
      },

      orderStatus: {
        type: String,
        default: "Pending",
      },

    },

    {
      timestamps: true,
    }

  );

export default
  mongoose.models.Order ||
  mongoose.model(
    "Order",
    OrderSchema
  );