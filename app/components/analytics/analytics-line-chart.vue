<template>
  <div class="h-64 w-full py-4">
    <Line :data="props.chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData, Point } from "chart.js"
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import { Line } from "vue-chartjs"

const props = defineProps<{
  chartData: ChartData<"line", (number | Point | null)[]>
}>()

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  elements: {
    line: {
      borderWidth: 2,
      borderColor: "#de896d",
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}
</script>
