import { describe, expect, it } from "vitest"
import { mergeDailyStats, summarizeReferrers } from "../../server/utils/analytics"

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
