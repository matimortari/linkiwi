<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      My Widgets
    </h3>

    <div class="flex flex-col gap-2">
      <Loading v-if="loading" />
      <Empty v-else-if="!widgets.length && !isAdding" message="Widgets display your content from other platforms directly on your profile." icon-name="mdi:shape" />

      <ul v-else class="flex flex-col gap-4">
        <li v-for="widget in widgets" :key="widget.id" class="flex flex-col gap-4">
          <div class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !widget.isVisible }">
            <div class="navigation-group min-w-0">
              <icon :name="WIDGET_ICONS[widget.type]" size="30" class="shrink-0" />
              <div class="flex min-w-0 flex-col">
                <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !widget.isVisible }">
                  {{ WIDGET_LABELS[widget.type] }}
                </span>
                <span class="text-caption truncate">{{ widget.handle }}</span>
              </div>
            </div>

            <div class="flex shrink-0 flex-row items-center gap-1">
              <button :aria-label="widget.isVisible ? 'Hide Widget' : 'Show Widget'" class="btn-ghost p-0.5!" @click="handleToggleVisibility(widget.id, widget.isVisible)">
                <icon :name="widget.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="25" class="text-muted-foreground" />
              </button>
              <button aria-label="Edit Widget" class="btn-ghost p-0.5!" @click="toggleEdit(widget)">
                <icon :name="editingId === widget.id ? 'mdi:chevron-up' : 'mdi:circle-edit-outline'" size="25" class="text-caption-info" />
              </button>
              <button aria-label="Delete Widget" class="btn-ghost p-0.5!" @click="handleDelete(widget.id)">
                <icon name="mdi:remove-circle-outline" size="25" class="text-caption-danger" />
              </button>
            </div>
          </div>

          <div v-if="editingId === widget.id" class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
            <p class="text-sm font-medium">
              {{ WIDGET_META[widget.type].label }}
            </p>

            <div class="navigation-group">
              <input v-model="editHandle" type="text" class="flex-1" :placeholder="WIDGET_META[widget.type].placeholder">
              <button class="btn-success shrink-0" :disabled="!editHandle || loading" @click="handleUpdate(widget.id)">
                <icon name="mdi:check" size="20" />
                <span class="hidden md:inline">Save</span>
              </button>
              <button class="btn-ghost shrink-0" @click="cancelEdit">
                <icon name="mdi:close" size="20" />
              </button>
            </div>

            <p class="text-caption text-xs">
              {{ WIDGET_META[widget.type].hint }}
            </p>
          </div>
        </li>
      </ul>

      <div v-if="isAdding" class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
        <p class="text-sm font-medium">
          Select Platform
        </p>

        <div class="flex flex-row flex-wrap items-start gap-4">
          <button
            v-for="option in WIDGET_OPTIONS" :key="option.type"
            class="card navigation-group p-2! hover:bg-muted!" :class="{ 'bg-muted!': newType === option.type, 'cursor-not-allowed! opacity-40': existingTypes.includes(option.type) }"
            :disabled="existingTypes.includes(option.type)" @click="newType = option.type"
          >
            <icon :name="option.icon" size="25" class="shrink-0" />
            <span class="text-sm font-medium">{{ option.label }}</span>
          </button>
        </div>

        <div v-if="newType" class="flex flex-col gap-1">
          <p class="text-sm font-medium">
            {{ WIDGET_META[newType].label }}
          </p>

          <div class="navigation-group">
            <input v-model="newHandle" type="text" class="flex-1" :placeholder="WIDGET_META[newType].placeholder">
            <button class="btn-success shrink-0" :disabled="!newHandle || loading" @click="handleCreate">
              <icon name="mdi:check" size="20" />
              <span class="hidden md:inline">Add</span>
            </button>
            <button class="btn-danger shrink-0" @click="cancelAdd">
              <icon name="mdi:close" size="20" />
            </button>
          </div>

          <p class="text-caption text-xs">
            {{ WIDGET_META[newType].hint }}
          </p>
        </div>

        <div v-if="!newType" class="flex justify-end">
          <button class="btn-danger" @click="cancelAdd">
            <icon name="mdi:close" size="20" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <button v-if="!isAdding" class="btn-primary self-end" :disabled="widgets.length >= 2" @click="startAdd">
        <icon name="mdi:shape-plus" size="25" />
        <span>Add Widget</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const widgets = computed<NormalizedWidget[]>(() => (profileItemsStore.items || []).filter((w: ProfileItem) => w.type === "WIDGET" && w.widget).map((w: ProfileItem) => ({
  id: w.id,
  isVisible: w.isVisible,
  type: w.widget!.type,
  handle: w.widget!.handle,
})))

const existingTypes = computed(() => widgets.value.map(w => w.type))
const isAdding = ref(false)
const newType = ref<WidgetType | null>(null)
const newHandle = ref("")
const editingId = ref<string | null>(null)
const editHandle = ref("")

function startAdd() {
  cancelEdit()
  isAdding.value = true
  newType.value = null
  newHandle.value = ""
}

function cancelAdd() {
  isAdding.value = false
  newType.value = null
  newHandle.value = ""
}

function toggleEdit(widget: NormalizedWidget) {
  if (editingId.value === widget.id) {
    cancelEdit()
    return
  }

  cancelAdd()
  editingId.value = widget.id
  editHandle.value = widget.handle
}

function cancelEdit() {
  editingId.value = null
  editHandle.value = ""
}

async function handleCreate() {
  if (!newType.value || !newHandle.value) {
    return
  }

  const res = await profileItemsStore.createItem({ type: "WIDGET", isPinned: false, isVisible: true, widget: { type: newType.value, handle: newHandle.value } })
  if (res) {
    cancelAdd()
  }
}

async function handleUpdate(id: string) {
  if (!editHandle.value) {
    return
  }

  const res = await profileItemsStore.updateItem(id, { widget: { handle: editHandle.value } })
  if (res) {
    cancelEdit()
  }
}

async function handleToggleVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this widget?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

onMounted(async () => await profileItemsStore.getItems())
</script>
