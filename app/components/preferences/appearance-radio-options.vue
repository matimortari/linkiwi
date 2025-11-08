<template>
  <div class="flex w-full flex-col gap-4 p-2">
    <p class="text-caption">
      {{ label }}
    </p>

    <div class="space-y-2">
      <label v-for="option in options" :key="option.value" class="flex flex-row items-center gap-2">
        <input
          type="radio" :name="name"
          :value="option.value" :checked="value === option.value"
          @change="$emit('update:value', option.value)"
        >
        <span class="text-caption">{{ option.label }}</span>
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

defineEmits(["update:value"])
</script>
