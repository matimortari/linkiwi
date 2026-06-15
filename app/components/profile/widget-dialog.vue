<template>
  <Dialog :is-open="isWidgetDialogOpen" :title="isUpdateMode ? 'Edit Widget' : 'Add Widget'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium">Select Platform</span>
        <div class="flex flex-row flex-wrap gap-2">
          <button
            v-for="option in WIDGET_OPTIONS" :key="option.type"
            type="button"
            class="card navigation-group p-2! hover:bg-muted!"
            :class="{ 'bg-muted!': form.type === option.type, 'cursor-not-allowed! opacity-40': !isUpdateMode && existingTypes.includes(option.type) }"
            :disabled="!isUpdateMode && existingTypes.includes(option.type)"
            @click="form.type = option.type"
          >
            <icon :name="option.icon" size="22" class="shrink-0" />
            <span class="text-sm font-medium">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <template v-if="form.type">
        <div class="flex flex-col gap-1">
          <label for="handle" class="text-sm font-medium">{{ WIDGET_META[form.type].label }}</label>
          <input id="handle" v-model="form.handle" type="text" :placeholder="WIDGET_META[form.type].placeholder">
          <p class="text-xs text-muted-foreground">
            {{ WIDGET_META[form.type].hint }}
          </p>
        </div>
      </template>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button class="btn-success" type="submit" :disabled="!form.type || !form.handle">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const profileItemsStore = useProfileItemsStore()
const { isWidgetDialogOpen, selectedWidget } = useUIState()
const form = ref<{ type: WidgetType | null, handle: string }>({ type: null, handle: "" })
const editingId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingId.value)
const existingTypes = computed(() => profileItemsStore.items.filter((i: ProfileItem) => i.type === "WIDGET" && i.widget).map((i: ProfileItem) => i.widget!.type))

async function handleSubmit() {
  if (!form.value.type || !form.value.handle) {
    return
  }
  if (isUpdateMode.value && editingId.value) {
    await profileItemsStore.updateItem(editingId.value, { widget: { handle: form.value.handle } })
  }
  else {
    await profileItemsStore.createItem({
      type: "WIDGET",
      isPinned: false,
      isVisible: true,
      widget: { type: form.value.type, handle: form.value.handle },
    })
  }
  handleCancel()
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  editingId.value = null
  form.value = { type: null, handle: "" }
}

watch(() => selectedWidget.value, (item) => {
  if (item && item.widget) {
    editingId.value = item.id
    form.value.type = item.widget.type
    form.value.handle = item.widget.handle
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
