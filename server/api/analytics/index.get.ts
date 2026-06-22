export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per user
  await enforceRateLimit(event, `analytics:get:${sessionUser.id}`, 100)

  const query = getQuery(event)
  const dateFrom = query.dateFrom ? new Date(query.dateFrom as string) : undefined
  const dateTo = query.dateTo ? new Date(query.dateTo as string) : undefined
  const dateFilter = (dateFrom || dateTo) ? { createdAt: { ...(dateFrom && { gte: dateFrom }), ...(dateTo && { lte: dateTo }) } } : {}

  // Dynamic cache key that changes when date ranges are applied
  const cacheKeySuffix = dateFrom || dateTo ? `:${dateFrom?.toISOString() ?? ""}:${dateTo?.toISOString() ?? ""}` : ""
  const cacheKey = `${CacheKeys.analytics(sessionUser.id)}${cacheKeySuffix}`

  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { data: cached }
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

defineRouteMeta({
  openAPI: {
    summary: "Get analytics",
    description: "Returns the authenticated user's page views and item clicks. Supports optional date range filtering.",
    tags: ["Analytics"],
    parameters: [
      { in: "query", name: "dateFrom", schema: { type: "string", format: "date-time" } },
      { in: "query", name: "dateTo", schema: { type: "string", format: "date-time" } },
    ],
    responses: {
      200: { description: "Page views and item clicks within the given range" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
