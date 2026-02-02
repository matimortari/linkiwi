import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CACHE_TTL, CacheKeys, getCached, setCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const cacheKey = CacheKeys.analytics(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return cached
  }

  const [pageViews, linkClicks, iconClicks] = await Promise.all([
    db.pageView.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, userId: true, createdAt: true, referrer: true, source: true },
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

  await setCached(cacheKey, { pageViews, linkClicks, iconClicks }, CACHE_TTL.SHORT)

  return { pageViews, linkClicks, iconClicks }
})
