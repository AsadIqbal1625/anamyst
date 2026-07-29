import { connectDB }
from "../../../lib/mongodb";

export async function GET() {

  try {

    await connectDB();

    return Response.json({
      success: true,
      message:
        "MongoDB Connected ✅",
    });

  } catch (error) {

    console.error("test error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}