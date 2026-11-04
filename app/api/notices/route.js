import { connectDB }
from "../../../lib/mongodb";

import Notice
from "../../../models/Notice";

import { isAdminRequest }
from "../../../lib/adminAuth";

/* GET NOTICES (?published=true for storefront) */
export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    /* drafts and hidden notices are for the admin only */
    const filter =
      searchParams.get("published") === "true" ||
      !(await isAdminRequest(req))
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

    console.error("notices error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
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

    console.error("notices error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}
