import { createError } from "h3"
import { vi } from "vitest"

export { createError }

export const getUserSession = vi.fn()
export const setUserSession = vi.fn()
export const clearUserSession = vi.fn()
export const deleteCached = vi.fn()
export const setCached = vi.fn()
export const getRedisClient = vi.fn()
export const generateToken = vi.fn()
export const assertValidUserSession = vi.fn()
export const createAuthenticatedSession = vi.fn()
export const destroyAuthenticatedSession = vi.fn()

export const CacheKeys = {
  userData: (userId: string) => `user:data:${userId}`,
  userProfile: (userSlug: string) => `user:profile:${userSlug}`,
  userItems: (userId: string) => `user:items:${userId}`,
  userAssets: (userId: string) => `user:assets:${userId}`,
  userComments: (userId: string) => `user:comments:${userId}`,
  analytics: (userId: string) => `user:analytics:${userId}`,
  widget: (platform: string, handle: string) => `widget:${platform}:${handle}`,
  geocode: (query: string) => `geocode:${query}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
  session: (sessionId: string) => `session:${sessionId}`,
}

export const db = {
  user: { findUnique: vi.fn() },
  userAsset: { findMany: vi.fn() },
}

export function resetNitroMocks() {
  getUserSession.mockReset()
  setUserSession.mockReset()
  clearUserSession.mockReset()
  deleteCached.mockReset()
  setCached.mockReset()
  getRedisClient.mockReset()
  generateToken.mockReset()
  assertValidUserSession.mockReset()
  createAuthenticatedSession.mockReset()
  destroyAuthenticatedSession.mockReset()
  db.user.findUnique.mockReset()
  db.userAsset.findMany.mockReset()
  deleteCached.mockResolvedValue(undefined)
  setCached.mockResolvedValue(true)
  setUserSession.mockResolvedValue(undefined)
  clearUserSession.mockResolvedValue(undefined)
  generateToken.mockReturnValue("session-token")
}
