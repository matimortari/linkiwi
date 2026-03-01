export default defineEventHandler(async (event) => {
  // Rate limit: 120 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:validate:${ip}`, 120, 60 * 60 * 1000)

  const session = await getUserSession(event)
  if (!session.user || !session.expiresAt || !session.lastActivityAt) {
    throw createError({ status: 401, message: "Not authenticated" })
  }

  const now = new Date()
  const expiresAt = new Date(session.expiresAt)
  const lastActivityAt = new Date(session.lastActivityAt)

  // Validate dates and check expiration/inactivity
  if (Number.isNaN(expiresAt.getTime()) || Number.isNaN(lastActivityAt.getTime())) {
    await clearUserSession(event)
    throw createError({ status: 401, message: "Invalid session data" })
  }

  // Check if session has expired
  if (now > expiresAt) {
    await clearUserSession(event)
    throw createError({ status: 401, message: "Session expired" })
  }

  if (now.getTime() - lastActivityAt.getTime() > 30 * 60 * 1000) {
    await clearUserSession(event)
    throw createError({ status: 401, message: "Session timed out due to inactivity" })
  }

  await setUserSession(event, { ...session, lastActivityAt: now })

  return { valid: true, expiresAt: session.expiresAt }
})
