<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Widgets
    </h3>

    <div class="flex flex-col gap-2">
      <Loading v-if="loading" />
      <Empty v-else-if="!widgets.length && !isAdding" message="Widgets display your content from other platforms directly on your profile." icon-name="mdi:widgets-outline" />

      <ul v-else class="flex flex-col gap-2">
        <li v-for="widget in widgets" :key="widget.id" class="flex flex-col gap-2">
          <div class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !widget.isVisible }">
            <div class="navigation-group min-w-0">
              <icon :name="WIDGET_ICONS[widget.type as WidgetType]" size="20" class="shrink-0" />
              <div class="flex min-w-0 flex-col">
                <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !widget.isVisible }">
                  {{ WIDGET_LABELS[widget.type as WidgetType] }}
                </span>
                <span class="text-caption truncate">{{ widget.handle }}</span>
              </div>
            </div>

            <div class="flex shrink-0 flex-row items-center gap-1">
              <button :aria-label="widget.isVisible ? 'Hide Widget' : 'Show Widget'" class="btn-ghost p-0.5!" @click="handleToggleVisibility(widget.id, widget.isVisible)">
                <icon :name="widget.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="25" class="text-muted-foreground" />
              </button>
              <button aria-label="Edit Widget" class="btn-ghost p-0.5!" @click="toggleEdit(widget)">
                <icon :name="editingId === widget.id ? 'mdi:chevron-up' : 'mdi:circle-edit-outline'" size="25" class="text-primary" />
              </button>
              <button aria-label="Delete Widget" class="btn-ghost p-0.5!" @click="handleDelete(widget.id)">
                <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
              </button>
            </div>
          </div>

          <div v-if="editingId === widget.id" class="card flex flex-col gap-3 border-primary!">
            <p class="text-sm font-medium">
              {{ WIDGET_META[widget.type as WidgetType].label }}
            </p>
            <div class="flex gap-2">
              <input v-model="editHandle" type="text" class="flex-1" :placeholder="WIDGET_META[widget.type as WidgetType].placeholder">
              <button class="btn-success shrink-0" :disabled="!editHandle || loading" @click="handleUpdate(widget.id)">
                <icon name="mdi:check" size="20" />
                <span>Save</span>
              </button>
              <button class="btn-danger shrink-0" @click="cancelEdit">
                <icon name="mdi:close" size="20" />
              </button>
            </div>
            <p class="text-caption text-xs">
              {{ WIDGET_META[widget.type as WidgetType].hint }}
            </p>
          </div>
        </li>
      </ul>

      <div v-if="isAdding" class="card flex flex-col gap-3 border-primary!">
        <p class="text-sm font-medium">
          Select Platform
        </p>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option in WIDGET_OPTIONS" :key="option.type"
            class="card navigation-group p-2! hover:bg-muted!" :class="{ 'bg-muted!': newType === option.type, 'cursor-not-allowed! opacity-40': existingTypes.includes(option.type) }"
            :disabled="existingTypes.includes(option.type)" @click="newType = option.type"
          >
            <icon :name="option.icon" size="18" class="shrink-0" />
            <span class="text-sm font-medium">{{ option.label }}</span>
          </button>
        </div>

        <template v-if="newType">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">
              {{ WIDGET_META[newType].label }}
            </p>

            <div class="flex gap-2">
              <input v-model="newHandle" type="text" class="flex-1" :placeholder="WIDGET_META[newType].placeholder">
              <button class="btn-success shrink-0" :disabled="!newHandle || loading" @click="handleCreate">
                <icon name="mdi:check" size="20" />
                <span>Add</span>
              </button>
              <button class="btn-ghost shrink-0" @click="cancelAdd">
                <icon name="mdi:close" size="20" />
              </button>
            </div>

            <p class="text-caption text-xs">
              {{ WIDGET_META[newType].hint }}
            </p>
          </div>
        </template>

        <div v-if="!newType" class="flex justify-end">
          <button class="btn-ghost" @click="cancelAdd">
            <icon name="mdi:close" size="20" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <button v-if="!isAdding" class="btn-primary self-end" :disabled="widgets.length >= 4" @click="startAdd">
        <icon name="mdi:widgets-outline" size="25" />
        <span>Add Widget</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WidgetType } from "#shared/schemas/widget-schema"

const WIDGET_OPTIONS: { type: WidgetType, label: string, icon: string }[] = [
  { type: "GITHUB", label: "GitHub", icon: "simple-icons:github" },
  { type: "YOUTUBE", label: "YouTube", icon: "simple-icons:youtube" },
  { type: "SPOTIFY", label: "Spotify", icon: "simple-icons:spotify" },
]

const WIDGET_ICONS: Record<WidgetType, string> = {
  GITHUB: "simple-icons:github",
  YOUTUBE: "simple-icons:youtube",
  SPOTIFY: "simple-icons:spotify",
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  GITHUB: "GitHub",
  YOUTUBE: "YouTube",
  SPOTIFY: "Spotify",
}

const WIDGET_META: Record<WidgetType, { label: string, placeholder: string, hint: string }> = {
  GITHUB: {
    label: "GitHub Username",
    placeholder: "e.g. torvalds",
    hint: "Your GitHub username as it appears in your profile URL.",
  },
  YOUTUBE: {
    label: "YouTube Handle or Channel ID",
    placeholder: "e.g. @mkbhd or UCBcRF18a7Qf58cCRy5xuWwQ",
    hint: "Your @handle or the channel ID from your YouTube URL.",
  },
  SPOTIFY: {
    label: "Spotify User ID",
    placeholder: "e.g. abc123xyz",
    hint: "Found in your Spotify profile URL: open.spotify.com/user/YOUR_ID",
  },
}

const widgetsStore = useWidgetsStore()
const { widgets, loading } = storeToRefs(widgetsStore)
const existingTypes = computed(() => widgets.value.map(w => w.type as WidgetType))
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

function toggleEdit(widget: Widget) {
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
  try {
    await widgetsStore.createWidget({ type: newType.value, handle: newHandle.value })
    cancelAdd()
  }
  catch {
    // Silently fail
  }
}

async function handleUpdate(id: string) {
  if (!editHandle.value) {
    return
  }
  try {
    await widgetsStore.updateWidget(id, { handle: editHandle.value })
    cancelEdit()
  }
  catch {
    // Silently fail
  }
}

async function handleToggleVisibility(id: string, current: boolean) {
  await widgetsStore.updateWidget(id, { isVisible: !current })
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this widget?")) {
    return
  }
  await widgetsStore.deleteWidget(id)
}
</script>
