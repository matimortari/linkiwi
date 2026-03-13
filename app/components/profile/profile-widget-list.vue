<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Widgets
    </h3>

    <div class="flex flex-col gap-2">
      <Loading v-if="loading" />
      <Empty v-else-if="!widgets.length" message="Widgets display your content from other platforms directly on your profile." icon-name="mdi:widgets-outline" />

      <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <li v-for="widget in widgets" :key="widget.id" class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !widget.isVisible }">
          <div class="navigation-group min-w-0">
            <icon :name="WIDGET_ICONS[widget.type]" size="20" class="shrink-0" />
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
            <button aria-label="Edit Widget" class="btn-ghost p-0.5!" @click="handleEditWidget(widget)">
              <icon name="mdi:circle-edit-outline" size="25" class="text-primary" />
            </button>
            <button aria-label="Delete Widget" class="btn-ghost p-0.5!" @click="handleDeleteWidget(widget.id)">
              <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
            </button>
          </div>
        </li>
      </ul>

      <button class="btn-primary self-end" aria-label="Add Widget" :disabled="widgets.length >= 4" @click="handleAddWidget">
        <icon name="mdi:widgets-outline" size="25" />
        <span>Add Widget</span>
      </button>
    </div>
  </div>

  <UserWidgetForm :is-open="isFormOpen" :selected-widget="selectedWidget" :existing-types="existingTypes" @close="handleCloseForm" />
</template>

<script setup lang="ts">
import type { WidgetType } from "#shared/schemas/widget-schema"

const WIDGET_ICONS: Record<WidgetType, string> = {
  GITHUB: "simple-icons:github",
  YOUTUBE: "simple-icons:youtube",
  SPOTIFY: "simple-icons:spotify",
  TWITCH: "simple-icons:twitch",
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  GITHUB: "GitHub",
  YOUTUBE: "YouTube",
  SPOTIFY: "Spotify",
  TWITCH: "Twitch",
}

const widgetsStore = useWidgetsStore()
const { widgets, loading } = storeToRefs(widgetsStore)

const isFormOpen = ref(false)
const selectedWidget = ref<Widget | null>(null)

const existingTypes = computed(() => widgets.value.map(w => w.type as WidgetType))

function handleAddWidget() {
  selectedWidget.value = null
  isFormOpen.value = true
}

function handleEditWidget(widget: Widget) {
  selectedWidget.value = widget
  isFormOpen.value = true
}

function handleCloseForm() {
  isFormOpen.value = false
  selectedWidget.value = null
}

async function handleToggleVisibility(id: string, current: boolean) {
  await widgetsStore.updateWidget(id, { isVisible: !current })
}

async function handleDeleteWidget(id: string) {
  if (!confirm("Are you sure you want to delete this widget?")) {
    return
  }
  await widgetsStore.deleteWidget(id)
}
</script>
