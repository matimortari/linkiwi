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
  if (result.data.assetId) {
    const asset = await db.userAsset.findUnique({ where: { id: result.data.assetId }, select: { userId: true } })
    if (!asset || asset.userId !== sessionUser.id) {
      throw createError({ statusCode: 403, statusMessage: "Asset does not belong to this user" })
    }
  }

  // Find the existing banner to check if it's being replaced by a different asset
  const existingBanner = await db.userBanner.findUnique({ where: { userId: sessionUser.id }, select: { assetId: true } })
  const banner = await db.userBanner.upsert({
    where: { userId: sessionUser.id },
    create: { userId: sessionUser.id, url: result.data.url, assetId: result.data.assetId },
    update: { url: result.data.url, assetId: result.data.assetId },
  })
  if (existingBanner?.assetId && existingBanner.assetId !== result.data.assetId) {
    const assetId = existingBanner.assetId
    const [photoCount, bannerCount] = await Promise.all([db.photoGridItem.count({ where: { assetId } }), db.userBanner.count({ where: { assetId } })])
    if (photoCount === 0 && bannerCount === 0) {
      const asset = await db.userAsset.findUnique({ where: { id: assetId }, select: { url: true } })
      if (asset) {
        await deleteFile(asset.url).catch(() => {})
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
    description: "Creates or replaces the user's banner. Can reference an existing user asset or provide a direct URL.",
    tags: ["User"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["url"],
            properties: {
              url: { type: "string", format: "uri", description: "Banner URL" },
              assetId: { type: "string", description: "User asset ID" },
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
