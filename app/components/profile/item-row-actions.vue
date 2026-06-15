<template>
  <div class="flex shrink-0 flex-row items-center gap-1">
    <button :aria-label="props.isVisible ? 'Hide' : 'Show'" class="btn-ghost p-0.5!" @click="emit('toggle')">
      <icon :name="props.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="20" class="text-muted-foreground" />
    </button>

    <button v-if="props.showEdit" aria-label="Edit" class="btn-ghost p-0.5!" @click="emit('edit')">
      <icon name="mdi:circle-edit-outline" size="20" class="text-caption-info" />
    </button>

    <button aria-label="Delete" class="btn-ghost p-0.5!" @click="emit('delete')">
      <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  itemId: string
  isVisible: boolean
  showEdit?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  edit: []
  delete: []
}>()
</script>
