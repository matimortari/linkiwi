export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  // Rate limit: 200 requests per hour per user
  await enforceRateLimit(event, `comments:get:${sessionUser.id}`, 200)

  const cacheKey = CacheKeys.userComments(sessionUser.id)
  const cached = await getCached<any>(cacheKey)
  if (cached) {
    return { comments: cached }
  }

  const comments = await db.comment.findMany({ where: { userId: sessionUser.id }, orderBy: { createdAt: "desc" } })

  await setCached(cacheKey, comments, CACHE_TTL.SHORT)

  return { comments }
})
