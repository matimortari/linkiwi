export default defineEventHandler(async (event) => {
  // Rate limit: 300 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `profile:view:${ip}`, 300)

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
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      description: true,
      preferences: true,
      links: {
        where: { isVisible: true },
        select: { id: true, url: true, title: true, order: true, isVisible: true },
        orderBy: { order: "asc" },
      },
      icons: {
        where: { isVisible: true },
        select: { id: true, url: true, platform: true, logo: true, order: true, isVisible: true },
        orderBy: { order: "asc" },
      },
      widgets: {
        where: { isVisible: true },
        select: { id: true, type: true, handle: true, order: true, isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })
  if (!userProfile) {
    throw createError({ status: 404, statusText: `User '${slug}' not found` })
  }

  await setCached(cacheKey, userProfile, CACHE_TTL.LONG)

  return { userProfile }
})
