import { createError } from "h3"
import { vi } from "vitest"

export { createError }

export const getUserSession = vi.fn()

export const db = {
  user: { findUnique: vi.fn() },
  userAsset: { findMany: vi.fn() },
}

export function resetNitroMocks() {
  getUserSession.mockReset()
  db.user.findUnique.mockReset()
  db.userAsset.findMany.mockReset()
}
