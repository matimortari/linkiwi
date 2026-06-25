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
    return { profile: cached }
  }

  const now = new Date()

  const profile = await db.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      description: true,
      location: true,
      preferences: true,
      banner: { select: { url: true } },
      items: {
        where: {
          isVisible: true,
          AND: [
            { OR: [{ scheduledStart: null }, { scheduledStart: { lte: now } }] },
            { OR: [{ scheduledEnd: null }, { scheduledEnd: { gte: now } }] },
          ],
        },
        orderBy: { order: "asc" },
        include: { link: true, widget: true, icon: true, photoGrid: { include: { photos: { orderBy: { order: "asc" } } } } },
      },
    },
  })
  if (!profile) {
    throw createError({ status: 404, statusText: `User '${slug}' not found` })
  }

  const hasActiveSchedule = profile.items.some(item => item.scheduledStart && item.scheduledEnd && new Date(item.scheduledEnd) > new Date(item.scheduledStart))

  await setCached(cacheKey, profile, hasActiveSchedule ? CACHE_TTL.SHORT : CACHE_TTL.LONG)

  return { profile }
})

defineRouteMeta({
  openAPI: {
    summary: "Get public profile",
    description: "Returns a user's public profile by slug, including visible and currently scheduled items. Cached with long TTL. Rate limited by IP.",
    tags: ["Profiles"],
    parameters: [
      { in: "path", name: "slug", required: true, schema: { type: "string" }, description: "User's unique slug" },
    ],
    responses: {
      200: { description: "Public profile with items, preferences, and banner" },
      400: { description: "Slug is required" },
      404: { description: "Profile not found" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
