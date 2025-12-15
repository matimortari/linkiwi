<template>
  <div class="flex flex-col items-center justify-center gap-8 py-12 text-center text-muted-foreground">
    <div class="rounded-full bg-muted p-4">
      <icon :name="iconName || 'mdi:alert-circle-outline'" :size="30" />
    </div>

    <h5 class="max-w-md">
      {{ message }}
    </h5>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  iconName: string
}>()
</script>
