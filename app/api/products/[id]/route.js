import { connectDB }
from "../../../../lib/mongodb";

import Product
from "../../../../models/Product";

import mongoose
from "mongoose";

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

    const product =
      await Product.findById(id);

    return Response.json({
      success: true,
      product,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
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

    return Response.json({

      success: false,

      error:
        error.message,

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

    return Response.json({

      success: false,

      error:
        error.message,

    });

  }

}