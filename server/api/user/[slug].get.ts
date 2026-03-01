export default defineEventHandler(async (event) => {
  // Rate limit: 300 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `profile:view:${ip}`, 300, 60 * 60 * 1000)

  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ status: 400, statusText: "Slug is required" })
  }

  const cacheKey = CacheKeys.userProfile(slug)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { userProfile: cached }
  }

  const userProfile = await db.user.findUnique({
    where: { slug },
    include: { links: { orderBy: { order: "asc" } }, icons: { orderBy: { order: "asc" } }, preferences: true },
  })
  if (!userProfile) {
    throw createError({ status: 404, statusText: `User '${slug}' not found` })
  }

  await setCached(cacheKey, userProfile, CACHE_TTL.LONG)

  return { userProfile }
})
