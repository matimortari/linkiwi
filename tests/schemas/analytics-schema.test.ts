import { describe, expect, it } from "vitest"
import { analyticsRecordSchema, createCommentSchema } from "../../shared/schemas/analytics-schema"

describe("analyticsRecordSchema", () => {
  it("accepts a pageView event", () => {
    expect(analyticsRecordSchema.parse({ type: "pageView", slug: "ada-lovelace", referrer: "https://example.com" })).toMatchObject({ type: "pageView", slug: "ada-lovelace" })
  })

  it("nulls empty referrers", () => {
    expect(analyticsRecordSchema.parse({ type: "pageView", slug: "ada-lovelace", referrer: "   " })).toMatchObject({ type: "pageView", referrer: null })
  })

  it("keeps plain referrer labels", () => {
    expect(analyticsRecordSchema.parse({ type: "pageView", slug: "ada-lovelace", referrer: "twitter" })).toMatchObject({ type: "pageView", referrer: "twitter" })
  })

  it("nulls referrers that look like urls but cannot be parsed", () => {
    expect(analyticsRecordSchema.parse({ type: "pageView", slug: "ada-lovelace", referrer: "http://" })).toMatchObject({ type: "pageView", referrer: null })
  })

  it("rejects invalid pageView slugs", () => {
    expect(analyticsRecordSchema.safeParse({ type: "pageView", slug: "Ada_Lovelace", referrer: null }).success).toBe(false)
  })

  it("accepts an itemClick event", () => {
    expect(analyticsRecordSchema.parse({ type: "itemClick", itemId: "tz4a98xxat96iws9zmbrgj3a" })).toMatchObject({ type: "itemClick", itemId: "tz4a98xxat96iws9zmbrgj3a" })
  })
})

describe("createCommentSchema", () => {
  it("accepts a valid comment", () => {
    expect(createCommentSchema.parse({ userId: "tz4a98xxat96iws9zmbrgj3a", name: "  Ada  ", message: "  Hello  " })).toEqual({ userId: "tz4a98xxat96iws9zmbrgj3a", name: "Ada", email: undefined, message: "Hello" })
  })

  it("rejects empty messages", () => {
    expect(createCommentSchema.safeParse({ userId: "tz4a98xxat96iws9zmbrgj3a", name: "Ada", message: "" }).success).toBe(false)
  })
})
