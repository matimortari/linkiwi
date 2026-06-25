export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per IP
  await enforceRateLimit(event, `assets:list:${sessionUser.id}`, 100)

  const cacheKey = CacheKeys.userAssets?.(sessionUser.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { assets: cached }
  }

  const assets = await db.userAsset.findMany({ where: { userId: sessionUser.id }, orderBy: { createdAt: "desc" } })

  await setCached(cacheKey, assets, CACHE_TTL.SHORT)

  return { assets }
})

defineRouteMeta({
  openAPI: {
    summary: "Get user assets",
    description: "Returns the user's uploaded assets.",
    tags: ["User"],
    responses: {
      200: { description: "User uploaded assets" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
