<template>
  <Loading v-if="loading" />

  <template v-else>
    <Empty v-if="!mainItems.length" message="Customize your profile by adding links and content." icon-name="mdi:shape" />

    <VueDraggable
      v-else v-model="orderedItems"
      tag="ul" class="flex flex-col gap-2"
      handle=".drag-handle" :animation="150"
      @end="reorderItems"
    >
      <li v-for="item in orderedItems" :key="item.id">
        <div v-if="item.type === 'DIVIDER'" class="card navigation-group justify-between py-2!" :class="{ 'opacity-50': !item.isVisible }">
          <div class="navigation-group">
            <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
              <icon name="mdi:drag-vertical" size="25" class="text-muted" />
            </button>
            <icon name="mdi:minus" size="20" class="text-muted-foreground" />
            <span class="text-xs text-muted-foreground italic">Divider</span>
          </div>
          <ProfileItemRowActions
            :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
            :show-edit="false" @toggle="toggleItemVisibility(item.id, item.isVisible)"
            @pin="togglePin(item.id, item.isPinned)" @schedule="openSchedule(item)"
            @delete="handleDelete(item.id)"
          />
        </div>

        <div v-else-if="item.type === 'LINK' && item.link" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
          <div class="flex items-center justify-between">
            <div class="navigation-group min-w-0">
              <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="25" class="text-muted" />
              </button>
              <img v-if="item.link.imageUrl" :src="item.link.imageUrl" :alt="item.link.label" class="size-6 shrink-0 rounded-full object-cover">
              <icon v-else name="mdi:link-variant" size="20" class="shrink-0 text-muted-foreground" />
              <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ item.link.label }}</span>
            </div>
            <ProfileItemRowActions
              :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
              @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
              @schedule="openSchedule(item)" @edit="handleEdit(item)"
              @delete="handleDelete(item.id)"
            />
          </div>
          <nuxt-link :to="item.link.url" class="truncate pl-8 text-xs text-muted-foreground hover:underline" target="_blank">
            {{ item.link.url }}
          </nuxt-link>
        </div>

        <div v-else-if="item.type === 'WIDGET' && item.widget" class="card flex flex-col gap-0.5" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
          <div class="flex items-center justify-between">
            <div class="navigation-group min-w-0">
              <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="25" class="text-muted" />
              </button>
              <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0 text-muted-foreground" />
              <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ WIDGET_LABELS[item.widget.type] }}</span>
            </div>
            <ProfileItemRowActions
              :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
              @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
              @schedule="openSchedule(item)" @edit="handleEdit(item)"
              @delete="handleDelete(item.id)"
            />
          </div>
          <span class="truncate pl-8 text-xs text-muted-foreground">{{ item.widget.handle }}</span>
        </div>

        <div v-else-if="item.type === 'PHOTO_GRID'" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
          <div class="flex items-center justify-between">
            <div class="navigation-group min-w-0">
              <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="25" class="text-muted" />
              </button>
              <icon name="mdi:image-multiple-outline" size="20" class="shrink-0 text-muted-foreground" />
              <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">Photo Grid</span>
            </div>
            <ProfileItemRowActions
              :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
              @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
              @schedule="openSchedule(item)" @edit="handleEdit(item)"
              @delete="handleDelete(item.id)"
            />
          </div>
          <span class="truncate pl-8 text-xs text-muted-foreground">{{ getPhotoGridLabel(item) }}</span>
        </div>
      </li>
    </VueDraggable>

    <div v-if="isPicking" class="flex flex-col gap-2 rounded-2xl border bg-card p-4 md:p-8">
      <p class="text-sm font-medium">
        What do you want to add?
      </p>
      <div class="flex flex-row flex-wrap gap-2">
        <button
          v-for="option in ITEM_TYPES" :key="option.type"
          type="button" class="btn"
          :disabled="option.type === 'PHOTO_GRID' && !userStore.assets.length" @click="handlePickType(option.type)"
        >
          <icon :name="option.icon" size="20" />
          <span class="text-sm">{{ option.label }}</span>
        </button>
      </div>
      <div class="flex justify-end">
        <button class="btn-ghost" @click="isPicking = false">
          <icon name="mdi:close" size="20" />
          <span>Cancel</span>
        </button>
      </div>
    </div>

    <button v-else class="btn-primary self-end" @click="isPicking = true">
      <icon name="mdi:plus" size="20" />
      <span>Add Item</span>
    </button>
  </template>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
  <ProfileWidgetDialog :is-open="isWidgetDialogOpen" @close="closeDialog('widget')" />
  <ProfilePhotoGridDialog :is-open="uiState.dialogs.photoGrid.isOpen" @close="closeDialog('photoGrid')" />
  <ProfileScheduleDialog :is-open="isScheduleDialogOpen" :item="schedulingItem" @close="closeScheduleDialog" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const userStore = useUserStore()
const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { uiState, isLinkDialogOpen, isWidgetDialogOpen, openDialog, closeDialog } = useUIState()
const isPicking = ref(false)
const isScheduleDialogOpen = ref(false)
const schedulingItem = ref<ProfileItem | null>(null)
const orderedItems = ref<ProfileItem[]>([])

const mainItems = computed<ProfileItem[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type !== "ICON").sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

function getPhotoGridLabel(item: ProfileItem) {
  const count = item.photoGrid?.photos?.length ?? 0
  return count === 1 ? "1 photo" : `${count} photos`
}

async function handlePickType(type: ProfileItemType) {
  if (type === "PHOTO_GRID" && !userStore.assets.length) {
    return
  }
  isPicking.value = false
  if (type === "LINK") {
    uiState.dialogs.link.selectedLink = null
    openDialog("link")
    return
  }
  if (type === "ICON") {
    openDialog("icon")
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
    openDialog("link", { item })
    return
  }
  if (item.type === "WIDGET") {
    openDialog("widget", { item })
    return
  }
  if (item.type === "PHOTO_GRID") {
    openDialog("photoGrid", { item })
  }
}

async function reorderItems() {
  const updates = orderedItems.value.map((item, index) => ({ id: item.id, order: index })).filter(({ id, order }) => mainItems.value.find(i => i.id === id)?.order !== order)
  if (!updates.length) {
    return
  }

  const results = await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
  if (results.every(Boolean)) {
    profileItemsStore.items.sort((a, b) => a.order - b.order)
  }
  else {
    orderedItems.value = [...mainItems.value]
    await profileItemsStore.getItems()
  }
}

async function togglePin(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isPinned: !current })
}

async function toggleItemVisibility(id: string, current: boolean) {
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
watch(isPicking, async (picking) => {
  if (picking && !userStore.assets.length) {
    await userStore.getAssets()
  }
})
</script>
