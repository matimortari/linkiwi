<template>
  <div class="flex w-full flex-col gap-4 p-2">
    <p class="text-sm font-medium">
      {{ label }}
    </p>

    <div class="space-y-2">
      <label v-for="option in options" :key="option.value" class="group navigation-group cursor-pointer" :class="value === option.value ? '' : 'text-muted-foreground'">
        <input type="radio" :value="option.value" :checked="value === option.value" @change="emit('update:value', option.value)">
        <span class="rounded-[5rem] p-2 text-sm font-medium tracking-tight transition-colors group-hover:bg-muted/30" :class="value === option.value ? '' : 'text-muted-foreground'">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
  label?: string
  value?: string
  options: ReadonlyArray<{ label: string, value: string }>
}>()

const emit = defineEmits<{ "update:value": [value: string] }>()
</script>
