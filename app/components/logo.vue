<template>
  <nuxt-link v-if="isLoading" to="/" class="flex flex-row items-center gap-2">
    <img src="/assets/symbol.png" alt="Logo" width="30">
    <img :src="themeTitle" alt="Wordmark" width="100">
  </nuxt-link>
</template>

<script setup lang="ts">
const { themeTitle } = useTheme()
const isLoading = ref(false)

onMounted(() => isLoading.value = true)
</script>
