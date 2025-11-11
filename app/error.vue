<template>
  <div class="container mx-auto grid min-h-screen grid-cols-1 items-center gap-6 p-24 md:gap-12 lg:grid-cols-2">
    <div class="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
      <p class="text-siga-700 text-4xl font-bold md:text-5xl md:whitespace-nowrap">
        {{ error.statusCode }} - {{ error.statusMessage || "An unexpected error has occurred." }}
      </p>

      <p class="flex flex-col text-lg text-muted-foreground">
        <span class="text-lg">
          Please try going back to the homepage or refreshing the page.
        </span>
        <span class="font-mono text-sm">
          {{ error.message }}
        </span>
      </p>

      <button class="flex flex-row items-center gap-4 font-semibold" @click="() => clearError({ redirect: '/' })">
        <icon name="mdi:arrow-left" size="25" />
        <span>Go Back</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps<{
  error: NuxtError
}>()

onMounted(() => {
  console.error(`Error ${props.error.statusCode}: ${props.error.message}`)
})
</script>
