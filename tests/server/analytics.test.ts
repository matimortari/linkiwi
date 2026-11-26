import { describe, expect, it } from "vitest"
import { mergeDailyStats, parseAnalyticsDate, summarizeReferrers } from "../../server/utils/analytics"

describe("parseAnalyticsDate", () => {
  it("makes a date-only end bound cover the whole UTC day", () => {
    expect(parseAnalyticsDate("2024-02-01", "start")).toEqual(new Date("2024-02-01T00:00:00.000Z"))
    expect(parseAnalyticsDate("2024-02-01", "end")).toEqual(new Date("2024-02-02T00:00:00.000Z"))
    expect(parseAnalyticsDate("2024-02-29", "end")).toEqual(new Date("2024-03-01T00:00:00.000Z"))
  })

  it("keeps a datetime end bound inclusive", () => {
    expect(parseAnalyticsDate("2024-02-01T10:00:00.000Z", "end")).toEqual(new Date("2024-02-01T10:00:00.001Z"))
  })

  it("ignores missing and invalid values", () => {
    expect(parseAnalyticsDate(undefined, "start")).toBeUndefined()
    expect(parseAnalyticsDate("", "end")).toBeUndefined()
    expect(parseAnalyticsDate("not-a-date", "end")).toBeUndefined()
    expect(parseAnalyticsDate(["2024-02-01"], "end")).toBeUndefined()
  })
})

describe("mergeDailyStats", () => {
  it("merges page views and typed clicks onto UTC calendar days", () => {
    expect(mergeDailyStats(
      [
        { date: "2024-02-01T10:00:00.000Z", count: 2 },
        { date: "2024-02-01", count: 1 },
      ],
      [
        { date: "2024-02-01T12:00:00.000Z", type: "LINK", count: 1 },
        { date: "2024-02-02T12:00:00.000Z", type: "ICON", count: 1 },
        { date: "2024-02-02T13:00:00.000Z", type: "WIDGET", count: 3 },
      ],
    )).toEqual([
      { date: "2024-02-01", pageViews: 3, linkClicks: 1, iconClicks: 0, widgetClicks: 0 },
      { date: "2024-02-02", pageViews: 0, linkClicks: 0, iconClicks: 1, widgetClicks: 3 },
    ])
  })
})

describe("summarizeReferrers", () => {
  it("normalizes empty sources, ranks by count, and caps the list", () => {
    expect(summarizeReferrers(
      [
        { source: null, count: 2 },
        { source: "YouTube", count: 4 },
        { source: "direct", count: 1 },
        { source: "other", count: 1 },
      ],
      8,
      3,
    )).toEqual([
      { source: "youtube", count: 4, percentage: "50.0" },
      { source: "direct", count: 3, percentage: "37.5" },
      { source: "other", count: 1, percentage: "12.5" },
    ])
  })
})
