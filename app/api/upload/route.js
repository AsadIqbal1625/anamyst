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
        error.message,

    });

  }

}