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

      /* your purchase cost — hidden from every query by default so it can
         never leak through the public API or server-rendered pages.
         Admin code opts in with .select("+costPrice"). */
      costPrice: {
        type: Number,
        default: 0,
        select: false,
      },

      image: {
        type: String,
        required: true,
      },

      images: [
        {
          type: String,
        },
      ],

      category: {
        type: String,
      },

      genderCategory: {
        type: String,
      },

      notesTags: [
        {
          type: String,
        },
      ],

      /* NEW FRAGRANCE PROFILE */

      topNotes: {
        type: String,
        default: "",
      },

      heartNotes: {
        type: String,
        default: "",
      },

      baseNotes: {
        type: String,
        default: "",
      },

      longevity: {
        type: String,
        default: "",
      },

      projection: {
        type: String,
        default: "",
      },

      occasion: {
        type: String,
        default: "",
      },

      season: {
        type: String,
        default: "",
      },

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