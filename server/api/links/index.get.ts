import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CACHE_TTL, CacheKeys, getCached, setCached } from "#server/utils/redis"

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
      clickCount: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  await setCached(cacheKey, links, CACHE_TTL.SHORT)

  return { links }
})
