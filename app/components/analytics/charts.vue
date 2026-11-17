<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-stretch">
      <div class="card flex flex-col gap-4 md:col-span-3">
        <h4>
          Page Views Over Time
        </h4>

        <Empty v-if="!pageViewsChartData" class="min-h-52 flex-1 md:min-h-64" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
      </div>

      <div class="card flex flex-col gap-4 md:col-span-1">
        <h4>
          Clicks by Link
        </h4>

        <Empty v-if="!clicksPerLinkChartData" class="min-h-52 flex-1 md:min-h-64" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
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

          <div class="scroll-area card min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-0!">
            <table class="referrer-table w-full">
              <thead class="sticky top-0 z-10 text-xs font-semibold md:text-sm">
                <tr>
                  <th class="bg-muted p-2 text-left md:px-4">
                    Source
                  </th>
                  <th class="bg-muted p-2 text-right md:px-4">
                    Views
                  </th>
                  <th class="bg-muted p-2 text-right md:px-4">
                    Percentage
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <tr v-if="!topReferrers.length">
                  <td colspan="3" class="px-2 py-8 text-center text-xs text-muted-foreground md:px-4 md:text-sm">
                    Not enough data yet.
                  </td>
                </tr>
                <template v-else>
                  <tr v-for="stat in topReferrers" :key="stat.source">
                    <td class="p-2 text-xs md:px-4 md:text-sm">
                      <div class="navigation-group">
                        <div class="rounded-full bg-muted p-1">
                          <icon :name="getSourceIcon(stat.source)" size="15" />
                        </div>
                        <span class="font-semibold">{{ stat.label }}</span>
                      </div>
                    </td>
                    <td class="p-2 text-right text-xs font-medium md:px-4">
                      {{ stat.count }}
                    </td>
                    <td class="p-2 text-right text-xs md:px-4 md:text-sm">
                      <span class="text-caption-info inline-flex items-center rounded-full border bg-primary/20 p-1 text-xs!">{{ stat.percentage }}%</span>
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

          <Empty v-if="!linkClicksChartData" class="min-h-52 flex-1 md:min-h-64" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
        </div>

        <div class="card flex min-h-0 flex-1 flex-col gap-4">
          <h4>
            Total Social Icon Clicks
          </h4>

          <Empty v-if="!iconClicksChartData" class="min-h-52 flex-1 md:min-h-64" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
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
  width: 100%;
}

.referrer-table th:nth-child(1),
.referrer-table td:nth-child(1) {
  width: 48%;
}

.referrer-table th:nth-child(2),
.referrer-table td:nth-child(2) {
  width: 22%;
}

.referrer-table th:nth-child(3),
.referrer-table td:nth-child(3) {
  width: 30%;
}

.referrer-table tbody {
  vertical-align: top;
}
</style>
