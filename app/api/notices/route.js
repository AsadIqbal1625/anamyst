import { connectDB }
from "../../../lib/mongodb";

import Notice
from "../../../models/Notice";

/* GET NOTICES (?published=true for storefront) */
export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const filter =
      searchParams.get("published") === "true"
        ? { published: true }
        : {};

    const notices =
      await Notice.find(filter).sort({
        createdAt: -1,
      });

    return Response.json({
      success: true,
      notices,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}

/* ADD NOTICE */
export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    const notice =
      await Notice.create(body);

    return Response.json({
      success: true,
      notice,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}
