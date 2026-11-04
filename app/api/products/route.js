import { connectDB }
from "../../../lib/mongodb";

import Product
from "../../../models/Product";

import { isAdminRequest }
from "../../../lib/adminAuth";

/* GET PRODUCTS (public; cost price only included for the admin) */
export async function GET(req) {

  try {

    await connectDB();

    const query = Product.find();

    if (await isAdminRequest(req)) {
      query.select("+costPrice");
    }

    const products =
      await query;

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