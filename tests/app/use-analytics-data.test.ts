import { beforeEach, describe, expect, it } from "vitest"
import { useAnalyticsData } from "../../app/composables/use-analytics-data"

describe("useAnalyticsData", () => {
  beforeEach(() => {
    const analytics = useAnalyticsStore()
    const items = useProfileItemsStore()
    const user = useUserStore()

    analytics.pageViews = []
    analytics.itemClicks = []
    items.items = []
    user.user = { id: "u1", email: "a@b.c", name: "Ada", image: "", slug: "ada", createdAt: "2024-01-01T00:00:00.000Z" }
  })

  it("aggregates totals, click rate, and daily stats", () => {
    const analytics = useAnalyticsStore()
    analytics.pageViews = [
      { id: "v1", userId: "u1", createdAt: "2024-02-01T10:00:00.000Z", source: "direct" },
      { id: "v2", userId: "u1", createdAt: "2024-02-01T11:00:00.000Z", referrer: "https://www.twitter.com/x" },
    ]
    analytics.itemClicks = [
      { id: "c1", itemId: "link-1", createdAt: "2024-02-01T12:00:00.000Z", item: { id: "link-1", type: "LINK", link: { label: "Site", url: "/" } } as ProfileItem },
      { id: "c2", itemId: "icon-1", createdAt: "2024-02-02T12:00:00.000Z", item: { id: "icon-1", type: "ICON" } as ProfileItem },
    ]

    const data = useAnalyticsData()

    expect(data.totalViews.value).toBe(2)
    expect(data.totalClicks.value).toBe(2)
    expect(data.clickRate.value).toBe("100.00")
    expect(data.stats.value).toEqual([{ date: "2024-02-01", pageViews: 2, linkClicks: 1, iconClicks: 0, widgetClicks: 0 }, { date: "2024-02-02", pageViews: 0, linkClicks: 0, iconClicks: 1, widgetClicks: 0 }])
    expect(data.pageViewsChartData.value?.datasets[0]?.data).toEqual([2, 0])
    expect(data.linkClicksChartData.value?.datasets[0]?.data).toEqual([1])
  })

  it("builds top referrers and per-link click charts", () => {
    const analytics = useAnalyticsStore()
    const items = useProfileItemsStore()

    analytics.pageViews = [
      { id: "v1", userId: "u1", createdAt: "2024-02-01T10:00:00.000Z", source: "direct" },
      { id: "v2", userId: "u1", createdAt: "2024-02-01T11:00:00.000Z", referrer: "https://youtu.be/abc" },
      { id: "v3", userId: "u1", createdAt: "2024-02-01T12:00:00.000Z", referrer: "https://youtu.be/def" },
    ]
    analytics.itemClicks = [
      { id: "c1", itemId: "link-1", createdAt: "2024-02-01T12:00:00.000Z", item: { id: "link-1", type: "LINK" } as ProfileItem },
      { id: "c2", itemId: "link-1", createdAt: "2024-02-01T13:00:00.000Z", item: { id: "link-1", type: "LINK" } as ProfileItem },
    ]
    items.items = [
      { id: "link-1", type: "LINK", link: { label: "Portfolio", url: "/p" } } as ProfileItem,
      { id: "link-2", type: "LINK", link: { label: "Unused", url: "/u" } } as ProfileItem,
    ]

    const data = useAnalyticsData()

    expect(data.topReferrers.value[0]).toMatchObject({ source: "youtube", label: "YouTube", count: 2 })
    expect(data.topReferrers.value.some(r => r.source === "direct")).toBe(true)
    expect(data.clicksPerLinkChartData.value).toMatchObject({ labels: ["Portfolio"], datasets: [{ data: [2] }] })
    expect(data.referrerChartData.value?.labels).toContain("YouTube")
  })
})
