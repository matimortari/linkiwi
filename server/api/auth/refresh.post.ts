export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }

  const now = new Date()
  const expiresAt = new Date(session.expiresAt)

  // Check if session has expired
  if (now > expiresAt) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, message: "Session expired" })
  }

  // Extend session by 7 days from now
  const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  await setUserSession(event, {
    ...session,
    expiresAt: newExpiresAt,
    lastActivityAt: now,
  })

  return {
    success: true,
    expiresAt: newExpiresAt,
  }
})
