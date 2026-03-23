export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per user
  await enforceRateLimit(event, `analytics:get:${user.id}`, 100)

  const cacheKey = CacheKeys.analytics(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const [pageViews, linkClicks, iconClicks] = await Promise.all([
    db.pageView.findMany({
      where: { userId: user.id },
      select: { id: true, userId: true, createdAt: true, referrer: true, source: true },
      orderBy: { createdAt: "desc" },
    }),
    db.linkClick.findMany({
      where: { userLink: { userId: user.id } },
      include: { userLink: true },
      orderBy: { createdAt: "desc" },
    }),
    db.iconClick.findMany({
      where: { userIcon: { userId: user.id } },
      include: { userIcon: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  await setCached(cacheKey, { pageViews, linkClicks, iconClicks }, CACHE_TTL.SHORT)

  return { pageViews, linkClicks, iconClicks }
})
