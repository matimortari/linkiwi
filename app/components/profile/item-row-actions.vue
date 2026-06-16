<template>
  <div class="flex shrink-0 flex-row items-center gap-1">
    <button :aria-label="props.item?.isPinned ? 'Unpin' : 'Pin'" class="btn-ghost p-0!" @click="emit('pin')">
      <icon :name="props.item?.isPinned ? 'mdi:pin' : 'mdi:pin-outline'" size="20" :class="props.item?.isPinned ? 'text-caption-info' : 'text-muted-foreground'" />
    </button>

    <button v-if="props.showSchedule" :aria-label="props.isScheduled ? 'Edit Schedule' : 'Schedule'" class="btn-ghost p-0!" @click="emit('schedule')">
      <icon :name="props.isScheduled ? 'mdi:calendar-clock' : 'mdi:calendar-clock-outline'" size="20" :class="props.isScheduled ? 'text-caption-info' : 'text-muted-foreground'" />
    </button>

    <button :aria-label="props.item?.isVisible ? 'Hide' : 'Show'" class="btn-ghost p-0!" @click="emit('toggle')">
      <icon :name="props.item?.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="20" class="text-muted-foreground" />
    </button>

    <button v-if="props.showEdit !== false" aria-label="Edit" class="btn-ghost p-0!" @click="emit('edit')">
      <icon name="mdi:circle-edit-outline" size="20" class="text-caption-info" />
    </button>

    <button aria-label="Delete" class="btn-ghost p-0!" @click="emit('delete')">
      <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item?: ProfileItem
  isScheduled?: boolean
  showEdit?: boolean
  showSchedule?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  pin: []
  edit: []
  schedule: []
  delete: []
}>()
</script>
