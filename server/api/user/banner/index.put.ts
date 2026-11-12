import { userBannerSchema } from "#shared/schemas/user-schema"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 10 banner updates per hour per user
  await enforceRateLimit(event, `user:banner:${sessionUser.id}`, 10)

  const body = await readBody(event)
  const result = userBannerSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  const asset = await db.userAsset.findUnique({ where: { id: result.data.assetId }, select: { id: true, userId: true, url: true } })
  if (!asset || asset.userId !== sessionUser.id) {
    throw createError({ statusCode: 403, statusMessage: "Asset does not belong to this user" })
  }

  // Find the existing banner to check if it's being replaced by a different asset
  const existingBanner = await db.userBanner.findUnique({ where: { userId: sessionUser.id }, select: { assetId: true } })
  const banner = await db.userBanner.upsert({
    where: { userId: sessionUser.id },
    create: { userId: sessionUser.id, url: asset.url, assetId: asset.id },
    update: { url: asset.url, assetId: asset.id },
  })
  if (existingBanner?.assetId && existingBanner.assetId !== asset.id) {
    const assetId = existingBanner.assetId
    const [photoCount, bannerCount] = await Promise.all([db.photoGridItem.count({ where: { assetId } }), db.userBanner.count({ where: { assetId } })])
    if (photoCount === 0 && bannerCount === 0) {
      const orphaned = await db.userAsset.findUnique({ where: { id: assetId }, select: { url: true } })
      if (orphaned) {
        await deleteFile(orphaned.url).catch(() => {})
        await db.userAsset.delete({ where: { id: assetId } }).catch(() => {})
      }
    }
  }

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await Promise.all([deleteCached(CacheKeys.userProfile(user?.slug || "")), deleteCached(CacheKeys.userData(sessionUser.id)), deleteCached(CacheKeys.userAssets(sessionUser.id))])

  return { banner }
})

defineRouteMeta({
  openAPI: {
    summary: "Set user banner",
    description: "Creates or replaces the user's banner from an owned uploaded asset. The banner URL is always taken from the asset record, not the request body.",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["assetId"],
            properties: {
              assetId: { type: "string", description: "Owned user asset ID" },
              url: { type: "string", format: "uri", description: "Optional; ignored — URL is resolved from the asset" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "User banner set" },
      400: { description: "Validation error" },
      401: { description: "Unauthenticated" },
      403: { description: "Asset belongs to a different user" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
