<template>
  <div class="card flex flex-col gap-2">
    <h3>
      Summary
    </h3>

    <div class="grid grid-cols-2 gap-4 border-b py-4 md:grid-cols-4 md:place-items-center">
      <div v-for="item in summaryItems" :key="item.label" class="navigation-group">
        <icon :name="item.icon" size="35" class="text-primary" />
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
      <h4>Page Views Over Time</h4>

      <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
      <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
    </div>

    <div class="py-4">
      <h4>
        Traffic Sources
      </h4>

      <Empty v-if="!analyticsStore.referrerStats?.referrers?.length" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />

      <div v-else class="mt-4">
        <AnalyticsBarChart v-if="referrerChartData" :chart-data="referrerChartData" />

        <div class="overflow-hidden rounded-2xl border">
          <table class="w-full">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-sm font-semibold">
                  Source
                </th>
                <th class="px-4 py-2 text-right text-sm font-semibold">
                  Views
                </th>
                <th class="px-4 py-2 text-right text-sm font-semibold">
                  Percentage
                </th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr v-for="stat in analyticsStore.referrerStats.referrers" :key="stat.source" class="hover:bg-muted">
                <td class="px-4 py-2 text-sm">
                  <div class="navigation-group">
                    <icon :name="getSourceIcon(stat.source)" size="20" />
                    <span>{{ stat.label }}</span>
                  </div>
                </td>
                <td class="px-4 py-2 text-right text-sm font-medium">
                  {{ stat.count }}
                </td>
                <td class="px-4 py-2 text-right text-sm">
                  <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {{ stat.percentage }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
      <div class="py-4">
        <h4>
          Link Clicks
        </h4>

        <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
      </div>

      <div class="py-4">
        <h4>
          Social Icon Clicks
        </h4>

        <Empty v-if="!iconClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsBarChart v-else :chart-data="iconClicksChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const analyticsStore = useAnalyticsStore()
const userStore = useUserStore()
const { totalViews, totalClicks, clickRate, joinedAt, pageViewsChartData, linkClicksChartData, iconClicksChartData, referrerChartData } = useAnalyticsData()

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
    value: joinedAt.value ? formatDate(new Date(joinedAt.value)) : "N/A",
  },
])

function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    direct: "mdi:link-variant",
    google: "mdi:google",
    facebook: "mdi:facebook",
    twitter: "mdi:twitter",
    instagram: "mdi:instagram",
    linkedin: "mdi:linkedin",
    reddit: "mdi:reddit",
    tiktok: "simple-icons:tiktok",
    youtube: "mdi:youtube",
    pinterest: "mdi:pinterest",
    github: "mdi:github",
    discord: "mdi:discord",
    threads: "simple-icons:threads",
    bluesky: "simple-icons:bluesky",
    internal: "mdi:home",
    external: "mdi:web",
    unknown: "mdi:help-circle",
  }

  return icons[source] || "mdi:web"
}

onMounted(async () => {
  await Promise.all([
    analyticsStore.getAnalytics(),
    analyticsStore.getReferrerStats(),
    userStore.getUser(),
  ])
})
</script>
