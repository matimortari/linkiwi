import { describe, expect, it } from "vitest"
import { createProfileItemSchema, updateProfileItemSchema } from "../../shared/schemas/profile-item-schema"

describe("createProfileItemSchema", () => {
  it("accepts a LINK item", () => {
    expect(createProfileItemSchema.parse({ type: "LINK", link: { url: "https://example.com", label: "  Site  " } })).toMatchObject({ type: "LINK", link: { url: "https://example.com", label: "Site" }, isPinned: false, isVisible: true })
  })

  it("rejects non-http LINK urls", () => {
    expect(createProfileItemSchema.safeParse({ type: "LINK", link: { url: "ftp://example.com", label: "Site" } }).success).toBe(false)
  })

  it("accepts a DIVIDER item", () => {
    expect(createProfileItemSchema.parse({ type: "DIVIDER" })).toMatchObject({ type: "DIVIDER" })
  })

  it("accepts ICON, WIDGET, and PHOTO_GRID items", () => {
    expect(createProfileItemSchema.parse({ type: "ICON", icon: { url: "https://example.com/me", platform: "github", logo: "simple-icons:github" } })).toMatchObject({ type: "ICON" })
    expect(createProfileItemSchema.parse({ type: "WIDGET", widget: { type: "GITHUB", handle: "  octocat  " } })).toMatchObject({ type: "WIDGET", widget: { type: "GITHUB", handle: "octocat" } })
    expect(createProfileItemSchema.parse({ type: "PHOTO_GRID", photoGrid: { photos: [{ assetId: "tz4a98xxat96iws9zmbrgj3a", url: "https://cdn.example.com/a.jpg", order: 0 }] } })).toMatchObject({ type: "PHOTO_GRID" })
  })

  it("rejects non-http ICON and PHOTO_GRID urls", () => {
    expect(createProfileItemSchema.safeParse({ type: "ICON", icon: { url: "ftp://example.com/me", platform: "github", logo: "simple-icons:github" } }).success).toBe(false)
    expect(createProfileItemSchema.safeParse({ type: "PHOTO_GRID", photoGrid: { photos: [{ assetId: "tz4a98xxat96iws9zmbrgj3a", url: "ftp://cdn.example.com/a.jpg", order: 0 }] } }).success).toBe(false)
  })

  it("rejects schedules where end is before start", () => {
    expect(createProfileItemSchema.safeParse({ type: "DIVIDER", scheduledStart: "2024-02-01T00:00:00.000Z", scheduledEnd: "2024-01-01T00:00:00.000Z" }).success).toBe(false)
  })
})

describe("updateProfileItemSchema", () => {
  it("accepts partial link updates", () => {
    expect(updateProfileItemSchema.parse({ link: { label: "Updated" } })).toEqual({ link: { label: "Updated" } })
  })

  it("rejects inverted schedule windows", () => {
    expect(updateProfileItemSchema.safeParse({ scheduledStart: "2024-02-01T00:00:00.000Z", scheduledEnd: "2024-01-01T00:00:00.000Z" }).success).toBe(false)
  })
})
