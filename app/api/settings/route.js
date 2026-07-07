import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Setting from "../../../models/Setting";

/* GET STORE SETTINGS */
export async function GET() {
  try {
    await connectDB();

    let settings = await Setting.findOne({ key: "store" }).lean();

    if (!settings) {
      settings = (await Setting.create({ key: "store" })).toObject();
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* UPDATE STORE SETTINGS */
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    delete body._id;
    delete body.key;

    const settings = await Setting.findOneAndUpdate(
      { key: "store" },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
