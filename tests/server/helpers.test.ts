import { afterEach, describe, expect, it, vi } from "vitest"
import { categorizeReferrer, requireEnv } from "../../server/utils/helpers"

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
  })

  it("keeps simple ref tags", () => {
    expect(categorizeReferrer("newsletter")).toBe("newsletter")
  })

  it("maps known platforms", () => {
    expect(categorizeReferrer("https://twitter.com/foo")).toBe("twitter")
    expect(categorizeReferrer("https://x.com/foo")).toBe("twitter")
    expect(categorizeReferrer("https://github.com/foo")).toBe("github")
    expect(categorizeReferrer("https://www.google.com/search")).toBe("google")
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
