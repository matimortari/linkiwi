import { describe, expect, it } from "vitest"
import { createProfileItemSchema, updateProfileItemSchema } from "../../shared/schemas/profile-item-schema"

describe("createProfileItemSchema", () => {
  it("accepts a LINK item", () => {
    expect(createProfileItemSchema.parse({
      type: "LINK",
      link: { url: "https://example.com", label: "  Site  " },
    })).toMatchObject({
      type: "LINK",
      link: { url: "https://example.com", label: "Site" },
      isPinned: false,
      isVisible: true,
    })
  })

  it("rejects non-http LINK urls", () => {
    expect(createProfileItemSchema.safeParse({
      type: "LINK",
      link: { url: "ftp://example.com", label: "Site" },
    }).success).toBe(false)
  })

  it("accepts a DIVIDER item", () => {
    expect(createProfileItemSchema.parse({ type: "DIVIDER" })).toMatchObject({ type: "DIVIDER" })
  })

  it("rejects schedules where end is before start", () => {
    expect(createProfileItemSchema.safeParse({
      type: "DIVIDER",
      scheduledStart: "2024-02-01T00:00:00.000Z",
      scheduledEnd: "2024-01-01T00:00:00.000Z",
    }).success).toBe(false)
  })
})

describe("updateProfileItemSchema", () => {
  it("accepts partial link updates", () => {
    expect(updateProfileItemSchema.parse({
      link: { label: "Updated" },
    })).toEqual({ link: { label: "Updated" } })
  })

  it("rejects inverted schedule windows", () => {
    expect(updateProfileItemSchema.safeParse({
      scheduledStart: "2024-02-01T00:00:00.000Z",
      scheduledEnd: "2024-01-01T00:00:00.000Z",
    }).success).toBe(false)
  })
})
