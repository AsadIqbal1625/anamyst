import mongoose from "mongoose";

const ProductSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },

      price: {
        type: Number,
        required: true,
      },

      oldPrice: {
        type: Number,
      },

      image: {
        type: String,
        required: true,
      },

      category: {
        type: String,
      },

      notesTags: [
        {
          type: String,
        },
      ],

      badge: {
        type: String,
      },

      tag: {
        type: String,
      },

      rating: {
        type: Number,
        default: 5,
      },

      reviews: {
        type: Number,
        default: 0,
      },

      stock: {
        type: Number,
        default: 10,
      },
    },

    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    ProductSchema
  );