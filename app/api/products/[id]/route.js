import { connectDB }
from "../../../../lib/mongodb";

import Product
from "../../../../models/Product";

import mongoose
from "mongoose";

import { isAdminRequest }
from "../../../../lib/adminAuth";

/* GET SINGLE PRODUCT */
export async function GET(
  req,
  context
) {

  try {

    await connectDB();

    const params =
      await context.params;

    const id = params.id;

    if (
      !mongoose.Types.ObjectId
        .isValid(id)
    ) {

      return Response.json({
        success: false,
        error: "Invalid Product ID",
      });

    }

    const query = Product.findById(id);

    /* cost price is for the admin only */
    if (await isAdminRequest(req)) {
      query.select("+costPrice");
    }

    const product = await query;

    return Response.json({
      success: true,
      product,
    });

  } catch (error) {

    console.error("[id] error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}

/* UPDATE PRODUCT */
export async function PATCH(
  req,
  context
) {

  try {

    await connectDB();

    const params =
      await context.params;

    const id = params.id;

    const body =
      await req.json();

    const updatedProduct =
      await Product.findByIdAndUpdate(

        id,

        body,

        {
          new: true,
        }

      );

    return Response.json({

      success: true,

      product:
        updatedProduct,

    });

  } catch (error) {

    console.error("[id] error:", error);


    return Response.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}

/* DELETE PRODUCT */
export async function DELETE(
  req,
  context
) {

  try {

    await connectDB();

    const params =
      await context.params;

    const id = params.id;

    await Product.findByIdAndDelete(
      id
    );

    return Response.json({

      success: true,

      message:
        "Product deleted",

    });

  } catch (error) {

    console.error("[id] error:", error);


    return Response.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}