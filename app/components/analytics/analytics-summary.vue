<template>
  <div class="card flex flex-col gap-4">
    <h3>
      Summary
    </h3>

    <div class="flex flex-col gap-2">
      <div class="flex flex-col justify-between gap-2 p-2 pt-0 md:flex-row">
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:justify-items-center">
          <div v-for="item in summaryItems" :key="item.label" class="navigation-group">
            <icon :name="item.icon" size="30" class="shrink-0 text-primary" />
            <div class="flex flex-col items-start">
              <p class="text-caption">
                {{ item.label }}
              </p>
              <span class="font-semibold md:text-lg">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <button class="btn-danger self-end" @click="handleDeleteAnalytics">
          <icon :name="resetAction.icon.value" size="20" />
          <span>Reset</span>
        </button>
      </div>

      <div class="card flex flex-col gap-2">
        <h4>
          Page Views Over Time
        </h4>

        <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
      </div>

      <div class="card flex flex-col gap-2">
        <h4>
          Traffic Sources
        </h4>

        <Empty v-if="!referrerStats.length" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />

        <div v-else>
          <AnalyticsBarChart v-if="referrerChartData" :chart-data="referrerChartData" />

          <div class="card overflow-hidden p-0!">
            <table class="w-full">
              <thead class="bg-muted text-sm font-semibold">
                <tr>
                  <th class="px-4 py-2 text-left">
                    Source
                  </th>
                  <th class="px-4 py-2 text-right">
                    Views
                  </th>
                  <th class="px-4 py-2 text-right">
                    Percentage
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <tr v-for="stat in referrerStats" :key="stat.source" class="hover:bg-muted/20">
                  <td class="px-4 py-2 text-sm">
                    <div class="navigation-group">
                      <div class="rounded-full bg-muted p-1">
                        <icon :name="getSourceIcon(stat.source)" size="18" />
                      </div>
                      <span class="font-semibold">{{ stat.label }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-2 text-right text-sm font-medium">
                    {{ stat.count }}
                  </td>
                  <td class="px-4 py-2 text-right text-sm">
                    <span class="inline-flex items-center rounded-full border bg-primary/20 px-2 py-1 text-xs font-medium text-primary">{{ stat.percentage }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div class="card flex flex-col gap-2">
          <h4>
            Link Clicks
          </h4>

          <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
        </div>

        <div class="card flex flex-col gap-2">
          <h4>
            Social Icon Clicks
          </h4>

          <Empty v-if="!iconClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="iconClicksChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const analyticsStore = useAnalyticsStore()
const userStore = useUserStore()
const { totalViews, totalClicks, clickRate, joinedAt, pageViewsChartData, linkClicksChartData, iconClicksChartData, referrerChartData } = useAnalyticsData()
const referrerStats = computed(() => analyticsStore.referrerStats?.referrers || [])

const resetAction = createActionHandler("mdi:close")

const summaryItems = computed(() => [
  {
    label: "Total Page Views",
    icon: "mdi:file-eye-outline",
    value: totalViews.value,
  },
  {
    label: "Total Clicks",
    icon: "mdi:cursor-default-click-outline",
    value: totalClicks.value,
  },
  {
    label: "Click Rate",
    icon: "mdi:file-percent-outline",
    value: `${clickRate.value}%`,
  },
  {
    label: "Joined On",
    icon: "mdi:calendar-clock-outline",
    value: joinedAt.value ? formatDate(new Date(joinedAt.value)) : "N/A",
  },
])

function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    direct: "mdi:link-variant",
    google: "simple-icons:google",
    facebook: "simple-icons:facebook",
    twitter: "simple-icons:x",
    instagram: "simple-icons:instagram",
    linkedin: "simple-icons:linkedin",
    reddit: "simple-icons:reddit",
    tiktok: "simple-icons:tiktok",
    youtube: "simple-icons:youtube",
    pinterest: "simple-icons:pinterest",
    github: "simple-icons:github",
    discord: "simple-icons:discord",
    bluesky: "simple-icons:bluesky",
    internal: "mdi:home",
    external: "mdi:web",
    unknown: "mdi:help-circle",
  }

  return icons[source] || "mdi:web"
}

async function handleDeleteAnalytics() {
  const confirmed = confirm("Are you sure you want to reset all analytics data? This action cannot be undone.")
  if (!confirmed) {
    return
  }

  await analyticsStore.deleteAnalytics()
  await Promise.all([
    analyticsStore.getAnalytics(),
    analyticsStore.getReferrerStats(),
  ])

  resetAction.triggerSuccess()
}

onMounted(async () => {
  await Promise.all([
    analyticsStore.getAnalytics(),
    analyticsStore.getReferrerStats(),
    userStore.getUser(),
  ])
})
</script>
