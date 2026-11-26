export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 100 requests per hour per user
  await enforceRateLimit(event, `analytics:get:${sessionUser.id}`, 100)

  const query = getQuery(event)
  const dateFrom = parseAnalyticsDate(query.dateFrom, "start")
  const dateTo = parseAnalyticsDate(query.dateTo, "end")

  // Dynamic cache key that changes when date ranges are applied
  const cacheKeySuffix = dateFrom || dateTo ? `:${dateFrom?.toISOString() ?? ""}:${dateTo?.toISOString() ?? ""}` : ""
  const cacheKey = `${CacheKeys.analytics(sessionUser.id)}${cacheKeySuffix}`

  const cached = await getCached<AnalyticsSummary>(cacheKey)
  if (cached) {
    return { data: cached }
  }

  const data = await fetchAnalyticsSummary(sessionUser.id, dateFrom, dateTo)

  await setCached(cacheKey, data, 60)

  return { data }
})

defineRouteMeta({
  openAPI: {
    summary: "Get profile analytics",
    description: "Returns aggregated page-view and click metrics for the current user, with optional date range filtering. Totals and chart series are computed on the server.",
    tags: ["Analytics"],
    parameters: [
      { in: "query", name: "dateFrom", schema: { type: "string", format: "date-time" } },
      { in: "query", name: "dateTo", schema: { type: "string", format: "date-time" } },
    ],
    responses: {
      200: { description: "Aggregated analytics summary within the given range" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
