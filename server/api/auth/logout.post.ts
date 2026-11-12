export default defineEventHandler(async (event) => {
  // Rate limit: 20 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:logout:${ip}`, 20)

  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }

  await destroyAuthenticatedSession(event)

  return { success: true }
})
