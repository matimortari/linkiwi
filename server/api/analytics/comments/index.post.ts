import db from "#server/lib/db"
import { createCommentSchema } from "#shared/schemas/analytics-schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message || "Invalid input" })
  }

  const { userId, name, email, message } = result.data

  // Check if user has guestbook enabled
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" })
  }
  if (!user.preferences?.enableGuestbook) {
    throw createError({ statusCode: 403, statusMessage: "Guestbook is disabled for this user" })
  }

  const comment = await db.comment.create({
    data: {
      userId,
      name,
      email: email || null,
      message,
    },
  })

  return { comment }
})
