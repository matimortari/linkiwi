import { describe, expect, it } from "vitest"
import { updateUserPreferencesSchema, updateUserSchema, userBannerSchema } from "../../shared/schemas/user-schema"

describe("updateUserSchema", () => {
  it("accepts a valid name", () => {
    expect(updateUserSchema.parse({ name: "  Ada  " })).toEqual({ name: "Ada" })
  })

  it("rejects names that are too short", () => {
    expect(updateUserSchema.safeParse({ name: "ab" }).success).toBe(false)
  })

  it("accepts a valid slug", () => {
    expect(updateUserSchema.parse({ slug: "ada-lovelace" })).toEqual({ slug: "ada-lovelace" })
  })

  it("rejects invalid slugs", () => {
    expect(updateUserSchema.safeParse({ slug: "Ada_Lovelace" }).success).toBe(false)
  })

  it("allows an empty object", () => {
    expect(updateUserSchema.parse({})).toEqual({})
  })
})

describe("updateUserPreferencesSchema", () => {
  it("accepts partial preferences with valid hex colors", () => {
    expect(updateUserPreferencesSchema.parse({
      backgroundType: "FLAT",
      backgroundColor: "#fff",
    })).toEqual({
      backgroundType: "FLAT",
      backgroundColor: "#fff",
    })
  })

  it("rejects invalid hex colors", () => {
    expect(updateUserPreferencesSchema.safeParse({
      backgroundColor: "red",
    }).success).toBe(false)
  })
})

describe("userBannerSchema", () => {
  it("accepts a valid banner url", () => {
    expect(userBannerSchema.parse({ url: "https://cdn.example.com/banner.png" })).toEqual({
      url: "https://cdn.example.com/banner.png",
    })
  })

  it("rejects invalid urls", () => {
    expect(userBannerSchema.safeParse({ url: "not-a-url" }).success).toBe(false)
  })
})
