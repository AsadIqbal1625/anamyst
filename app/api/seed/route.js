import { connectDB }
from "../../../lib/mongodb";

import Product
from "../../../models/Product";

export async function GET() {

  try {

    await connectDB();

    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Alchemy Paris",

        description:
          "Luxury oud fragrance for men",

        price: 1499,

        oldPrice: 1999,

        image: "/perfume1.png",

        category: "Men",

        notesTags: [
          "Woody",
          "Oud",
          "Luxury",
        ],

        badge: "Premium",

        tag: "Best Seller",

        rating: 4.8,

        reviews: 126,
      },

      {
        name: "Underberg",

        description:
          "Elegant floral fragrance",

        price: 999,

        oldPrice: 1499,

        image: "/perfume2.png",

        category: "Men",

        notesTags: [
          "Rose",
          "Floral",
          "Soft",
        ],

        badge: "Luxury",

        tag: "Trending",

        rating: 4.6,

        reviews: 84,
      },
    ]);

    return Response.json({
      success: true,
      message:
        "Products Seeded ✅",
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}