export function useAnalyticsData() {
  const analyticsStore = useAnalyticsStore()
  const userStore = useUserStore()

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

  const stats = computed(() => analyticsStore.summary.stats)
  const totalViews = computed(() => analyticsStore.summary.totalViews)
  const totalClicks = computed(() => analyticsStore.summary.totalClicks)
  const clickRate = computed(() => totalViews.value ? ((totalClicks.value / totalViews.value) * 100).toFixed(2) : "0")
  const joinedAt = computed(() => userStore.user?.createdAt)
  const linkClicksByDate = computed(() => Object.fromEntries(stats.value.filter(row => row.linkClicks > 0).map(row => [row.date, row.linkClicks])))
  const iconClicksByDate = computed(() => Object.fromEntries(stats.value.filter(row => row.iconClicks > 0).map(row => [row.date, row.iconClicks])))
  const pageViewsChartData = computed(() => stats.value.length ? buildChart(stats.value.map(s => s.pageViews), stats.value.map(s => s.date), "Page Views") : null)
  const linkClicksChartData = computed(() => buildChartFromGroupedCounts(linkClicksByDate.value, "Link Clicks"))
  const iconClicksChartData = computed(() => buildChartFromGroupedCounts(iconClicksByDate.value, "Social Icon Clicks"))

  const clicksPerLinkChartData = computed(() => {
    const entries = analyticsStore.summary.clicksPerLink.filter(entry => entry.count > 0)
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

  const topReferrers = computed(() => analyticsStore.summary.topReferrers.map(row => ({ ...row, label: formatSourceLabel(row.source) })))

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
