<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div class="flex flex-col gap-2 md:flex-row md:items-end">
        <div class="flex flex-row gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-caption text-xs">Date: From</label>
            <input
              v-model="fromDisplay" v-maska="'####/##/##'"
              type="text" placeholder="yyyy/mm/dd"
              class="max-w-32 text-sm md:max-w-44" :class="{ 'border-danger!': fromDisplay && !dateFrom }"
              @blur="fromDisplay = commitDate(fromDisplay, 'dateFrom')"
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-caption text-xs">Date: To</label>
            <input
              v-model="toDisplay" v-maska="'####/##/##'"
              type="text" placeholder="yyyy/mm/dd"
              class="max-w-32 text-sm md:max-w-44" :class="{ 'border-danger!': toDisplay && !dateTo }"
              @blur="toDisplay = commitDate(toDisplay, 'dateTo')"
            >
          </div>
        </div>

        <div class="navigation-group">
          <button type="button" class="btn" @click="handleApplyFilter">
            <icon name="mdi:filter-outline" size="20" />
            <span>Apply</span>
          </button>
          <button type="button" class="btn-ghost" :disabled="!dateFrom && !dateTo" @click="handleClearFilter">
            <icon name="mdi:filter-remove-outline" size="20" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      <button class="btn-danger self-end md:self-start" @click="handleDeleteAnalytics">
        <icon :name="resetAction.icon.value" size="20" />
        <span>Reset Analytics</span>
      </button>
    </div>

    <div class="card flex flex-col gap-4">
      <h4>
        Highlights
      </h4>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div v-for="item in summaryItems" :key="item.label" class="flex size-full flex-row items-start justify-start gap-4 p-2">
          <icon :name="item.icon" size="35" class="text-caption-info shrink-0" />
          <div class="flex min-w-0 flex-1 flex-col items-start">
            <p class="text-caption line-clamp-2">
              {{ item.label }}
            </p>
            <span class="font-semibold md:text-lg">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from "maska/vue"

const { createActionHandler } = useActionIcon()
const analyticsStore = useAnalyticsStore()
const { totalViews, totalClicks, clickRate, joinedAt } = useAnalyticsData()
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
