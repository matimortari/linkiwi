import { describe, expect, it } from "vitest"
import { formatDate, fromDatetimeLocalValue, getErrorMessage, slugify, toDatetimeLocalValue } from "../../app/utils/helpers"

describe("formatDate", () => {
  it("returns a placeholder for empty input", () => {
    expect(formatDate(null)).toBe("-")
    expect(formatDate(undefined)).toBe("-")
  })
})

describe("toDatetimeLocalValue", () => {
  it("returns empty string for empty input", () => {
    expect(toDatetimeLocalValue(null)).toBe("")
    expect(toDatetimeLocalValue(undefined)).toBe("")
  })

  it("formats a local date for datetime-local inputs", () => {
    const date = new Date(2024, 0, 5, 9, 7)
    expect(toDatetimeLocalValue(date)).toBe("2024-01-05T09:07")
  })
})

describe("fromDatetimeLocalValue", () => {
  it("returns null for empty or invalid input", () => {
    expect(fromDatetimeLocalValue("")).toBeNull()
    expect(fromDatetimeLocalValue("not-a-date")).toBeNull()
  })

  it("round-trips with toDatetimeLocalValue", () => {
    const local = "2024-01-05T09:07"
    const iso = fromDatetimeLocalValue(local)
    expect(iso).toBeTruthy()
    expect(toDatetimeLocalValue(iso)).toBe(local)
  })
})

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("trims surrounding whitespace", () => {
    expect(slugify("  Foo Bar  ")).toBe("foo-bar")
  })
})

describe("getErrorMessage", () => {
  it("returns fallback for non-objects", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback")
    expect(getErrorMessage("oops", "fallback")).toBe("fallback")
  })

  it("joins Zod-style issues", () => {
    expect(getErrorMessage({ data: { issues: [{ message: "a" }, { message: "b" }] } }, "fallback")).toBe("a, b")
  })

  it("prefers statusText then message", () => {
    expect(getErrorMessage({ data: { statusText: "denied" } }, "fallback")).toBe("denied")
    expect(getErrorMessage({ message: "boom" }, "fallback")).toBe("boom")
  })
})
