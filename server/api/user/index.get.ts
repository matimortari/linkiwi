export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `user:get:${sessionUser.id}`, 200)

  const cacheKey = CacheKeys.userData(sessionUser.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { user: cached }
  }

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      preferences: true,
      banner: { select: { id: true, url: true, asset: true } },
    },
  })
  if (!user) {
    throw createError({ status: 404, statusText: "User not found" })
  }

  await setCached(cacheKey, user, CACHE_TTL.SHORT)

  return { user }
})
