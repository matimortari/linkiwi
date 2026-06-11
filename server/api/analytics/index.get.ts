export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per user
  await enforceRateLimit(event, `analytics:get:${sessionUser.id}`, 100)

  const query = getQuery(event)
  const dateFrom = query.dateFrom ? new Date(query.dateFrom as string) : undefined
  const dateTo = query.dateTo ? new Date(query.dateTo as string) : undefined
  const dateFilter = (dateFrom || dateTo) ? { createdAt: { ...(dateFrom && { gte: dateFrom }), ...(dateTo && { lte: dateTo }) } } : {}

  // Dynamic cache key that changes when date ranges are applied
  const cacheKey = `analytics:overview:${sessionUser.id}:${query.dateFrom || "all"}:${query.dateTo || "all"}`
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  // Concurrently pull page views and item clicks with the same date filter
  const [pageViews, itemClicks] = await Promise.all([
    db.pageView.findMany({
      where: { userId: sessionUser.id, ...dateFilter },
      select: { id: true, createdAt: true, referrer: true, source: true },
      orderBy: { createdAt: "desc" },
    }),
    db.itemClick.findMany({
      where: { item: { userId: sessionUser.id }, ...dateFilter },
      select: { id: true, itemId: true, createdAt: true, item: { select: { type: true, order: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const data = { pageViews, itemClicks }
  await setCached(cacheKey, data, CACHE_TTL.SHORT)

  return { data }
})
