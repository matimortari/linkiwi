<template>
  <div class="relative min-h-52 w-full flex-1 md:min-h-64">
    <div class="absolute inset-0 py-2 md:py-4">
      <Line :data="props.chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions, Point } from "chart.js"
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import { Line } from "vue-chartjs"

const props = defineProps<{ chartData: ChartData<"line", (number | Point | null)[]> }>()

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: "index" },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 10,
      cornerRadius: 8,
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
      callbacks: {
        label(context: any) {
          return `Views: ${context.parsed.y}`
        },
      },
    },
  },
  elements: {
    line: { borderWidth: 2, borderColor: "#6366f1", fill: false },
    point: { radius: 3, hoverRadius: 6, backgroundColor: "#6366f1", borderColor: "#6366f1", hoverBorderWidth: 2 },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 6 },
    },
    y: {
      beginAtZero: false,
      ticks: { font: { size: 9 }, precision: 0, padding: 6, maxTicksLimit: 6 },
    },
  },
  animation: { duration: 750, easing: "easeInOutQuart" },
}
</script>
