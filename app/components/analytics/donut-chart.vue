<template>
  <div class="h-64 w-full py-4">
    <Doughnut :data="props.chartData" :options="chartOptions" />
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

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
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
          return `${value} clicks (${percentage}%)`
        },
      },
    },
  },
  animation: { duration: 750, easing: "easeInOutQuart" },
}
</script>
