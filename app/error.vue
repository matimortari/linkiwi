<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center md:items-start md:p-12 md:text-start">
    <h2>
      {{ error.status }} – {{ error.statusText || "An unexpected error has occurred." }}
    </h2>

    <p class="flex flex-col gap-2 text-lg/6 text-muted-foreground">
      <span>Please try going back to the homepage or refreshing the page.</span>
      <span class="font-mono text-sm">{{ error.message }}</span>
    </p>

    <button class="navigation-group font-semibold" @click="() => clearError({ redirect: '/' })">
      <icon name="mdi:arrow-left" size="25" />
      <span>Go Back</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app"

defineProps<{
  error: NuxtError
}>()
</script>
