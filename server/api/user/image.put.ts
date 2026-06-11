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
  await deleteCached(CacheKeys.userData(sessionUser.id))

  return { imageUrl }
})
