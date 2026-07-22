export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const assetId = getRouterParam(event, "id")
  if (!assetId) {
    throw createError({ statusCode: 400, statusMessage: "Asset identifier is required" })
  }

  // Rate limit: 30 requests per hour per IP
  await enforceRateLimit(event, `assets:delete:${sessionUser.id}`, 30)

  const targetAsset = await db.userAsset.findUnique({ where: { id: assetId }, select: { userId: true, url: true } })
  if (!targetAsset) {
    throw createError({ statusCode: 404, statusMessage: "Requested media asset not found" })
  }
  if (targetAsset.userId !== sessionUser.id) {
    throw createError({ statusCode: 403, statusMessage: "You do not have permission to delete this asset" })
  }

  // Find all photo grids that reference the asset before removing them
  const photoUsages = await db.photoGridItem.findMany({ where: { assetId }, select: { gridId: true } })
  const affectedGridIds = [...new Set(photoUsages.map(photo => photo.gridId))]

  // Remove the asset from all links, photo grids, and banners that reference it
  await Promise.all([
    db.profileItemLink.updateMany({ where: { assetId }, data: { imageUrl: null, assetId: null } }),
    db.photoGridItem.deleteMany({ where: { assetId } }),
    db.userBanner.deleteMany({ where: { assetId } }),
  ])

  // Re-pack remaining photo orders, and delete grids that became empty
  const deletedGridIds: string[] = []
  if (affectedGridIds.length) {
    for (const gridId of affectedGridIds) {
      const remaining = await db.photoGridItem.findMany({ where: { gridId }, orderBy: { order: "asc" }, select: { id: true } })
      if (!remaining.length) {
        deletedGridIds.push(gridId)
        continue
      }

      await Promise.all(remaining.map((photo, order) => db.photoGridItem.update({ where: { id: photo.id }, data: { order } })))
    }
    if (deletedGridIds.length) {
      await db.profileItem.deleteMany({ where: { id: { in: deletedGridIds } } })
    }
  }

  await deleteFile(targetAsset.url)
  await db.userAsset.delete({ where: { id: assetId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userAssets(sessionUser.id), CacheKeys.userItems(sessionUser.id), CacheKeys.userData(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: "Media asset deleted.", deletedGridIds }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete user asset",
    description: "Deletes a user's uploaded asset and removes it from any links, photo grids, or banners that reference it.",
    tags: ["User"],
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Asset ID" },
    ],
    responses: {
      200: { description: "User asset deleted" },
      401: { description: "Unauthenticated" },
      403: { description: "Asset belongs to a different user" },
      404: { description: "Asset not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
