export function useAnalyticsData() {
  const analyticsStore = useAnalyticsStore()
  const userStore = useUserStore()
  const profileItemsStore = useProfileItemsStore()

  const CHART_COLORS = ["#4a69b9", "#709775", "#d88c76", "#8b7d9b", "#cf9e55", "#5b9b9b", "#b87a84", "#768493"]

  // Helper function to format referrer source label
  function formatSourceLabel(source: string | null | undefined): string {
    if (!source || typeof source !== "string" || source.trim() === "") {
      return "Unknown"
    }

    const labels: Record<string, string> = {
      direct: "Direct",
      facebook: "Facebook",
      twitter: "Twitter/X",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      reddit: "Reddit",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      discord: "Discord",
      mastodon: "Mastodon",
      bluesky: "Bluesky",
      google: "Google",
      bing: "Bing",
      yahoo: "Yahoo",
      duckduckgo: "DuckDuckGo",
      yandex: "Yandex",
      slack: "Slack",
      teams: "Microsoft Teams",
      github: "GitHub",
      gitlab: "GitLab",
      medium: "Medium",
      substack: "Substack",
      email: "Email",
      newsletter: "Newsletter",
      unknown: "Unknown",
    }

    return labels[source] || source.charAt(0).toUpperCase() + source.slice(1)
  }

  // Helper function to bucket records by calendar date
  function groupByDate<T extends Record<string, any>>(items: T[], dateKey: string): Record<string, number> {
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

  // Chart data builder
  function buildChart(values: number[], labels: string[], label: string) {
    if (!values.some(v => v > 0)) {
      return null
    }
    return { labels, datasets: [{ label, data: values, backgroundColor: "#6366f1" }] }
  }

  function buildChartFromGroupedCounts(countsByDate: Record<string, number>, label: string) {
    const dates = Object.keys(countsByDate).sort((a, b) => a.localeCompare(b))
    if (!dates.length) {
      return null
    }
    return buildChart(dates.map(date => countsByDate[date] ?? 0), dates, label)
  }

  const pageViews = computed(() => analyticsStore.pageViews)
  const linkClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "LINK"))
  const iconClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "ICON"))
  const widgetClicks = computed(() => analyticsStore.itemClicks.filter(c => c.item?.type === "WIDGET"))
  const linkClicksByDate = computed(() => groupByDate(linkClicks.value, "createdAt"))
  const iconClicksByDate = computed(() => groupByDate(iconClicks.value, "createdAt"))

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

  const pageViewsChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.pageViews), stats.value.map(s => s.date), "Page Views") : null)
  const linkClicksChartData = computed(() => buildChartFromGroupedCounts(linkClicksByDate.value, "Link Clicks"))
  const iconClicksChartData = computed(() => buildChartFromGroupedCounts(iconClicksByDate.value, "Social Icon Clicks"))

  const clicksPerLinkChartData = computed(() => {
    const counts: Record<string, number> = {}
    for (const click of linkClicks.value) {
      if (click.itemId) {
        counts[click.itemId] = (counts[click.itemId] ?? 0) + 1
      }
    }

    const entries = (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "LINK" && item.link).map((item: ProfileItem) => ({
      label: item.link!.label,
      count: counts[item.id] ?? 0,
    })).filter(entry => entry.count > 0).sort((a, b) => b.count - a.count)

    if (!entries.length) {
      return null
    }

    return {
      labels: entries.map(entry => entry.label),
      datasets: [{
        label: "Clicks",
        data: entries.map(entry => entry.count),
        backgroundColor: entries.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]),
      }],
    }
  })

  const topReferrers = computed(() => {
    if (!pageViews.value.length) {
      return []
    }

    const counts: Record<string, number> = {}
    pageViews.value.forEach((pv) => {
      const rawSource = pv.referrer || pv.source || "direct"
      let cleanKey = rawSource.toLowerCase().trim()
      if (cleanKey.includes("://") || cleanKey.includes(".")) {
        cleanKey = cleanKey.replace(/https?:\/\/(www\.)?/, "").split(".")[0] || "unknown"
      }

      // Map domains to friendly labels
      if (cleanKey === "youtu") {
        cleanKey = "youtube"
      }
      if (cleanKey === "lnkd") {
        cleanKey = "linkedin"
      }
      if (cleanKey === "fb") {
        cleanKey = "facebook"
      }

      counts[cleanKey] = (counts[cleanKey] ?? 0) + 1
    })

    return Object.entries(counts).map(([key, count]) => ({
      source: key,
      label: formatSourceLabel(key),
      count,
      percentage: ((count / pageViews.value.length) * 100).toFixed(1),
    })).sort((a, b) => b.count - a.count).slice(0, 6)
  })

  const referrerChartData = computed(() => {
    if (!topReferrers.value.length) {
      return null
    }
    return {
      labels: topReferrers.value.map(r => r.label),
      datasets: [
        {
          label: "Traffic Sources",
          data: topReferrers.value.map(r => r.count),
          backgroundColor: topReferrers.value.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]),
        },
      ],
    }
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
    clicksPerLinkChartData,
    topReferrers,
    referrerChartData,
  }
}
