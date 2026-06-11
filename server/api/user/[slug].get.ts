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
      supportButton: { select: { isEnabled: true, platform: true, url: true, suggestedAmounts: true, thankYouMessage: true } },
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

  // Privacy Guard: Strip fields explicitly disabled by user preferences
  if (!profile.preferences?.showLocation) {
    profile.location = null
  }
  if (!profile.supportButton?.isEnabled) {
    profile.supportButton = null
  }

  await setCached(cacheKey, profile, CACHE_TTL.LONG)

  return { profile }
})
