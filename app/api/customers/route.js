import { connectDB } from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      customers,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}