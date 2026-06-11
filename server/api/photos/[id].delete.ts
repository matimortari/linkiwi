export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const assetId = getRouterParam(event, "id")
  if (!assetId) {
    throw createError({ status: 400, statusText: "Asset identifier is required" })
  }

  // Rate limit: 30 requests per hour per IP
  await enforceRateLimit(event, `assets:delete:${sessionUser.id}`, 30)

  const targetAsset = await db.userAsset.findUnique({ where: { id: assetId }, select: { userId: true, url: true } })
  if (!targetAsset) {
    throw createError({ status: 404, statusText: "Requested media asset not found" })
  }
  if (targetAsset.userId !== sessionUser.id) {
    throw createError({ status: 403, statusText: "You do not have permission to delete this asset" })
  }

  await deleteFile(targetAsset.url)
  await db.userAsset.delete({ where: { id: assetId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userAssets?.(sessionUser.id) || `user:assets:${sessionUser.id}`, CacheKeys.userItems(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: "Media asset completely removed from cloud storage." }
})
