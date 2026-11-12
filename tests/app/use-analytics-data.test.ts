import { beforeEach, describe, expect, it } from "vitest"
import { useAnalyticsData } from "../../app/composables/use-analytics-data"

describe("useAnalyticsData", () => {
  beforeEach(() => {
    const analytics = useAnalyticsStore()
    const user = useUserStore()

    analytics.summary = {
      totalViews: 0,
      totalClicks: 0,
      stats: [],
      topReferrers: [],
      clicksPerLink: [],
    }
    user.user = { id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada", createdAt: "2024-01-01T00:00:00.000Z" }
  })

  it("aggregates totals, click rate, and daily stats", () => {
    const analytics = useAnalyticsStore()
    analytics.summary = {
      totalViews: 2,
      totalClicks: 2,
      stats: [
        { date: "2024-02-01", pageViews: 2, linkClicks: 1, iconClicks: 0, widgetClicks: 0 },
        { date: "2024-02-02", pageViews: 0, linkClicks: 0, iconClicks: 1, widgetClicks: 0 },
      ],
      topReferrers: [],
      clicksPerLink: [],
    }

    const data = useAnalyticsData()

    expect(data.totalViews.value).toBe(2)
    expect(data.totalClicks.value).toBe(2)
    expect(data.clickRate.value).toBe("100.00")
    expect(data.stats.value).toEqual([{ date: "2024-02-01", pageViews: 2, linkClicks: 1, iconClicks: 0, widgetClicks: 0 }, { date: "2024-02-02", pageViews: 0, linkClicks: 0, iconClicks: 1, widgetClicks: 0 }])
    expect(data.pageViewsChartData.value?.datasets[0]?.data).toEqual([2, 0])
    expect(data.linkClicksChartData.value?.datasets[0]).toMatchObject({ label: "Total Link Clicks", data: [1] })
    expect(data.iconClicksChartData.value?.datasets[0]).toMatchObject({ label: "Total Social Icon Clicks", data: [1] })
  })

  it("builds top referrers and per-link click charts", () => {
    const analytics = useAnalyticsStore()
    analytics.summary = {
      totalViews: 3,
      totalClicks: 2,
      stats: [],
      topReferrers: [
        { source: "youtube", count: 2, percentage: "66.7" },
        { source: "direct", count: 1, percentage: "33.3" },
      ],
      clicksPerLink: [{ itemId: "link-1", label: "Portfolio", count: 2 }],
    }

    const data = useAnalyticsData()

    expect(data.topReferrers.value[0]).toMatchObject({ source: "youtube", label: "YouTube", count: 2 })
    expect(data.topReferrers.value.some(r => r.source === "direct")).toBe(true)
    expect(data.clicksPerLinkChartData.value).toMatchObject({ labels: ["Portfolio"], datasets: [{ data: [2] }] })
    expect(data.referrerChartData.value?.labels).toContain("YouTube")
  })
})
