export default defineEventHandler(async (event) => {
  // Rate limit: 20 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:logout:${ip}`, 20, 60 * 60 * 1000)

  const session = await getUserSession(event)
  if (!session.user || !session.expiresAt || !session.lastActivityAt) {
    throw createError({ status: 401, message: "Not authenticated" })
  }

  await clearUserSession(event)

  return { success: true }
})
