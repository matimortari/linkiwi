<template>
  <div class="flex min-h-64 w-full flex-1 flex-col">
    <div class="relative min-h-0 flex-1">
      <div class="absolute inset-0">
        <Doughnut :data="props.chartData" :options="chartOptions" />
      </div>
    </div>

    <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4">
      <li v-for="(label, index) in props.chartData.labels" :key="String(label)" class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: sliceColor(index) }" />
        <span>{{ label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Doughnut } from "vue-chartjs"

const props = defineProps<{
  chartData: ChartData<"doughnut", number[]>
}>()

ChartJS.register(ArcElement, Tooltip, Legend)

function sliceColor(index: number): string {
  const colors = props.chartData.datasets[0]?.backgroundColor
  if (Array.isArray(colors)) {
    return String(colors[index] ?? "#6366f1")
  }
  return typeof colors === "string" ? colors : "#6366f1"
}

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  elements: {
    arc: {
      borderWidth: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 13 },
      callbacks: {
        label(context) {
          const total = context.dataset.data.reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0)
          const value = typeof context.parsed === "number" ? context.parsed : 0
          const percentage = total ? ((value / total) * 100).toFixed(1) : "0"
          return `${context.label}: ${value} clicks (${percentage}%)`
        },
      },
    },
  },
  animation: { duration: 750, easing: "easeInOutQuart" },
}
</script>
