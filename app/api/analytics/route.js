import { NextResponse } from "next/server";
import { getAnalyticsData } from "../../../lib/getAnalyticsData";

export async function GET() {
  try {
    const data = await getAnalyticsData();

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {

    console.error("analytics error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}
