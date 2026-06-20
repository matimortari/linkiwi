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

defineRouteMeta({
  openAPI: {
    summary: "Delete asset",
    description: "Deletes a media asset from storage. Only the owning user can delete their assets.",
    tags: ["User"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Asset ID" },
    ],
    responses: {
      200: { description: "Asset deleted" },
      401: { description: "Unauthenticated" },
      403: { description: "Asset belongs to a different user" },
      404: { description: "Asset not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
