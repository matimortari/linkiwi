export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `user:get:${user.id}`, 200, 60 * 60 * 1000)

  const cacheKey = CacheKeys.userData(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { userData: cached }
  }

  const userData = await db.user.findUnique({
    where: { id: user.id },
    include: {
      preferences: true,
      comments: true,
      views: true,
    },
  })
  if (!userData) {
    throw createError({ status: 404, statusText: "User not found" })
  }

  await setCached(cacheKey, userData, CACHE_TTL.SHORT)

  return { userData }
})
