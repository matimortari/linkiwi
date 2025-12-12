<template>
  <div class="card flex flex-col gap-4">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        Analytics Summary
      </h3>
      <p class="text-caption">
        View your analytics data at a glance.
      </p>
    </header>

    <div class="grid grid-cols-2 gap-4 border-b py-4 md:grid-cols-4 md:place-items-center">
      <div v-for="item in summaryItems" :key="item.label" class="navigation-group">
        <icon :name="item.icon" size="30" class="text-primary" />
        <div class="flex flex-col items-start">
          <p class="text-caption">
            {{ item.label }}
          </p>
          <p class="font-semibold md:text-lg">
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>

    <div class="py-4">
      <h4>
        Page Views Over Time
      </h4>

      <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
      <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
    </div>

    <div class="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
      <div class="py-4">
        <h4>
          Link Clicks
        </h4>

        <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
        <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
      </div>

      <div class="py-4">
        <h4>
          Social Icon Clicks
        </h4>

        <Empty v-if="!iconClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
        <AnalyticsBarChart v-else :chart-data="iconClicksChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsRecordSchema } from "#shared/schemas/analytics-schema"

const analyticsStore = useAnalyticsStore()
const userStore = useUserStore()
const analyticsData = ref<AnalyticsRecordSchema[]>([])
const totalViews = computed(() => analyticsStore.analytics?.pageViews.length)
const totalClicks = computed(() => analyticsStore.analytics?.linkClicks.length + analyticsStore.analytics?.iconClicks.length)
const clickRate = computed(() => totalViews.value ? ((Number(totalClicks.value) / Number(totalViews.value)) * 100).toFixed(2) : 0)
const createdAt = computed(() => userStore.user?.createdAt)

function groupByDate<T extends Record<string, any>>(items: T[], dateKey: keyof T = "date"): Record<string, number> {
  const result: Record<string, number> = {}
  for (const item of items) {
    const itemDate = item[dateKey]
    if (!itemDate) {
      continue
    }

    const dateObj = new Date(itemDate as string | Date)
    if (Number.isNaN(dateObj.getTime())) {
      continue
    }

    const dateStr = dateObj.toISOString().split("T")[0] as string
    result[dateStr] = (result[dateStr] ?? 0) + 1
  }

  return result
}

const stats = computed(() => {
  const pageViews = analyticsStore.analytics?.pageViews ?? []
  const linkClicks = analyticsStore.analytics?.linkClicks ?? []
  const iconClicks = analyticsStore.analytics?.iconClicks ?? []

  const viewsByDate = groupByDate(pageViews, "date")
  const linkClicksByDate = groupByDate(linkClicks, "date")
  const iconClicksByDate = groupByDate(iconClicks, "date")

  const allDates = Array.from(new Set([...Object.keys(viewsByDate), ...Object.keys(linkClicksByDate), ...Object.keys(iconClicksByDate)])).sort()

  return allDates.map(date => ({
    date,
    pageViews: viewsByDate[date] ?? 0,
    linkClicks: linkClicksByDate[date] ?? 0,
    iconClicks: iconClicksByDate[date] ?? 0,
  }))
})

const summaryItems = computed(() => [
  {
    label: "Total Page Views",
    icon: "material-symbols:table-eye",
    value: totalViews.value,
  },
  {
    label: "Total Clicks",
    icon: "material-symbols:ads-click",
    value: totalClicks.value,
  },
  {
    label: "Click Rate",
    icon: "material-symbols:percent",
    value: `${clickRate.value}%`,
  },
  {
    label: "Joined On",
    icon: "material-symbols:calendar-month",
    value: createdAt.value ? formatDate(new Date(createdAt.value)) : "N/A",
  },
])

const pageViewsChartData = computed(() => {
  if (!stats.value.length) {
    return null
  }

  const values = stats.value.map(s => s.pageViews)
  if (!values.some(v => v > 0)) {
    return null
  }

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Page Views", data: values, backgroundColor: "#63abb5" }],
  }
})

const linkClicksChartData = computed(() => {
  if (!stats.value.length) {
    return null
  }

  const values = stats.value.map(s => s.linkClicks)
  if (!values.some(v => v > 0)) {
    return null
  }

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Link Clicks", data: values, backgroundColor: "#63abb5" }],
  }
})

const iconClicksChartData = computed(() => {
  if (!stats.value.length) {
    return null
  }

  const values = stats.value.map(s => s.iconClicks)
  if (!values.some(v => v > 0)) {
    return null
  }

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Social Icon Clicks", data: values, backgroundColor: "#63abb5" }],
  }
})

onMounted(async () => {
  await Promise.all([
    analyticsStore.getAnalytics(),
    userStore.getUser(),
  ])

  const res = analyticsStore.analytics
  analyticsData.value = [
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
</script>
