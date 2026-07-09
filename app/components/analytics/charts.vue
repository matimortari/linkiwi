<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:col-span-3">
        <h4>
          Page Views Over Time
        </h4>

        <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
      </div>

      <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:col-span-1">
        <h4>
          Clicks per Link
        </h4>

        <Empty v-if="!clicksPerLinkChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsDonutChart v-else :chart-data="clicksPerLinkChartData" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
      <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:col-span-2">
        <h4>
          Traffic Sources
        </h4>

        <div class="flex min-h-0 flex-1 flex-col gap-4">
          <AnalyticsBarChart v-if="referrerChartData" :chart-data="referrerChartData" />

          <div class="card flex min-h-48 flex-1 flex-col overflow-hidden p-0! md:min-h-0">
            <table class="referrer-table size-full">
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

              <tbody class="divide-y [&>tr:last-child]:border-b">
                <tr v-if="!topReferrers.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-muted-foreground">
                    Not enough data yet.
                  </td>
                </tr>
                <template v-else>
                  <tr v-for="stat in topReferrers" :key="stat.source" class="hover:bg-muted/20">
                    <td class="px-4 py-2 text-sm">
                      <div class="navigation-group">
                        <div class="rounded-full bg-muted p-1">
                          <icon :name="getSourceIcon(stat.source)" size="20" />
                        </div>
                        <span class="font-semibold">{{ stat.label }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-2 text-right text-sm font-medium">
                      {{ stat.count }}
                    </td>
                    <td class="px-4 py-2 text-right text-sm">
                      <span class="text-caption-info inline-flex items-center rounded-full border bg-primary/20 px-2 py-1 text-xs font-medium">{{ stat.percentage }}%</span>
                    </td>
                  </tr>
                </template>
              </tbody>

              <tfoot v-if="topReferrers.length" class="h-full">
                <tr class="h-full">
                  <td colspan="3" class="h-full p-0" aria-hidden="true" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 md:col-span-1">
        <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4">
          <h4>
            Link Clicks
          </h4>

          <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
        </div>

        <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4">
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
const profileItemsStore = useProfileItemsStore()
const { pageViewsChartData, linkClicksChartData, iconClicksChartData, clicksPerLinkChartData, referrerChartData, topReferrers } = useAnalyticsData()

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

onMounted(async () => {
  if (!profileItemsStore.items.length) {
    await profileItemsStore.getItems()
  }
})
</script>

<style scoped>
.referrer-table {
  border-collapse: collapse;
  table-layout: fixed;
}

.referrer-table tbody {
  vertical-align: top;
}
</style>
