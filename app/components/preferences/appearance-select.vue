<template>
  <div class="navigation-group w-full justify-between rounded-2xl border p-2" :class="disabled ? 'line-through opacity-50 cursor-not-allowed' : ''">
    <label :for="id" class="text-caption">{{ label }}</label>

    <select
      :id="id" :value="value"
      :disabled="disabled" class="text-caption cursor-pointer bg-transparent p-2 text-end disabled:opacity-50"
      @change="$emit('update:value', $event.target && ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value" class="bg-card">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  value: string | undefined
  options: ReadonlyArray<{ label: string, value: string }>
  disabled?: boolean
}>()

defineEmits(["update:value"])
</script>
