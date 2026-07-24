import sharp from "sharp"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per IP
  await enforceRateLimit(event, `assets:upload:${sessionUser.id}`, 30)

  const form = await readMultipartFormData(event)
  const fileField = form?.find(part => part.name === "file")
  if (!fileField?.data) {
    throw createError({ statusCode: 400, statusMessage: "No image file provided for upload" })
  }

  let compressedBuffer = fileField.data
  let outputMimeType = fileField.type

  const imagePipeline = sharp(fileField.data)
  const metadata = await imagePipeline.metadata()

  // Apply compression based on format (convert unknown/unsupported image formats to WebP)
  switch (metadata.format) {
    case "jpeg":
      compressedBuffer = await imagePipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
      break
    case "png":
      compressedBuffer = await imagePipeline.png({ quality: 80, compressionLevel: 8 }).toBuffer()
      break
    case "webp":
      compressedBuffer = await imagePipeline.webp({ quality: 80 }).toBuffer()
      break
    case "gif":
      compressedBuffer = await sharp(fileField.data, { animated: true }).gif({ colors: 128 }).toBuffer()
      break
    default:
      compressedBuffer = await imagePipeline.webp({ quality: 80 }).toBuffer()
      outputMimeType = "image/webp"
      break
  }

  const fileToUpload = new File([new Uint8Array(compressedBuffer)], fileField.filename || "upload.jpg", { type: outputMimeType })

  const uploadedUrl = await uploadFile({
    path: `user-assets/${sessionUser.id}`,
    file: fileToUpload,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  })

  const newAsset = await db.userAsset.create({
    data: {
      userId: sessionUser.id,
      url: uploadedUrl,
      key: new URL(uploadedUrl).pathname.substring(1),
      mimeType: fileToUpload.type,
      size: fileToUpload.size,
      label: fileField.filename || "Untitled Image",
    },
  })

  await deleteCached(CacheKeys.userAssets?.(sessionUser.id))

  return { success: true, newAsset }
})

defineRouteMeta({
  openAPI: {
    summary: "Upload asset",
    description: "Uploads a new user asset. Accepts JPEG, PNG, WebP, or GIF formats for up to 5 MB.",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["file"],
            properties: {
              file: { type: "string", format: "binary" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "User asset uploaded" },
      400: { description: "Missing or invalid file" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
