export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 5 requests per hour per user
  await enforceRateLimit(event, `analytics:delete:${sessionUser.id}`, 5)

  const query = getQuery(event)
  if (query.type && !["pageView", "itemClick"].includes(query.type as string)) {
    throw createError({ status: 400, statusText: "Invalid analytics data collection type" })
  }

  // Construct standard date constraint block matching index patterns
  const dateFilter: any = {}
  if (query.dateFrom) {
    dateFilter.gte = new Date(query.dateFrom as string)
  }
  if (query.dateTo) {
    dateFilter.lte = new Date(query.dateTo as string)
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0
  const prismaDateWhere = hasDateFilter ? { createdAt: dateFilter } : {}

  let pageViews: any[] = []
  let itemClicks: any[] = []

  // Concurrently get rows matching request scope bounds
  if (!query.type || query.type === "pageView") {
    pageViews = await db.pageView.findMany({
      where: { userId: sessionUser.id, ...prismaDateWhere },
      take: 50000,
      orderBy: { createdAt: "asc" },
    })
  }

  if (!query.type || query.type === "itemClick") {
    itemClicks = await db.itemClick.findMany({
      where: { item: { userId: sessionUser.id }, ...prismaDateWhere },
      take: 50000,
      orderBy: { createdAt: "asc" },
      include: { item: { select: { type: true, order: true } } }, // Include parent item information to enrich the cold archive file details
    })
  }
  if (pageViews.length + itemClicks.length === 0) {
    return { success: true, message: "No records found within selected range parameters" }
  }

  // Atomic purging transaction execution across active relations
  let purgedCount = 0
  await db.$transaction(async (tx) => {
    if (pageViews.length > 0) {
      const result = await tx.pageView.deleteMany({ where: { id: { in: pageViews.map(pv => pv.id) } } })
      purgedCount += result.count
    }
    if (itemClicks.length > 0) {
      const result = await tx.itemClick.deleteMany({ where: { id: { in: itemClicks.map(ic => ic.id) } } })
      purgedCount += result.count
    }
  })

  const user = await db.user.findUnique({ where: { id: sessionUser.id }, select: { slug: true } })

  await deleteCached(`analytics:overview:${sessionUser.id}:${query.dateFrom || "all"}:${query.dateTo || "all"}`, CacheKeys.analytics(sessionUser.id), CacheKeys.userProfile(user?.slug || ""))

  return { success: true, message: `Successfully deleted ${purgedCount} entries.` }
})
