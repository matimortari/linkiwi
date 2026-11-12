import { beforeEach, describe, expect, it, vi } from "vitest"
import { assertValidUserSession, createAuthenticatedSession, destroyAuthenticatedSession, getSessionRegistration, registerSession, revokeSession, SESSION_ACTIVITY_TOUCH_MS, SESSION_INACTIVITY_MS, SESSION_MAX_AGE_MS } from "../../server/utils/session"
import { clearUserSession, deleteCached, generateToken, getRedisClient, getUserSession, resetNitroMocks, setCached, setUserSession } from "../mocks/nitro-runtime"

function validSession(overrides: Record<string, unknown> = {}) {
  const now = Date.now()
  return {
    user: { id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada" },
    loggedInAt: new Date(now),
    expiresAt: new Date(now + SESSION_MAX_AGE_MS),
    lastActivityAt: new Date(now - SESSION_ACTIVITY_TOUCH_MS - 1),
    sessionId: "sid-1",
    ...overrides,
  }
}

describe("registerSession / revokeSession", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("registers a session with ttl until absolute expiry", async () => {
    const expiresAt = new Date(Date.now() + 60_000)
    await expect(registerSession("sid-1", "u1", expiresAt)).resolves.toBe(true)
    expect(setCached).toHaveBeenCalledWith("session:sid-1", { userId: "u1" }, expect.any(Number))
  })

  it("revokes a session by deleting its cache key", async () => {
    await revokeSession("sid-1")
    expect(deleteCached).toHaveBeenCalledWith("session:sid-1")
  })
})

describe("getSessionRegistration", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("returns unavailable when redis is down", async () => {
    getRedisClient.mockResolvedValue(null)
    await expect(getSessionRegistration("sid-1")).resolves.toBe("unavailable")
  })

  it("returns active or missing based on redis key presence", async () => {
    const client = { get: vi.fn().mockResolvedValueOnce("{\"userId\":\"u1\"}").mockResolvedValueOnce(null) }
    getRedisClient.mockResolvedValue(client)
    await expect(getSessionRegistration("sid-1")).resolves.toBe("active")
    await expect(getSessionRegistration("sid-1")).resolves.toBe("missing")
  })
})

describe("createAuthenticatedSession", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("includes sessionId only when redis registration succeeds", async () => {
    generateToken.mockReturnValue("generated-sid")
    setCached.mockResolvedValue(true)
    await createAuthenticatedSession({} as any, { id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada" })
    expect(setUserSession).toHaveBeenCalledWith({}, expect.objectContaining({
      user: expect.objectContaining({ id: "u1", slug: "ada" }),
      sessionId: "generated-sid",
    }))
  })

  it("falls back to cookie-only sessions when redis registration fails", async () => {
    generateToken.mockReturnValue("generated-sid")
    setCached.mockResolvedValue(false)
    await createAuthenticatedSession({} as any, { id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada" })
    const payload = setUserSession.mock.calls[0]![1]
    expect(payload.sessionId).toBeUndefined()
    expect(payload.expiresAt).toBeInstanceOf(Date)
    expect(payload.lastActivityAt).toBeInstanceOf(Date)
  })
})

describe("assertValidUserSession", () => {
  beforeEach(() => {
    resetNitroMocks()
    getRedisClient.mockResolvedValue({ get: vi.fn().mockResolvedValue("{\"userId\":\"u1\"}") })
  })

  it("accepts a valid session and refreshes activity when due", async () => {
    const session = validSession()
    const next = await assertValidUserSession({} as any, session as any)
    expect(next.lastActivityAt).toBeInstanceOf(Date)
    expect(setUserSession).toHaveBeenCalled()
    expect(setCached).toHaveBeenCalledWith("session:sid-1", { userId: "u1" }, expect.any(Number))
  })

  it("rejects expired sessions", async () => {
    const session = validSession({ expiresAt: new Date(Date.now() - 1000) })
    await expect(assertValidUserSession({} as any, session as any)).rejects.toMatchObject({ statusCode: 401, statusMessage: "Session expired" })
    expect(deleteCached).toHaveBeenCalledWith("session:sid-1")
    expect(clearUserSession).toHaveBeenCalled()
  })

  it("rejects inactive sessions", async () => {
    const session = validSession({ lastActivityAt: new Date(Date.now() - SESSION_INACTIVITY_MS - 1) })
    await expect(assertValidUserSession({} as any, session as any)).rejects.toMatchObject({ statusCode: 401, statusMessage: "Session timed out due to inactivity" })
    expect(clearUserSession).toHaveBeenCalled()
  })

  it("rejects revoked sessions when redis reports missing", async () => {
    getRedisClient.mockResolvedValue({ get: vi.fn().mockResolvedValue(null) })
    const session = validSession()
    await expect(assertValidUserSession({} as any, session as any)).rejects.toMatchObject({ statusCode: 401, statusMessage: "Session revoked" })
    expect(clearUserSession).toHaveBeenCalled()
  })

  it("allows cookie-only checks when redis is unavailable", async () => {
    getRedisClient.mockResolvedValue(null)
    const session = validSession({ lastActivityAt: new Date() })
    await expect(assertValidUserSession({} as any, session as any, { touch: false })).resolves.toMatchObject({ user: { id: "u1" } })
    expect(clearUserSession).not.toHaveBeenCalled()
  })

  it("rejects incomplete session payloads", async () => {
    await expect(assertValidUserSession({} as any, { user: { id: "u1" } } as any)).rejects.toMatchObject({ statusCode: 401 })
    expect(clearUserSession).toHaveBeenCalled()
  })
})

describe("destroyAuthenticatedSession", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("revokes redis registration and clears the cookie", async () => {
    getUserSession.mockResolvedValue({ sessionId: "sid-1", user: { id: "u1" } })
    await destroyAuthenticatedSession({} as any)
    expect(deleteCached).toHaveBeenCalledWith("session:sid-1")
    expect(clearUserSession).toHaveBeenCalled()
  })

  it("clears the cookie even without a sessionId", async () => {
    getUserSession.mockResolvedValue({ user: { id: "u1" } })
    await destroyAuthenticatedSession({} as any)
    expect(deleteCached).not.toHaveBeenCalled()
    expect(clearUserSession).toHaveBeenCalled()
  })
})
