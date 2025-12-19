<template>
  <div class="navigation-group w-full justify-between rounded-[5rem] border p-2" :class="disabled ? 'cursor-not-allowed line-through opacity-50' : ''">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>

    <select
      :id="id" :value="value"
      :disabled="disabled" class="cursor-pointer bg-transparent p-2 text-end text-xs font-medium tracking-tight text-muted-foreground disabled:opacity-50"
      @change="$emit('update:value', ($event.target && ($event.target as HTMLSelectElement).value) ?? '')"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
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
