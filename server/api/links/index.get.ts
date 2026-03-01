export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const cacheKey = CacheKeys.userLinks(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { links: cached }
  }

  const links = await db.userLink.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      url: true,
      title: true,
      order: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: "asc" },
  })

  await setCached(cacheKey, links, CACHE_TTL.SHORT)

  return { links }
})
