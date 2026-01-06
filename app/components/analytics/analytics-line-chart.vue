<template>
  <div class="h-64 w-full py-4">
    <Line :data="props.chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions, Point } from "chart.js"
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import { Line } from "vue-chartjs"

const props = defineProps<{
  chartData: ChartData<"line", (number | Point | null)[]>
}>()

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as const,
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
          return `Views: ${context.parsed.y}`
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      borderColor: "#de896d",
      fill: false,
    },
    point: {
      radius: 4,
      hoverRadius: 8,
      backgroundColor: "#de896d",
      borderColor: "#e5e7eb",
      hoverBorderWidth: 2,
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
      ticks: {
        font: {
          size: 10,
        },
        precision: 0,
        padding: 8,
      },
    },
  },
  animation: {
    duration: 750,
    easing: "easeInOutQuart",
  },
}
</script>
