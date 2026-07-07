import { connectDB } from "../../../../lib/mongodb";
import Customer from "../../../../models/Customer";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Next.js 16
    const { id } = await params;

    const customer = await Customer.findOne({
      customerId: id,
    });

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      customer,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}