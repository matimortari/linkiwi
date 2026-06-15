export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per IP
  await enforceRateLimit(event, `assets:list:${sessionUser.id}`, 100)

  const cacheKey = CacheKeys.userAssets?.(sessionUser.id)
  const cachedData = await getCached<any>(cacheKey)
  if (cachedData) {
    return { assets: cachedData }
  }

  const assets = await db.userAsset.findMany({ where: { userId: sessionUser.id }, orderBy: { createdAt: "desc" } })

  await setCached(cacheKey, assets, CACHE_TTL.SHORT)

  return { assets }
})
