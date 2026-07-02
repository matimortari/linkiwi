export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `user:delete:${sessionUser.id}`, 5)

  // Gather all file URLs and identity metadata before dropping database records
  const accountData = await db.user.findUnique({
    where: { id: sessionUser.id },
    select: { slug: true, image: true, banner: { select: { url: true } }, assets: { select: { url: true } } },
  })
  if (!accountData) {
    throw createError({ statusCode: 404, statusMessage: "User account not found" })
  }

  await deleteCached(CacheKeys.userData(sessionUser.id), CacheKeys.userProfile(accountData.slug))

  // Compile an inventory of every file the user owns
  const deadFiles: string[] = []
  if (accountData.image) {
    deadFiles.push(accountData.image)
  }
  if (accountData.banner?.url) {
    deadFiles.push(accountData.banner.url)
  }

  accountData.assets.forEach((asset) => {
    if (asset.url) {
      deadFiles.push(asset.url)
    }
  })

  // Purge files from storage concurrently, ensuring one corrupt file URL doesn't crash the whole account deletion chain
  if (deadFiles.length > 0) {
    await Promise.allSettled(deadFiles.map(url => deleteFile(url)))
  }

  // Delete the user (cascade will handle related records) and clear session cookies
  await db.user.delete({ where: { id: sessionUser.id } })
  await clearUserSession(event)

  return { success: true, message: "Your account and all associated assets have been permanently deleted." }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete user account",
    description: "Permanently deletes the user's account, all associated assets, and clears the session.",
    tags: ["User"],
    responses: {
      200: { description: "User account and all associated data deleted" },
      401: { description: "Unauthenticated" },
      404: { description: "User not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
