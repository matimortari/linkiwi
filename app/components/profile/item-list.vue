<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Links
    </h3>

    <div class="flex flex-col gap-4">
      <Loading v-if="loading" />

      <template v-else>
        <div class="navigation-group flex-wrap">
          <button v-for="option in ITEM_TYPES" :key="option.type" class="card navigation-group p-2! hover:bg-muted!" @click="handlePickType(option.type)">
            <icon :name="option.icon" size="20" />
            <span class="text-sm">{{ option.label }}</span>
          </button>
        </div>

        <Empty v-if="!mainItems.length" message="Customize your profile by adding links and content." icon-name="mdi:shape" />

        <VueDraggable
          v-else v-model="orderedItems"
          tag="ul" class="flex flex-col gap-4"
          handle=".drag-handle" :animation="150"
          @end="reorderItems"
        >
          <li v-for="item in orderedItems" :key="item.id">
            <div v-if="item.type === 'DIVIDER'" class="card navigation-group justify-between py-2!" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon name="mdi:minus" size="20" class="text-muted-foreground" />
                <span class="text-sm text-muted-foreground italic">Divider</span>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                :show-schedule="true" :show-edit="false"
                @toggle="toggleVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                @schedule="openSchedule(item)" @delete="handleDelete(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'LINK' && item.link" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                  </button>
                  <icon name="mdi:link-variant" size="20" class="shrink-0 text-muted-foreground" />
                  <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">
                    {{ item.link.label }}
                  </span>
                </div>
                <ProfileItemRowActions
                  :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                  :show-schedule="true" @toggle="toggleVisibility(item.id, item.isVisible)"
                  @pin="togglePin(item.id, item.isPinned)"
                  @schedule="openSchedule(item)" @delete="handleDelete(item.id)"
                />
              </div>
              <nuxt-link :to="item.link.url" class="text-caption truncate pl-9 text-xs hover:underline" target="_blank">
                {{ item.link.url }}
              </nuxt-link>
            </div>

            <div v-else-if="item.type === 'WIDGET' && item.widget" class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group min-w-0">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" />
                <div class="flex min-w-0 flex-col">
                  <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">
                    {{ WIDGET_LABELS[item.widget.type] }}
                  </span>
                  <span class="text-caption truncate text-xs">{{ item.widget.handle }}</span>
                </div>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                :show-schedule="true" @toggle="toggleVisibility(item.id, item.isVisible)"
                @pin="togglePin(item.id, item.isPinned)" @schedule="openSchedule(item)"
                @edit="handleEdit(item)" @delete="handleDelete(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'PHOTO_GRID'" class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon name="mdi:image-multiple-outline" size="20" class="text-muted-foreground" />
                <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">Photo Grid</span>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                :show-schedule="true" @toggle="toggleVisibility(item.id, item.isVisible)"
                @pin="togglePin(item.id, item.isPinned)" @schedule="openSchedule(item)"
                @edit="handleEdit(item)" @delete="handleDelete(item.id)"
              />
            </div>
          </li>
        </VueDraggable>
      </template>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
  <ProfilePhotoGridDialog :is-open="uiState.dialogs.photoGrid.isOpen" @close="closeDialog('photoGrid')" />
  <ProfileWidgetDialog :is-open="isWidgetDialogOpen" @close="closeDialog('widget')" />
  <ProfileScheduleDialog :is-open="isScheduleDialogOpen" :item="schedulingItem" @close="closeScheduleDialog" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { uiState, isLinkDialogOpen, isWidgetDialogOpen, openDialog, closeDialog } = useUIState()
const orderedItems = ref<ProfileItem[]>([])
const isScheduleDialogOpen = ref(false)
const schedulingItem = ref<ProfileItem | null>(null)
const mainItems = computed<ProfileItem[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type !== "ICON").sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

async function handlePickType(type: ProfileItemType) {
  if (type === "LINK") {
    uiState.dialogs.link.selectedLink = null
    openDialog("link")
    return
  }
  if (type === "WIDGET") {
    uiState.dialogs.widget.selectedWidget = null
    openDialog("widget")
    return
  }
  if (type === "PHOTO_GRID") {
    openDialog("photoGrid")
    return
  }
  if (type === "DIVIDER") {
    await profileItemsStore.createItem({ type: "DIVIDER", isPinned: false, isVisible: true })
  }
}

function handleEdit(item: ProfileItem) {
  if (item.type === "LINK") {
    uiState.dialogs.link.selectedLink = item
    openDialog("link")
    return
  }
  if (item.type === "WIDGET") {
    uiState.dialogs.widget.selectedWidget = item
    openDialog("widget")
    return
  }
  if (item.type === "PHOTO_GRID") {
    openDialog("photoGrid")
  }
}

async function reorderItems() {
  const updates = orderedItems.value.map((item, index) => ({ id: item.id, order: index })).filter(({ id, order }) => {
    const existing = mainItems.value.find(i => i.id === id)
    return existing?.order !== order
  })
  if (!updates.length) {
    return
  }

  const results = await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
  if (results.every(Boolean)) {
    profileItemsStore.items.sort((a, b) => a.order - b.order)
  }
  else {
    orderedItems.value = [...orderedItems.value]
    await profileItemsStore.getItems()
  }
}

async function togglePin(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isPinned: !current })
}

async function toggleVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

function openSchedule(item: ProfileItem) {
  schedulingItem.value = item
  isScheduleDialogOpen.value = true
}

function closeScheduleDialog() {
  isScheduleDialogOpen.value = false
  schedulingItem.value = null
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

watch(() => mainItems.value, newItems => orderedItems.value = [...newItems], { immediate: true, deep: true })
</script>
