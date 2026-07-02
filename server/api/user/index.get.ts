export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `user:get:${sessionUser.id}`, 200)

  const cacheKey = CacheKeys.userData(sessionUser.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { user: cached }
  }

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, include: { preferences: true, banner: true } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" })
  }

  await setCached(cacheKey, user, CACHE_TTL.SHORT)

  return { user }
})

defineRouteMeta({
  openAPI: {
    summary: "Get current user",
    description: "Returns the authenticated user's profile, preferences, and banner.",
    tags: ["User"],
    responses: {
      200: { description: "User details, preferences, and banner" },
      401: { description: "Unauthenticated" },
      404: { description: "User not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
