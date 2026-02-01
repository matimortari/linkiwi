import db from "#server/utils/db"
import { CacheKeys, deleteCached } from "#server/utils/redis"
import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  const { userId, name, email, message } = result.data

  // Check if user has guestbook enabled
  const user = await db.user.findUnique({ where: { id: userId }, include: { preferences: true } })
  if (!user) {
    throw createError({ status: 404, statusText: "User not found" })
  }
  if (!user.preferences?.enableGuestbook) {
    throw createError({ status: 403, statusText: "Guestbook is disabled for this user" })
  }

  const comment = await db.comment.create({
    data: {
      userId,
      name,
      email: email || null,
      message,
    },
  })

  // Invalidate user data cache
  await deleteCached(CacheKeys.userData(userId))

  return { comment }
})
