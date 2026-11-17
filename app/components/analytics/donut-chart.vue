<template>
  <div class="flex min-h-52 w-full flex-1 flex-col md:min-h-64">
    <div class="relative min-h-0 flex-1">
      <div class="absolute inset-0">
        <Doughnut :data="props.chartData" :options="chartOptions" />
      </div>
    </div>

    <ul class="flex flex-wrap justify-center gap-x-3 gap-y-1.5 pt-3 md:gap-x-6 md:gap-y-2 md:pt-4">
      <li v-for="(label, index) in props.chartData.labels" :key="String(label)" class="flex max-w-full items-center gap-1.5 text-[11px] text-muted-foreground md:gap-2 md:text-sm">
        <span class="size-2 shrink-0 rounded-full md:size-2.5" :style="{ backgroundColor: sliceColor(index) }" />
        <span class="truncate">{{ label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Doughnut } from "vue-chartjs"

const props = defineProps<{ chartData: ChartData<"doughnut", number[]> }>()

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
      padding: 10,
      cornerRadius: 8,
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
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
