import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { categorizeReferrer, generateSlug, getUserFromSession, requireEnv, resolvePhotoGrid } from "../../server/utils/helpers"
import { db, getUserSession, resetNitroMocks } from "../mocks/nitro-runtime"

describe("requireEnv", () => {
  const key = "LINKIWI_TEST_REQUIRE_ENV"

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns the env value when set", () => {
    vi.stubEnv(key, "value")
    expect(requireEnv(key)).toBe("value")
  })

  it("throws when the env value is missing", () => {
    vi.stubEnv(key, "")
    expect(() => requireEnv(key)).toThrow(`Missing required environment variable: ${key}`)
  })
})

describe("categorizeReferrer", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns direct for empty values", () => {
    expect(categorizeReferrer(null)).toBe("direct")
    expect(categorizeReferrer(undefined)).toBe("direct")
    expect(categorizeReferrer("")).toBe("direct")
    expect(categorizeReferrer("   ")).toBe("direct")
    expect(categorizeReferrer(123 as any)).toBe("direct")
  })

  it("keeps simple ref tags", () => {
    expect(categorizeReferrer("newsletter")).toBe("newsletter")
  })

  it("maps known platforms", () => {
    expect(categorizeReferrer("https://x.com/foo")).toBe("twitter")
    expect(categorizeReferrer("https://github.com/foo")).toBe("github")
    expect(categorizeReferrer("https://www.google.com/search")).toBe("google")
    expect(categorizeReferrer("https://fb.me/x")).toBe("facebook")
    expect(categorizeReferrer("https://lnkd.in/x")).toBe("linkedin")
    expect(categorizeReferrer("https://redd.it/abc")).toBe("reddit")
    expect(categorizeReferrer("https://tiktok.com/@x")).toBe("tiktok")
    expect(categorizeReferrer("https://pin.it/x")).toBe("pinterest")
    expect(categorizeReferrer("https://youtu.be/x")).toBe("youtube")
    expect(categorizeReferrer("https://wa.me/1")).toBe("whatsapp")
    expect(categorizeReferrer("https://telegram.org/x")).toBe("telegram")
    expect(categorizeReferrer("https://discord.gg/x")).toBe("discord")
    expect(categorizeReferrer("https://example.com/mastodon/x")).toBe("mastodon")
    expect(categorizeReferrer("https://bsky.app/profile/x")).toBe("bluesky")
    expect(categorizeReferrer("https://bing.com/search")).toBe("bing")
    expect(categorizeReferrer("https://search.yahoo.com")).toBe("yahoo")
    expect(categorizeReferrer("https://duckduckgo.com/?q=x")).toBe("duckduckgo")
    expect(categorizeReferrer("https://yandex.ru/search")).toBe("yandex")
    expect(categorizeReferrer("https://slack.com/app")).toBe("slack")
    expect(categorizeReferrer("https://gitlab.com/x")).toBe("gitlab")
    expect(categorizeReferrer("https://medium.com/@x")).toBe("medium")
    expect(categorizeReferrer("https://substack.com/@x")).toBe("substack")
    expect(categorizeReferrer("https://ig.me/x")).toBe("instagram")
  })

  it("treats the app base URL as direct", () => {
    vi.stubEnv("NUXT_PUBLIC_BASE_URL", "https://linkiwi.example.com")
    expect(categorizeReferrer("https://linkiwi.example.com/ada")).toBe("direct")
  })

  it("returns unknown for unrecognized hosts", () => {
    vi.stubEnv("NUXT_PUBLIC_BASE_URL", "https://linkiwi.example.com")
    expect(categorizeReferrer("https://totally-unknown.example.org")).toBe("unknown")
  })
})

describe("getUserFromSession", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("returns the session user when present", async () => {
    getUserSession.mockResolvedValue({ user: { id: "u1", email: "a@b.c", name: "Ada", image: null, slug: "ada" } })
    await expect(getUserFromSession({} as any)).resolves.toEqual({ id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada" })
  })

  it("throws when there is no session user", async () => {
    getUserSession.mockResolvedValue({})
    await expect(getUserFromSession({} as any)).rejects.toMatchObject({ statusCode: 401 })
  })
})

describe("generateSlug", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("slugifies and returns the first available slug", async () => {
    db.user.findUnique.mockResolvedValue(null)
    await expect(generateSlug("  Café App!! ")).resolves.toBe("cafe-app")
    await expect(generateSlug()).resolves.toBe("")
  })

  it("appends a suffix on collision and falls back after retries", async () => {
    db.user.findUnique.mockResolvedValueOnce({ id: "1" }).mockResolvedValueOnce(null)
    const slug = await generateSlug("demo")
    expect(slug.startsWith("demo-")).toBe(true)

    db.user.findUnique.mockResolvedValue({ id: "taken" })
    const fallback = await generateSlug("---Name---")
    expect(fallback).toMatch(/^[a-f0-9]{12}$/)
  })
})

describe("resolvePhotoGrid", () => {
  beforeEach(() => {
    resetNitroMocks()
  })

  it("requires asset ids", async () => {
    await expect(resolvePhotoGrid([{ url: "https://x", order: 0 }], "u1")).rejects.toMatchObject({ statusCode: 400 })
  })

  it("resolves owned assets in order", async () => {
    db.userAsset.findMany.mockResolvedValue([{ id: "a1", url: "https://cdn/a1.jpg" }, { id: "a2", url: "https://cdn/a2.jpg" }])

    await expect(resolvePhotoGrid([{ assetId: "a2", url: "ignored", order: 9, alt: "two" }, { assetId: "a1", url: "ignored", order: 1 }], "u1")).resolves.toEqual([{ assetId: "a2", url: "https://cdn/a2.jpg", order: 0, alt: "two" }, { assetId: "a1", url: "https://cdn/a1.jpg", order: 1, alt: null }])
  })

  it("rejects when none or only some assets are available", async () => {
    db.userAsset.findMany.mockResolvedValue([])
    await expect(resolvePhotoGrid([{ assetId: "missing", url: "https://x", order: 0 }], "u1")).rejects.toMatchObject({ statusCode: 400 })

    db.userAsset.findMany.mockResolvedValue([{ id: "a1", url: "https://cdn/a1.jpg" }])
    await expect(resolvePhotoGrid([{ assetId: "a1", url: "https://x", order: 0 }, { assetId: "missing", url: "https://y", order: 1 }], "u1")).rejects.toMatchObject({ statusCode: 400 })
  })
})
