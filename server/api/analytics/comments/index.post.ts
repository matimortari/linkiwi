import db from "#server/lib/db"

export default defineEventHandler(async (event) => {
  const { userId, name, email, message } = await readBody(event)
  if (!name || !message || message.length > 500) {
    throw createError({ statusCode: 400, message: "Invalid input" })
  }

  // Check if user has guestbook enabled
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  })
  if (!user?.preferences?.enableGuestbook) {
    throw createError({ statusCode: 403, message: "Guestbook disabled" })
  }

  const comment = await db.comment.create({
    data: {
      userId,
      name: name.trim(),
      email: email?.trim() || null,
      message: message.trim(),
    },
  })

  return comment
})
