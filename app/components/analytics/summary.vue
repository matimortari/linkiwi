<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Highlights
    </h4>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:justify-items-center">
          <div v-for="item in summaryItems" :key="item.label" class="navigation-group">
            <icon :name="item.icon" size="30" class="text-caption-info shrink-0" />
            <div class="flex flex-col items-start">
              <p class="text-caption">
                {{ item.label }}
              </p>
              <span class="font-semibold md:text-lg">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 md:flex-row md:items-end">
          <div class="flex flex-row gap-2">
            <div class="flex flex-col gap-1">
              <label class="text-caption text-xs">From</label>
              <input
                v-model="fromDisplay" type="text"
                placeholder="yyyy/mm/dd" class="max-w-44 text-sm"
                :class="{ 'border-danger!': fromDisplay && !dateFrom }"
                @blur="fromDisplay = commitDate(fromDisplay, 'dateFrom')"
              >
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-caption text-xs">To</label>
              <input
                v-model="toDisplay" type="text"
                placeholder="yyyy/mm/dd" class="max-w-44 text-sm"
                :class="{ 'border-danger!': toDisplay && !dateTo }"
                @blur="toDisplay = commitDate(toDisplay, 'dateTo')"
              >
            </div>
          </div>

          <div class="navigation-group self-end">
            <button type="button" class="btn-ghost text-sm" :disabled="!dateFrom && !dateTo" @click="handleClearFilter">
              <icon name="mdi:filter-remove-outline" size="20" />
              <span>Reset</span>
            </button>
            <button type="button" class="btn-primary" @click="handleApplyFilter">
              <icon name="mdi:filter-outline" size="20" />
              <span>Apply</span>
            </button>
            <button class="btn-danger" title="Delete all analytics data" @click="handleDeleteAnalytics">
              <icon :name="resetAction.icon.value" size="20" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
        <h4>
          Page Views Over Time
        </h4>

        <Empty v-if="!pageViewsChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
        <AnalyticsLineChart v-else :chart-data="pageViewsChartData" />
      </div>

      <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
        <h4>
          Traffic Sources
        </h4>

        <Empty v-if="!topReferrers.length" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />

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
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
          <h4>
            Link Clicks
          </h4>

          <Empty v-if="!linkClicksChartData" message="Not enough data yet." icon-name="mdi:toy-brick-minus-outline" />
          <AnalyticsBarChart v-else :chart-data="linkClicksChartData" />
        </div>

        <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
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
const { totalViews, totalClicks, clickRate, joinedAt, pageViewsChartData, linkClicksChartData, iconClicksChartData, referrerChartData, topReferrers } = useAnalyticsData()
const resetAction = createActionHandler("mdi:trash-can-outline")
const dateFrom = ref("")
const dateTo = ref("")
const fromDisplay = ref("")
const toDisplay = ref("")

function parseDate(raw: string): string {
  const cleaned = raw.trim()
  if (!cleaned) {
    return ""
  }
  const match = cleaned.match(/^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})$/)
  if (!match) {
    return ""
  }

  const [, y, mo, d] = match
  const month = Number(mo)
  const day = Number(d)
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return ""
  }

  return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function toDisplayDate(internal: string): string {
  if (!internal) {
    return ""
  }

  const [y, m, d] = internal.split("-")
  return `${y}/${m}/${d}`
}

function commitDate(raw: string, field: "dateFrom" | "dateTo"): string {
  const parsed = parseDate(raw)
  if (field === "dateFrom") {
    dateFrom.value = parsed
  }
  else { dateTo.value = parsed }
  return parsed ? toDisplayDate(parsed) : raw
}

async function handleApplyFilter() {
  fromDisplay.value = commitDate(fromDisplay.value, "dateFrom")
  toDisplay.value = commitDate(toDisplay.value, "dateTo")
  await analyticsStore.getAnalytics(dateFrom.value || undefined, dateTo.value || undefined)
}

async function handleClearFilter() {
  dateFrom.value = ""
  dateTo.value = ""
  fromDisplay.value = ""
  toDisplay.value = ""
  await analyticsStore.getAnalytics()
}
const summaryItems = computed(() => [
  { label: "Total Page Views", icon: "mdi:file-eye-outline", value: totalViews.value },
  { label: "Total Clicks", icon: "mdi:cursor-default-click-outline", value: totalClicks.value },
  { label: "Click Rate", icon: "mdi:file-percent-outline", value: `${clickRate.value}%` },
  { label: "Joined On", icon: "mdi:calendar-clock-outline", value: joinedAt.value ? new Date(joinedAt.value).toLocaleDateString("en-US", { year: "2-digit", month: "short", day: "numeric" }) : "N/A" },
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
  await analyticsStore.getAnalytics(dateFrom.value || undefined, dateTo.value || undefined)
  resetAction.triggerSuccess()
}
</script>
