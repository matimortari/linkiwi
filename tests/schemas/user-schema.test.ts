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

  it("rejects reserved slugs", () => {
    for (const slug of ["admin", "api", "brand", "legal", "sign-in"]) {
      expect(updateUserSchema.safeParse({ slug }).success).toBe(false)
    }
  })

  it("allows an empty object", () => {
    expect(updateUserSchema.parse({})).toEqual({})
  })
})

describe("updateUserPreferencesSchema", () => {
  it("accepts partial preferences with valid hex colors", () => {
    expect(updateUserPreferencesSchema.parse({ backgroundType: "FLAT", backgroundColor: "#fff" })).toEqual({ backgroundType: "FLAT", backgroundColor: "#fff" })
  })

  it("rejects invalid hex colors", () => {
    expect(updateUserPreferencesSchema.safeParse({ backgroundColor: "red" }).success).toBe(false)
  })
})

describe("userBannerSchema", () => {
  it("accepts a banner tied to an uploaded asset", () => {
    expect(userBannerSchema.parse({ assetId: "tz4a98xxat96iws9zmbrgj3a" })).toEqual({ assetId: "tz4a98xxat96iws9zmbrgj3a" })
    expect(userBannerSchema.parse({ assetId: "tz4a98xxat96iws9zmbrgj3a", url: "https://cdn.example.com/banner.png" })).toMatchObject({ assetId: "tz4a98xxat96iws9zmbrgj3a" })
  })

  it("rejects banners without an asset id", () => {
    expect(userBannerSchema.safeParse({ url: "https://cdn.example.com/banner.png" }).success).toBe(false)
    expect(userBannerSchema.safeParse({}).success).toBe(false)
  })

  it("rejects invalid optional urls", () => {
    expect(userBannerSchema.safeParse({ assetId: "tz4a98xxat96iws9zmbrgj3a", url: "not-a-url" }).success).toBe(false)
  })
})
