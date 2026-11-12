import type { H3Event } from "h3"

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
export const SESSION_INACTIVITY_MS = 30 * 60 * 1000
export const SESSION_ACTIVITY_TOUCH_MS = 60 * 1000

/**
 * Registers a session id in Redis so logout can revoke sealed cookies.
 */
export function registerSession(sessionId: string, userId: string, expiresAt: Date): Promise<boolean> {
  return setCached(CacheKeys.session(sessionId), { userId }, Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000)))
}

/**
 * Removes a session id from the Redis registry (logout / expiry).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await deleteCached(CacheKeys.session(sessionId))
}

/**
 * Checks whether a session id is still present in Redis.
 */
export async function getSessionRegistration(sessionId: string): Promise<"active" | "missing" | "unavailable"> {
  try {
    const client = await getRedisClient()
    if (!client) {
      return "unavailable"
    }

    const data = await client.get(CacheKeys.session(sessionId))
    return data ? "active" : "missing"
  }
  catch {
    return "unavailable"
  }
}

/**
 * Extends the Redis session TTL to match absolute cookie expiry.
 */
export async function touchSessionRegistration(sessionId: string, userId: string, expiresAt: Date): Promise<void> {
  await setCached(CacheKeys.session(sessionId), { userId }, Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000)))
}

/**
 * Creates an authenticated session cookie and registers it for revocation when possible.
 */
export async function createAuthenticatedSession(event: H3Event, user: User): Promise<void> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_MS)
  const sessionId = generateToken(32)
  const registered = await registerSession(sessionId, user.id, expiresAt)

  await setUserSession(event, { user, loggedInAt: now, expiresAt, lastActivityAt: now, ...(registered ? { sessionId } : {}) })
}

/**
 * Validates absolute expiry, inactivity, and optional Redis revocation state.
 * Clears the cookie and throws 401 when the session is no longer valid.
 * Touches lastActivityAt (throttled) so API usage counts as activity.
 */
export async function assertValidUserSession(event: H3Event, session: any, options: { touch?: boolean | "always" } = {}): Promise<any> {
  if (!session.user?.id || !session.expiresAt || !session.lastActivityAt) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const now = new Date()
  const expiresAt = new Date(session.expiresAt)
  const lastActivityAt = new Date(session.lastActivityAt)

  if (Number.isNaN(expiresAt.getTime()) || Number.isNaN(lastActivityAt.getTime())) {
    if (session.sessionId) {
      await revokeSession(session.sessionId)
    }
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: "Invalid session data" })
  }

  if (now > expiresAt) {
    if (session.sessionId) {
      await revokeSession(session.sessionId)
    }
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: "Session expired" })
  }

  if (now.getTime() - lastActivityAt.getTime() > SESSION_INACTIVITY_MS) {
    if (session.sessionId) {
      await revokeSession(session.sessionId)
    }
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: "Session timed out due to inactivity" })
  }

  if (session.sessionId) {
    const registration = await getSessionRegistration(session.sessionId)
    if (registration === "missing") {
      await clearUserSession(event)
      throw createError({ statusCode: 401, statusMessage: "Session revoked" })
    }
  }

  const shouldTouch = options.touch === "always" || (options.touch !== false && now.getTime() - lastActivityAt.getTime() >= SESSION_ACTIVITY_TOUCH_MS)
  if (!shouldTouch) {
    return session
  }

  const nextSession = { ...session, lastActivityAt: now }
  await setUserSession(event, nextSession)
  if (session.sessionId) {
    await touchSessionRegistration(session.sessionId, session.user.id, expiresAt)
  }

  return nextSession
}

/**
 * Clears the cookie and revokes the Redis registration when present.
 */
export async function destroyAuthenticatedSession(event: H3Event): Promise<void> {
  const session = await getUserSession(event)
  if (session.sessionId) {
    await revokeSession(session.sessionId)
  }
  await clearUserSession(event)
}
