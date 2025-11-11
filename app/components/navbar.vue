<template>
  <nav class="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b bg-card px-4 py-2">
    <Logo />

    <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
      <icon :name="themeIcon" size="25" />
    </button>
  </nav>
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
</script>
