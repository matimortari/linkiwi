export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 10 requests per hour per user
  await enforceRateLimit(event, `user:image-upload:${sessionUser.id}`, 10)

  const form = await readFormData(event)
  const file = form.get("file")
  if (!file || !(file instanceof File)) {
    throw createError({ status: 400, statusText: "No file uploaded" })
  }

  const currentUser = await db.user.findUnique({ where: { id: sessionUser.id }, select: { image: true } })

  const imageUrl = await uploadFile({
    path: `user-avatars/${sessionUser.id}`,
    file,
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    oldFile: currentUser?.image || undefined,
  })

  await db.user.update({ where: { id: sessionUser.id }, data: { image: imageUrl } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await Promise.all([deleteCached(CacheKeys.userProfile(user?.slug || "")), deleteCached(CacheKeys.userData(sessionUser.id))])

  return { imageUrl }
})

defineRouteMeta({
  openAPI: {
    summary: "Upload user avatar",
    description: "Replaces the user's avatar. Accepts PNG, JPEG, or WebP up to 2 MB.",
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
      200: { description: "Avatar uploaded, returns `imageUrl`" },
      400: { description: "Missing file, invalid type, or size exceeded" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
