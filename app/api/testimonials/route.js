import { connectDB }
from "../../../lib/mongodb";

import Testimonial
from "../../../models/Testimonial";

/* GET TESTIMONIALS (?published=true for storefront) */
export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const filter =
      searchParams.get("published") === "true"
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

    return Response.json({
      success: false,
      error: error.message,
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

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}
