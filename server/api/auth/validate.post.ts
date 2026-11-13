export default defineEventHandler(async (event) => {
  // Rate limit: 120 requests per hour per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown"
  await enforceRateLimit(event, `auth:validate:${ip}`, 120)

  const session = await getUserSession(event)
  const validSession = await assertValidUserSession(event, session, { touch: false })

  return { valid: true, expiresAt: validSession.expiresAt }
})
