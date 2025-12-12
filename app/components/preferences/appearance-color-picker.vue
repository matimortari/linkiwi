<template>
  <div class="navigation-group w-full justify-between rounded-[5rem] border p-2" :class="disabled ? 'cursor-not-allowed line-through opacity-50' : ''">
    <label :for="id" class="text-caption">{{ label }}</label>

    <div class="flex flex-row items-center gap-2">
      <span class="text-sm font-medium tracking-tight text-muted-foreground">{{ value }}</span>
      <input
        :id="id" type="color"
        :value="value" :disabled="disabled"
        @input="$emit('update:value', ($event.target as HTMLInputElement)?.value)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  value: {
    type: String,
    default: "#000000",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits<(e: "update:value", value: string) => void>()
</script>
