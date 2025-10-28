<template>
  <nav class="bg-card fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b px-4 py-2 md:px-8">
    <Logo />

    <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
      <icon :name="themeIcon" size="25" />
    </button>
  </nav>
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
</script>
