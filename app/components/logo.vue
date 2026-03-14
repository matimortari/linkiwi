<template>
  <nuxt-link to="/" class="navigation-group shrink-0 transition-transform hover:scale-105">
    <ClientOnly>
      <img src="/assets/symbol.png" alt="Logo" width="30">
      <img :src="themeTitle" alt="Wordmark" width="100">

      <template #fallback>
        <div class="size-7 animate-pulse rounded-full bg-muted" />
        <div class="h-3.5 w-25 animate-pulse rounded-full bg-muted" />
      </template>
    </ClientOnly>
  </nuxt-link>
</template>

<script setup lang="ts">
const { themeTitle } = useTheme()
</script>
