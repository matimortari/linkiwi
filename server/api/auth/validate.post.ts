export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }

  const now = new Date()
  const expiresAt = new Date(session.expiresAt)
  const lastActivityAt = new Date(session.lastActivityAt)

  // Check if session has expired (7 days)
  if (now > expiresAt) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, message: "Session expired" })
  }

  // Check for inactivity timeout (30 minutes)
  const thirtyMinutes = 30 * 60 * 1000
  if (now.getTime() - lastActivityAt.getTime() > thirtyMinutes) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, message: "Session timed out due to inactivity" })
  }

  // Update last activity time
  await setUserSession(event, { ...session, lastActivityAt: now })

  return { valid: true, expiresAt: session.expiresAt }
})
