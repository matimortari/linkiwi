<template>
  <div class="navigation-group w-full justify-between rounded-[5rem] border p-2 transition-colors hover:bg-muted/30">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>

    <div class="flex cursor-pointer flex-row items-center">
      <input :id="id" type="checkbox" :checked="value" @change="emit('update:value', ($event.target as HTMLInputElement).checked)">
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id?: string
  label?: string
  value?: boolean
}>(), {
  value: false,
})

const emit = defineEmits<{ "update:value": [value: boolean] }>()
</script>
