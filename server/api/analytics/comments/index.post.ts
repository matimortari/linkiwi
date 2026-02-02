import db from "#server/utils/db"
import { CacheKeys, deleteCached } from "#server/utils/redis"
import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ status: 400, statusText: result.error.issues[0]?.message || "Invalid input" })
  }

  // Check if user has guestbook enabled
  const user = await db.user.findUnique({ where: { id: result.data.userId }, include: { preferences: true } })
  if (!user) {
    throw createError({ status: 404, statusText: "User not found" })
  }
  if (!user.preferences?.enableGuestbook) {
    throw createError({ status: 403, statusText: "Guestbook is disabled for this user" })
  }

  const comment = await db.comment.create({
    data: {
      userId: result.data.userId,
      name: result.data.name,
      email: result.data.email || null,
      message: result.data.message,
    },
  })

  // Invalidate user data cache
  await deleteCached(CacheKeys.userData(result.data.userId))

  return { comment }
})
