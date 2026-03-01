export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const cacheKey = CacheKeys.userIcons(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { icons: cached }
  }

  const icons = await db.userIcon.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      url: true,
      platform: true,
      logo: true,
      order: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: "asc" },
  })

  await setCached(cacheKey, icons, CACHE_TTL.SHORT)

  return { icons }
})
