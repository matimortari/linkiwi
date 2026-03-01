<template>
  <nuxt-link to="/" class="navigation-group shrink-0 transition-transform hover:scale-105">
    <ClientOnly>
      <img src="/assets/symbol.png" alt="Logo" width="30">
      <img :src="themeTitle" alt="Wordmark" width="100">
    </ClientOnly>
  </nuxt-link>
</template>

<script setup lang="ts">
const { themeTitle } = useTheme()
</script>
