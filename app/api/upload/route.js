import cloudinary
from "../../../lib/cloudinary";

/* UPLOAD IMAGE */
export async function POST(
  req
) {

  try {

    const data =
      await req.formData();

    const file =
      data.get("file");

    if (!file) {

      return Response.json({

        success: false,

        error:
          "No file uploaded",

      });

    }

    if (file.size > 15 * 1024 * 1024) {

      return Response.json({

        success: false,

        error:
          "Image is too large (max 15MB). Try a smaller photo.",

      });

    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const base64 =
      `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadedImage =
      await cloudinary.uploader.upload(
        base64,
        {

          folder:
            "anamyst",

          timeout:
            90000,

        }
      );

    return Response.json({

      success: true,

      imageUrl:
        uploadedImage.secure_url,

    });

  } catch (error) {

    return Response.json({

      success: false,

      error:
        error?.error?.message ||
        error?.message ||
        "Upload failed",

    });

  }

}