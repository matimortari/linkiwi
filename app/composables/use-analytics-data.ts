import type { AnalyticsRecordSchema } from "#shared/schemas/analytics-schema"

export function useAnalyticsData() {
  const analyticsStore = useAnalyticsStore()
  const userStore = useUserStore()

  function groupByDate<T extends Record<string, any>>(items: T[], dateKey: keyof T & string = "createdAt"): Record<string, number> {
    const result: Record<string, number> = {}
    for (const item of items) {
      const raw = item[dateKey]
      const date = new Date(raw as string | Date)
      if (Number.isNaN(date.getTime())) {
        continue
      }
      const key = date.toISOString().split("T")[0]
      if (typeof key === "string" && key) {
        result[key] = (result[key] ?? 0) + 1
      }
    }

    return result
  }

  // Core analytics computations
  const pageViews = computed(() => analyticsStore.analytics?.pageViews ?? [])
  const linkClicks = computed(() => analyticsStore.analytics?.linkClicks ?? [])
  const iconClicks = computed(() => analyticsStore.analytics?.iconClicks ?? [])

  const stats = computed(() => {
    const viewsByDate = groupByDate(pageViews.value, "createdAt")
    const linksByDate = groupByDate(linkClicks.value, "createdAt")
    const iconsByDate = groupByDate(iconClicks.value, "createdAt")
    const allDates = Array.from(new Set([...Object.keys(viewsByDate), ...Object.keys(linksByDate), ...Object.keys(iconsByDate)])).sort()

    return allDates.map(date => ({
      date,
      pageViews: viewsByDate[date] ?? 0,
      linkClicks: linksByDate[date] ?? 0,
      iconClicks: iconsByDate[date] ?? 0,
    }))
  })

  // Metrics
  const totalViews = computed(() => pageViews.value.length)
  const totalClicks = computed(() => linkClicks.value.length + iconClicks.value.length)
  const clickRate = computed(() => totalViews.value ? ((totalClicks.value / totalViews.value) * 100).toFixed(2) : "0")
  const joinedAt = computed(() => userStore.user?.createdAt)

  // Chart data
  function buildChart(values: number[], labels: string[], label: string) {
    if (!values.some(v => v > 0)) {
      return null
    }

    return {
      labels,
      datasets: [{ label, data: values, backgroundColor: "#de896d" }],
    }
  }

  const pageViewsChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.pageViews), stats.value.map(s => s.date), "Page Views") : null)
  const linkClicksChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.linkClicks), stats.value.map(s => s.date), "Link Clicks") : null)
  const iconClicksChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.iconClicks), stats.value.map(s => s.date), "Social Icon Clicks") : null)

  const referrerChartData = computed(() => {
    const referrers = analyticsStore.referrerStats?.referrers
    if (!referrers?.length) {
      return null
    }

    return {
      labels: referrers.map((r: any) => r.label),
      datasets: [
        {
          label: "Traffic Sources",
          data: referrers.map((r: any) => r.count),
          backgroundColor: [
            "#de896d",
            "#4299e1",
            "#48bb78",
            "#ed8936",
            "#9f7aea",
            "#f56565",
            "#38b2ac",
            "#ecc94b",
          ],
        },
      ],
    }
  })

  const normalizedRecords = computed<AnalyticsRecordSchema[]>(() => {
    const res = analyticsStore.analytics

    return [
      ...(res?.pageViews?.map((pv: any) => ({
        type: "pageView" as const,
        userId: String(pv.userId),
        createdAt: pv.createdAt ? String(pv.createdAt) : undefined,
      })) ?? []),
      ...(res?.linkClicks?.map((lc: any) => ({
        type: "link" as const,
        userId: String(lc.userId),
        id: lc.id ? String(lc.id) : undefined,
        createdAt: lc.createdAt ? String(lc.createdAt) : undefined,
      })) ?? []),
      ...(res?.iconClicks?.map((ic: any) => ({
        type: "icon" as const,
        userId: String(ic.userId),
        id: ic.id ? String(ic.id) : undefined,
        createdAt: ic.createdAt ? String(ic.createdAt) : undefined,
      })) ?? []),
    ]
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
