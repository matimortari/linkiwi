export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per IP
  await enforceRateLimit(event, `assets:list:${sessionUser.id}`, 100)

  const cacheKey = CacheKeys.userAssets?.(sessionUser.id) || `user:assets:${sessionUser.id}`
  const cachedData = await getCached<any>(cacheKey)
  if (cachedData) {
    return { assets: cachedData }
  }

  const userAssets = await db.userAsset.findMany({ where: { userId: sessionUser.id }, orderBy: { createdAt: "desc" } })

  await setCached(cacheKey, userAssets, CACHE_TTL.SHORT)

  return { userAssets }
})
