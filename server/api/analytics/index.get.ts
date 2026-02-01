import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CacheKeys, getCached, setCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  // Try to get from cache first
  const cacheKey = CacheKeys.analytics(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const [pageViews, linkClicks, iconClicks] = await Promise.all([
    db.pageView.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        referrer: true,
        source: true,
      },
    }),
    db.linkClick.findMany({
      where: { userLink: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      include: { userLink: true },
    }),
    db.iconClick.findMany({
      where: { userIcon: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      include: { userIcon: true },
    }),
  ])

  const result = { pageViews, linkClicks, iconClicks }
  await setCached(cacheKey, result, CacheTTL.SHORT)

  return result
})
