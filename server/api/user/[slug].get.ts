import db from "#server/utils/db"
import { CACHE_TTL, CacheKeys, getCached, setCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ status: 400, statusText: "Slug is required" })
  }

  const cacheKey = CacheKeys.userProfile(slug)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { userProfile: cached }
  }

  const userProfile = await db.user.findUnique({
    where: { slug },
    include: { links: { orderBy: { createdAt: "asc" } }, icons: { orderBy: { createdAt: "asc" } }, preferences: true },
  })
  if (!userProfile) {
    throw createError({ status: 404, statusText: `User '${slug}' not found` })
  }

  await setCached(cacheKey, userProfile, CACHE_TTL.LONG)

  return { userProfile }
})
