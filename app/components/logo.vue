<template>
  <nuxt-link to="/" class="flex flex-row items-center gap-2">
    <img src="/assets/logo.png" alt="Logo" width="30">
    <img :src="themeTitle" alt="Wordmark" width="100">
  </nuxt-link>
</template>

<script setup lang="ts">
const { themeTitle } = useTheme()
</script>
