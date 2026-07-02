<template>
  <Dialog :is-open="isOpen" title="Schedule Item" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-1">
        <label class="text-caption">Start (optional)</label>
        <input
          v-model="startDisplay"
          type="text"
          placeholder="yyyy/mm/dd hh:mm"
          :class="{ 'border-danger!': startDisplay && !form.scheduledStart }"
          @blur="startDisplay = commitDisplay(startDisplay, 'scheduledStart')"
        >
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-caption">End (optional)</label>
        <input
          v-model="endDisplay"
          type="text"
          placeholder="yyyy/mm/dd hh:mm"
          :class="{ 'border-danger!': endDisplay && !form.scheduledEnd }"
          @blur="endDisplay = commitDisplay(endDisplay, 'scheduledEnd')"
        >
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-caption">On End</label>
        <div class="flex gap-2">
          <button
            v-for="opt in SCHEDULE_ACTION_OPTIONS" :key="opt.value"
            type="button"
            class="card navigation-group p-2! hover:bg-muted!" :class="{ 'bg-muted!': form.scheduleAction === opt.value }"
            @click="form.scheduleAction = opt.value"
          >
            <icon :name="opt.icon" size="20" />
            <span class="text-sm">{{ opt.label }}</span>
          </button>
        </div>
        <p class="max-w-md text-xs text-muted-foreground">
          What happens to this item when the end date is reached. <span v-if="form.scheduleAction === 'DELETE'"> Deletion may take up to 15 minutes to complete.</span>
        </p>
      </div>

      <footer class="flex items-center justify-end">
        <div class="navigation-group">
          <button v-if="form.scheduledStart || form.scheduledEnd" type="button" class="btn-ghost text-caption-danger text-sm" @click="handleClear">
            <icon name="mdi:calendar-remove-outline" size="20" />
            <span>Clear Schedule</span>
          </button>

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
const form = ref({ scheduledStart: "", scheduledEnd: "", scheduleAction: null as "HIDE" | "DELETE" | null })
const startDisplay = ref("")
const endDisplay = ref("")

function toDisplay(internal: string): string {
  if (!internal) {
    return ""
  }

  const [datePart = "", timePart = ""] = internal.split("T")
  const [y = "", m = "", d = ""] = datePart.split("-")
  const [h = "", mi = ""] = timePart.split(":")
  return `${y}/${m}/${d} ${h}:${mi}`
}

function parseDisplay(raw: string): string {
  const cleaned = raw.trim()
  if (!cleaned) {
    return ""
  }

  const match = cleaned.match(/^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})[\sT](\d{1,2}):(\d{2})$/)
  if (!match) {
    return ""
  }

  const [, y, mo, d, h, mi] = match
  const month = Number(mo)
  const day = Number(d)
  const hour = Number(h)
  const minute = Number(mi)

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    return ""
  }

  return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function commitDisplay(raw: string, field: "scheduledStart" | "scheduledEnd"): string {
  const internal = parseDisplay(raw)
  form.value[field] = internal
  return internal ? toDisplay(internal) : raw
}

watch(() => props.item, (item) => {
  if (item) {
    const start = toDatetimeLocalValue(item.scheduledStart)
    const end = toDatetimeLocalValue(item.scheduledEnd)
    form.value.scheduledStart = start
    form.value.scheduledEnd = end
    form.value.scheduleAction = item.scheduleAction ?? null
    startDisplay.value = toDisplay(start)
    endDisplay.value = toDisplay(end)
  }
  else {
    form.value = { scheduledStart: "", scheduledEnd: "", scheduleAction: null }
    startDisplay.value = ""
    endDisplay.value = ""
  }
}, { immediate: true })

async function handleSubmit() {
  form.value.scheduledStart = parseDisplay(startDisplay.value)
  form.value.scheduledEnd = parseDisplay(endDisplay.value)

  await profileItemsStore.updateItem(props.item!.id, {
    scheduledStart: fromDatetimeLocalValue(form.value.scheduledStart),
    scheduledEnd: fromDatetimeLocalValue(form.value.scheduledEnd),
    scheduleAction: form.value.scheduleAction,
  })
  emit("close")
}

async function handleClear() {
  form.value = { scheduledStart: "", scheduledEnd: "", scheduleAction: null }
  startDisplay.value = ""
  endDisplay.value = ""
  await profileItemsStore.updateItem(props.item!.id, {
    scheduledStart: null,
    scheduledEnd: null,
    scheduleAction: null,
  })
  emit("close")
}
</script>
