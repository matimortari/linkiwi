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

  // Find all photo grids that reference the asset
  const photoUsages = await db.photoGridItem.findMany({ where: { assetId }, select: { gridId: true } })
  const affectedGridIds = [...new Set(photoUsages.map(photo => photo.gridId))]

  // Remove the asset from all links, photo grids, and banners that reference it
  await Promise.all([
    db.profileItemLink.updateMany({ where: { assetId }, data: { imageUrl: null, assetId: null } }),
    db.photoGridItem.deleteMany({ where: { assetId } }),
    db.userBanner.deleteMany({ where: { assetId } }),
  ])

  // If any photo grids became empty as a result, delete them
  if (affectedGridIds.length) {
    const emptyGrids = await Promise.all(affectedGridIds.map(async (gridId) => {
      const remaining = await db.photoGridItem.count({ where: { gridId } })
      return remaining === 0 ? gridId : null
    }),
    )
    const emptyGridIds = emptyGrids.filter((id): id is string => id !== null)
    if (emptyGridIds.length) {
      await db.profileItem.deleteMany({ where: { id: { in: emptyGridIds } } })
    }
  }

  await deleteFile(targetAsset.url)
  await db.userAsset.delete({ where: { id: assetId } })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })
  await deleteCached(CacheKeys.userAssets(sessionUser.id), CacheKeys.userItems(sessionUser.id), CacheKeys.userData(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: "Media asset completely removed from cloud storage." }
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
