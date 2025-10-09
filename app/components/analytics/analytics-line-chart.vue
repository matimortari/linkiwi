<template>
  <div class="h-64 w-full">
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
  },
}
</script>
