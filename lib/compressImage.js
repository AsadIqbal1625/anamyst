/* Downscale + re-encode large images client-side before upload,
   so big phone/screenshot photos don't time out hitting /api/upload */
export async function compressImage(
  file,
  { maxDimension = 1600, quality = 0.82 } = {}
) {

  if (!file || !file.type?.startsWith("image/")) return file;

  try {

    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    if (width > maxDimension || height > maxDimension) {

      const scale = maxDimension / Math.max(width, height);

      width = Math.round(width * scale);
      height = Math.round(height * scale);

    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    bitmap.close?.();

    if (!blob || blob.size >= file.size) return file;

    return new File(
      [blob],
      file.name.replace(/\.\w+$/, ".jpg"),
      { type: "image/jpeg" }
    );

  } catch {

    // if compression fails for any reason, fall back to the original file
    return file;

  }

}
