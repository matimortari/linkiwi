<template>
  <div class="navigation-group w-full justify-between rounded-[5rem] border p-2 transition-colors hover:bg-muted/30" :class="disabled ? 'cursor-not-allowed line-through opacity-50' : ''">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>

    <div class="navigation-group">
      <span class="text-sm font-medium tracking-tight text-muted-foreground">{{ value }}</span>
      <input
        :id="id" type="color"
        :value="value" :disabled="disabled"
        @input="emit('update:value', ($event.target as HTMLInputElement)?.value)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id?: string
  label?: string
  value?: string
  disabled?: boolean
}>(), {
  value: "#000000",
  disabled: false,
})

const emit = defineEmits<{ "update:value": [value: string] }>()
</script>
