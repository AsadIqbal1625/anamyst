import { connectDB }
from "../../../lib/mongodb";

import Product
from "../../../models/Product";

/* GET PRODUCTS */
export async function GET() {

  try {

    await connectDB();

    const products =
      await Product.find();

    return Response.json({
      success: true,
      products,
    });

  } catch (error) {

    console.error("products error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}

/* ADD PRODUCT */
export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    const product =
      await Product.create(body);

    return Response.json({
      success: true,
      product,
    });

  } catch (error) {

    console.error("products error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}