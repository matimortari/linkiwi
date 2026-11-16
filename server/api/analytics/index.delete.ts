export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `analytics:delete:${sessionUser.id}`, 5)

  const query = getQuery(event)
  if (query.type && !["pageView", "itemClick"].includes(query.type as string)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid analytics data collection type" })
  }

  const dateFilter: { gte?: Date, lte?: Date } = {}
  if (query.dateFrom) {
    const dateFrom = new Date(query.dateFrom as string)
    if (Number.isNaN(dateFrom.getTime())) {
      throw createError({ statusCode: 400, statusMessage: "Invalid date" })
    }
    dateFilter.gte = dateFrom
  }
  if (query.dateTo) {
    const dateTo = new Date(query.dateTo as string)
    if (Number.isNaN(dateTo.getTime())) {
      throw createError({ statusCode: 400, statusMessage: "Invalid date" })
    }
    dateFilter.lte = dateTo
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0
  const prismaDateWhere = hasDateFilter ? { createdAt: dateFilter } : {}

  let purgedCount = 0
  await db.$transaction(async (tx) => {
    if (!query.type || query.type === "pageView") {
      const result = await tx.pageView.deleteMany({ where: { userId: sessionUser.id, ...prismaDateWhere } })
      purgedCount += result.count
    }

    if (!query.type || query.type === "itemClick") {
      const result = await tx.itemClick.deleteMany({
        where: { item: { userId: sessionUser.id }, ...prismaDateWhere },
      })
      purgedCount += result.count
    }
  })
  if (purgedCount === 0) {
    return { success: true, message: "No records found within selected range parameters" }
  }

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await deleteCached(CacheKeys.analytics(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: `Successfully deleted ${purgedCount} entries.` }
})

defineRouteMeta({
  openAPI: {
    summary: "Delete analytics data",
    description: "Deletes the current user's analytics records, with optional filtering by type and/or date range.",
    tags: ["Analytics"],
    parameters: [
      { in: "query", name: "type", schema: { type: "string", enum: ["pageView", "itemClick"] }, description: "Omit to delete both" },
      { in: "query", name: "dateFrom", schema: { type: "string", format: "date-time", description: "Date and time to start the range" } },
      { in: "query", name: "dateTo", schema: { type: "string", format: "date-time", description: "Date and time to end the range" } },
    ],
    responses: {
      200: { description: "Analytics records deleted" },
      400: { description: "Invalid type or date parameter" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
