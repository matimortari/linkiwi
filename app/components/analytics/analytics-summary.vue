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
      <div class="navigation-group">
        <icon name="material-symbols:table-eye" size="30" class="text-primary" />
        <div class="flex flex-col items-start">
          <p class="text-caption">
            Total Page Views
          </p>
          <p class="font-semibold md:text-lg">
            {{ totalViews }}
          </p>
        </div>
      </div>

      <div class="navigation-group">
        <icon name="material-symbols:ads-click" size="30" class="text-primary" />
        <div class="flex flex-col items-start">
          <p class="text-caption">
            Total Clicks
          </p>
          <p class="font-semibold md:text-lg">
            {{ totalClicks }}
          </p>
        </div>
      </div>

      <div class="navigation-group">
        <icon name="material-symbols:percent" size="30" class="text-primary" />
        <div class="flex flex-col items-start">
          <p class="text-caption">
            Click Rate
          </p>
          <p class="font-semibold md:text-lg">
            {{ clickRate }}%
          </p>
        </div>
      </div>

      <div class="navigation-group">
        <icon name="material-symbols:calendar-month" size="30" class="text-primary" />
        <div class="flex flex-col items-start">
          <p class="text-caption">
            Joined On
          </p>
          <p class="font-semibold md:text-lg">
            {{ createdAt ? formatDate(new Date(createdAt)) : "N/A" }}
          </p>
        </div>
      </div>
    </div>

    <div class="py-4">
      <h4>
        Page Views Over Time
      </h4>

      <AnalyticsLineChart v-if="pageViewsChartData" :chart-data="pageViewsChartData" />
      <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
    </div>

    <div class="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
      <div class="py-4">
        <h4>
          Link Clicks
        </h4>

        <AnalyticsBarChart v-if="linkClicksChartData" :chart-data="linkClicksChartData" />
        <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
      </div>

      <div class="py-4">
        <h4>
          Social Icon Clicks
        </h4>

        <AnalyticsBarChart v-if="iconClicksChartData" :chart-data="iconClicksChartData" />
        <Empty v-if="!iconClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" :icon-size="30" />
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

function groupByDate<T extends { createdAt?: string | Date }>(items: T[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const item of items) {
    if (!item.createdAt)
      continue

    const dateObj = new Date(item.createdAt)
    if (!Number.isNaN(dateObj.getTime())) {
      const iso = dateObj.toISOString()
      const dateStr = (iso.split("T")[0] ?? iso)
      result[dateStr] = (result[dateStr] ?? 0) + 1
    }
  }

  return result
}

const stats = computed(() => {
  const pageViews = analyticsStore.analytics?.pageViews ?? []
  const linkClicks = analyticsStore.analytics?.linkClicks ?? []
  const iconClicks = analyticsStore.analytics?.iconClicks ?? []

  const viewsByDate = groupByDate(pageViews)
  const linkClicksByDate = groupByDate(linkClicks)
  const iconClicksByDate = groupByDate(iconClicks)

  const allDates = Array.from(new Set([...Object.keys(viewsByDate), ...Object.keys(linkClicksByDate), ...Object.keys(iconClicksByDate)])).sort()
  return allDates.map(date => ({
    date,
    pageViews: viewsByDate[date] ?? 0,
    linkClicks: linkClicksByDate[date] ?? 0,
    iconClicks: iconClicksByDate[date] ?? 0,
  }))
})

const pageViewsChartData = computed(() => {
  if (!stats.value.length)
    return null

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Page Views", data: stats.value.map(s => s.pageViews), backgroundColor: "#63abb5" }],
  }
})

const linkClicksChartData = computed(() => {
  if (!stats.value.length)
    return null

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Link Clicks", data: stats.value.map(s => s.linkClicks), backgroundColor: "#63abb5" }],
  }
})

const iconClicksChartData = computed(() => {
  if (!stats.value.length)
    return null

  return {
    labels: stats.value.map(s => s.date),
    datasets: [{ label: "Social Icon Clicks", data: stats.value.map(s => s.iconClicks), backgroundColor: "#63abb5" }],
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
