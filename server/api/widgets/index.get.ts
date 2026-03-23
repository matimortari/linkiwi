export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `widgets:get:${user.id}`, 200)

  const cacheKey = CacheKeys.userWidgets(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { widgets: cached }
  }

  const widgets = await db.widget.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      type: true,
      handle: true,
      order: true,
      isVisible: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: "asc" },
  })

  await setCached(cacheKey, widgets, CACHE_TTL.SHORT)

  return { widgets }
})
