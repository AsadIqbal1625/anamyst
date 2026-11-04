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

    customerId: {
      type: String,
    },

    invoiceId: {
      type: String,
    },
      totalAmount: {
        type: Number,
        required: true,
      },

      couponCode: {
        type: String,
        default: "",
      },

      discount: {
        type: Number,
        default: 0,
      },

      discountLabel: {
        type: String,
        default: "",
      },

      shippingCost: {
        type: Number,
        default: 0,
      },

      codFee: {
        type: Number,
        default: 0,
      },

      paymentMethod: {
        type: String,
        default: "COD",
      },
      /* unique + sparse: one payment can only ever back one order
         (COD orders have no paymentId and are skipped by the index) */
      paymentId: {
        type: String,
        index: { unique: true, sparse: true },
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

      notifyEmail: {
        type: Boolean,
        default: true,
      },

      notifyWhatsapp: {
        type: Boolean,
        default: false,
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