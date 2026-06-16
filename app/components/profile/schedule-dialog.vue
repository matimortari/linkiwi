<template>
  <Dialog :is-open="isOpen" title="Schedule Item" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-1">
        <label for="scheduledStart" class="text-sm font-medium">
          Start <span class="text-muted-foreground">(optional)</span>
        </label>
        <input id="scheduledStart" v-model="form.scheduledStart" type="datetime-local">
      </div>

      <div class="flex flex-col gap-1">
        <label for="scheduledEnd" class="text-sm font-medium">
          End <span class="text-muted-foreground">(optional)</span>
        </label>
        <input id="scheduledEnd" v-model="form.scheduledEnd" type="datetime-local">
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">On End</label>
        <div class="flex gap-2">
          <button
            v-for="opt in SCHEDULE_ACTION_OPTIONS" :key="opt.value"
            type="button"
            class="card navigation-group p-2! hover:bg-muted!"
            :class="{ 'bg-muted!': form.scheduleAction === opt.value }"
            @click="form.scheduleAction = opt.value"
          >
            <icon :name="opt.icon" size="18" />
            <span class="text-sm">{{ opt.label }}</span>
          </button>
        </div>
        <p class="text-xs text-muted-foreground">
          What happens to this item when the end date is reached.
        </p>
      </div>

      <div v-if="form.scheduledStart || form.scheduledEnd" class="flex justify-end">
        <button type="button" class="btn-ghost text-caption-danger text-sm" @click="handleClear">
          <icon name="mdi:calendar-remove-outline" size="18" />
          Clear Schedule
        </button>
      </div>

      <footer class="flex items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-danger" @click="emit('close')">
            Cancel
          </button>
          <button class="btn-success" type="submit">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ isOpen: boolean, item: ProfileItem | null }>()

const emit = defineEmits<{ close: [] }>()

const profileItemsStore = useProfileItemsStore()

const form = ref({
  scheduledStart: "",
  scheduledEnd: "",
  scheduleAction: null as "HIDE" | "DELETE" | null,
})

function toDatetimeLocal(val: string | Date | null | undefined) {
  if (!val) {
    return ""
  }
  return new Date(val).toISOString().slice(0, 16)
}

function toISOOrNull(val: string) {
  return val ? new Date(val).toISOString() : null
}

async function handleSubmit() {
  await profileItemsStore.updateItem(props.item!.id, {
    scheduledStart: toISOOrNull(form.value.scheduledStart),
    scheduledEnd: toISOOrNull(form.value.scheduledEnd),
    scheduleAction: form.value.scheduleAction,
  })
  emit("close")
}

async function handleClear() {
  form.value = { scheduledStart: "", scheduledEnd: "", scheduleAction: null }
  await profileItemsStore.updateItem(props.item!.id, {
    scheduledStart: null,
    scheduledEnd: null,
    scheduleAction: null,
  })
  emit("close")
}

watch(() => props.item, (item) => {
  if (item) {
    form.value = {
      scheduledStart: toDatetimeLocal(item.scheduledStart),
      scheduledEnd: toDatetimeLocal(item.scheduledEnd),
      scheduleAction: item.scheduleAction ?? null,
    }
  }
  else {
    form.value = { scheduledStart: "", scheduledEnd: "", scheduleAction: null }
  }
}, { immediate: true })
</script>
