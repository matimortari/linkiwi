import type { AnalyticsRecordSchema } from "#shared/schemas/analytics-schema"

export function useAnalyticsData() {
  const analyticsStore = useAnalyticsStore()
  const userStore = useUserStore()

  // Helper function to bucket records by calendar date
  function groupByDate<T extends Record<string, any>>(items: T[], dateKey: keyof T & string = "createdAt"): Record<string, number> {
    const result: Record<string, number> = {}
    for (const item of items) {
      const raw = item[dateKey]
      const date = new Date(raw)
      if (Number.isNaN(date.getTime())) {
        continue
      }

      const key = date.toISOString().split("T")[0]
      if (key) {
        result[key] = (result[key] ?? 0) + 1
      }
    }

    return result
  }

  const pageViews = computed(() => analyticsStore.pageViews)
  const linkClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "LINK"))
  const iconClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "ICON"))
  const widgetClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "WIDGET"))

  const stats = computed(() => {
    const viewsByDate = groupByDate(pageViews.value, "createdAt")
    const linksByDate = groupByDate(linkClicks.value, "createdAt")
    const iconsByDate = groupByDate(iconClicks.value, "createdAt")
    const widgetsByDate = groupByDate(widgetClicks.value, "createdAt")

    const allDates = [...new Set([...Object.keys(viewsByDate), ...Object.keys(linksByDate), ...Object.keys(iconsByDate), ...Object.keys(widgetsByDate)])].sort((a, b) => a.localeCompare(b))
    return allDates.map((date: string) => ({
      date,
      pageViews: viewsByDate[date] ?? 0,
      linkClicks: linksByDate[date] ?? 0,
      iconClicks: iconsByDate[date] ?? 0,
      widgetClicks: widgetsByDate[date] ?? 0,
    }))
  })

  const totalViews = computed(() => pageViews.value.length)
  const totalClicks = computed(() => analyticsStore.itemClicks.length)
  const clickRate = computed(() => totalViews.value ? ((totalClicks.value / totalViews.value) * 100).toFixed(2) : "0")
  const joinedAt = computed(() => userStore.user?.createdAt)

  // Chart data builder
  function buildChart(values: number[], labels: string[], label: string) {
    if (!values.some(v => v > 0)) {
      return null
    }

    return { labels, datasets: [{ label, data: values, backgroundColor: "#474b36" }] }
  }

  const pageViewsChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.pageViews), stats.value.map(s => s.date), "Page Views") : null)
  const linkClicksChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.linkClicks), stats.value.map(s => s.date), "Link Clicks") : null)
  const iconClicksChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.iconClicks), stats.value.map(s => s.date), "Social Icon Clicks") : null)

  const referrerChartData = computed(() => {
    if (!pageViews.value.length) {
      return null
    }

    const counts: Record<string, number> = {}
    pageViews.value.forEach((pv) => {
      const sourceKey = pv.referrer || pv.source || "Direct / Unknown"
      counts[sourceKey] = (counts[sourceKey] ?? 0) + 1
    })

    const topReferrers = Object.entries(counts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 6)

    return {
      labels: topReferrers.map(r => r.label),
      datasets: [
        {
          label: "Traffic Sources",
          data: topReferrers.map(r => r.count),
          backgroundColor: ["#36a2eb", "#ff6384", "#4bc0c0", "#ff9f40", "#9966ff", "#ffcd56"],
        },
      ],
    }
  })

  const normalizedRecords = computed<AnalyticsRecordSchema[]>(() => {
    const currentSlug = userStore.user?.slug ?? ""
    const viewsLog = pageViews.value.map(pv => ({ type: "pageView" as const, slug: currentSlug, referrer: pv.referrer ?? null, createdAt: pv.createdAt ? String(pv.createdAt) : undefined }))
    const clicksLog = analyticsStore.itemClicks.map(ic => ({ type: "itemClick" as const, itemId: String(ic.itemId), createdAt: ic.createdAt ? String(ic.createdAt) : undefined }))
    return [...viewsLog, ...clicksLog]
  })

  return {
    stats,
    totalViews,
    totalClicks,
    clickRate,
    joinedAt,
    pageViewsChartData,
    linkClicksChartData,
    iconClicksChartData,
    referrerChartData,
    normalizedRecords,
  }
}
