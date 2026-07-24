<template>
  <div class="flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
    <div class="rounded-lg bg-muted p-4">
      <icon :name="iconName || 'ph:empty-bold'" size="30" />
    </div>

    <p class="max-w-xs leading-5 font-semibold">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  iconName: string
}>()
</script>
