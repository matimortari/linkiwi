export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 30 requests per hour per IP
  await enforceRateLimit(event, `assets:upload:${sessionUser.id}`, 30)

  const multipartData = await readMultipartFormData(event)
  const fileField = multipartData?.find(part => part.name === "file")
  if (!fileField || !fileField.data) {
    throw createError({ status: 400, statusText: "No image file provided for upload" })
  }

  const fileToUpload = new File([new Uint8Array(fileField.data)], fileField.filename || "upload.jpg", { type: fileField.type })

  const uploadedUrl = await uploadFile({
    path: `users/${sessionUser.id}/assets`,
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

  await deleteCached(CacheKeys.userAssets?.(sessionUser.id) || `user:assets:${sessionUser.id}`)

  return { success: true, newAsset }
})
