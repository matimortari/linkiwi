export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `items:get:${sessionUser.id}`, 200)

  const cacheKey = CacheKeys.userItems(sessionUser.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { items: cached }
  }

  // Fetch all polymorphic items in a single, sequential database query
  const items = await db.profileItem.findMany({
    where: { userId: sessionUser.id },
    orderBy: { order: "asc" },
    include: {
      link: true,
      icon: true,
      widget: true,
      photoGrid: { include: { photos: { orderBy: { order: "asc" } } } },
      _count: { select: { clicks: true } }, // Aggregates total clicks for each item on the fly
    },
  })

  // Format items to include clickCount and exclude _count from the response
  const formattedItems = items.map((item) => {
    const { _count, ...rest } = item
    return { ...rest, clickCount: _count.clicks }
  })

  await setCached(cacheKey, formattedItems, CACHE_TTL.SHORT)

  return { items: formattedItems }
})

defineRouteMeta({
  openAPI: {
    summary: "Get profile items",
    description: "Returns all profile items for the current user, ordered by position, with click counts.",
    tags: ["Items"],
    responses: {
      200: { description: "User profile items with type-specific data and click counts" },
      401: { description: "Unauthenticated" },
      429: { description: "Rate limit exceeded" },
    },
  },
})
