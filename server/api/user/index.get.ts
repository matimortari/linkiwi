import db from "#server/utils/db"
import { getUserFromSession } from "#server/utils/helpers"
import { CACHE_TTL, CacheKeys, getCached, setCached } from "#server/utils/redis"

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  const cacheKey = CacheKeys.userData(user.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { userData: cached }
  }

  const userData = await db.user.findUnique({
    where: { id: user.id },
    include: {
      preferences: true,
      comments: true,
      views: true,
    },
  })
  if (!userData) {
    throw createError({ status: 404, statusText: "User not found" })
  }

  await setCached(cacheKey, userData, CACHE_TTL.SHORT)

  return { userData }
})
