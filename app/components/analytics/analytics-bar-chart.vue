<template>
  <div class="h-64 w-full py-4">
    <Bar :data="props.chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData } from "chart.js"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { Bar } from "vue-chartjs"

const props = defineProps<{
  chartData: ChartData<"bar", (number | [number, number] | null)[]>
}>()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: { display: false },
  },
}
</script>
