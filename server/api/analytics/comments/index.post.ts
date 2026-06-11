import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const { userId, name, email, message } = result.data

  // Rate limit: 10 requests per hour per IP
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "anonymous"
  await enforceRateLimit(event, `comments:public-create:${clientIp}`, 10)

  const targetUser = await db.user.findUnique({ where: { id: userId }, select: { slug: true, preferences: { select: { enableGuestbook: true } } } })
  if (!targetUser) {
    throw createError({ status: 404, statusText: "The target profile does not exist." })
  }
  if (!targetUser.preferences?.enableGuestbook) {
    throw createError({ status: 403, statusText: "This user has disabled their guestbook." })
  }

  const newComment = await db.comment.create({ data: { userId, name, email: email || null, message } })

  await deleteCached(CacheKeys.userComments(userId), CacheKeys.userProfile(targetUser.slug))

  return { newComment }
})
