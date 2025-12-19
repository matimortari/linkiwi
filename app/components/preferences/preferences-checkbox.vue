<template>
  <div class="navigation-group w-full justify-between rounded-[5rem] border p-2">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>

    <div class="flex cursor-pointer flex-row items-center gap-2">
      <input :id="id" type="checkbox" :checked="value" @change="emit('update:value', ($event.target as HTMLInputElement).checked)">
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  value: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<(e: "update:value", value: boolean) => void>()
</script>
