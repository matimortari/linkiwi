<template>
  <div class="navigation-group w-full justify-between rounded-2xl border p-2" :class="disabled ? 'cursor-not-allowed line-through opacity-50' : ''">
    <label :for="id" class="text-caption">{{ label }}</label>

    <select
      :id="id" :value="value"
      :disabled="disabled" class="cursor-pointer bg-transparent p-2 text-end text-sm font-medium tracking-tight text-muted-foreground disabled:opacity-50"
      @change="$emit('update:value', ($event.target && ($event.target as HTMLSelectElement).value) ?? '')"
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

defineEmits<(e: "update:value", value: string) => void>()
</script>
