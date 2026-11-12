<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-stretch">
      <div class="card flex flex-col gap-4 md:col-span-3">
        <h4>
          Page Views Over Time
        </h4>

        <Empty v-if="!pageViewsChartData" class="min-h-64 flex-1" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
      </div>

      <div class="card flex flex-col gap-4 md:col-span-1">
        <h4>
          Clicks by Link
        </h4>

        <Empty v-if="!clicksPerLinkChartData" class="min-h-64 flex-1" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsDonutChart v-else :chart-data="clicksPerLinkChartData" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
      <div class="card flex flex-col gap-4 md:col-span-2">
        <h4>
          Traffic Sources
        </h4>

        <div class="flex min-h-0 flex-1 flex-col gap-4">
          <AnalyticsBarChart v-if="referrerChartData" :chart-data="referrerChartData" />

          <div class="scroll-area card min-h-0 flex-1 overflow-y-auto p-0!">
            <table class="referrer-table w-full">
              <thead class="sticky top-0 z-10 bg-muted text-sm font-semibold">
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
                <tr v-if="!topReferrers.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-muted-foreground">
                    Not enough data yet.
                  </td>
                </tr>
                <template v-else>
                  <tr v-for="stat in topReferrers" :key="stat.source">
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
            </table>
          </div>
        </div>
      </div>

      <div class="flex h-full min-h-0 flex-col gap-4 md:col-span-1">
        <div class="card flex min-h-0 flex-1 flex-col gap-4">
          <h4>
            Total Link Clicks
          </h4>

          <Empty v-if="!linkClicksChartData" class="min-h-64 flex-1" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
        </div>

        <div class="card flex min-h-0 flex-1 flex-col gap-4">
          <h4>
            Total Social Icon Clicks
          </h4>

          <Empty v-if="!iconClicksChartData" class="min-h-64 flex-1" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="iconClicksChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
