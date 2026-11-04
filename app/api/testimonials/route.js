import { connectDB }
from "../../../lib/mongodb";

import Testimonial
from "../../../models/Testimonial";

import { isAdminRequest }
from "../../../lib/adminAuth";

/* GET TESTIMONIALS (?published=true for storefront) */
export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    /* hidden testimonials are for the admin only */
    const filter =
      searchParams.get("published") === "true" ||
      !(await isAdminRequest(req))
        ? { published: true }
        : {};

    const testimonials =
      await Testimonial.find(filter).sort({
        createdAt: -1,
      });

    return Response.json({
      success: true,
      testimonials,
    });

  } catch (error) {

    console.error("testimonials error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}

/* ADD TESTIMONIAL */
export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    const testimonial =
      await Testimonial.create(body);

    return Response.json({
      success: true,
      testimonial,
    });

  } catch (error) {

    console.error("testimonials error:", error);


    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}
