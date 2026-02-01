<template>
  <div class="h-64 w-full py-4">
    <Bar :data="props.chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions, InteractionModeMap } from "chart.js"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { Bar } from "vue-chartjs"

const props = defineProps<{
  chartData: ChartData<"bar", (number | [number, number] | null)[]>
}>()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as keyof InteractionModeMap,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
      },
      callbacks: {
        label(context: any) {
          return `Count: ${context.parsed.y}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
        maxRotation: 45,
        minRotation: 0,
      },
    },
    y: {
      beginAtZero: false,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 10,
        },
        precision: 0,
        padding: 8,
      },
    },
  },
  elements: {
    bar: {
      borderSkipped: false,
      backgroundColor: "de896d",
    },
  },
  animation: {
    duration: 750,
    easing: "easeInOutQuart",
  },
}
</script>
