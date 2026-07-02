<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      My Links
    </h4>

    <div class="flex flex-col gap-4">
      <Loading v-if="loading" />

      <template v-else>
        <div class="flex flex-col gap-2">
          <Empty v-if="!icons.length" message="Pin quick links to your most important social profiles." icon-name="mdi:star" />

          <VueDraggable
            v-else v-model="orderedIcons"
            tag="ul" class="navigation-group flex-wrap"
            handle=".drag-handle" :animation="150"
            @end="reorderIcons"
          >
            <li
              v-for="icon in orderedIcons" :key="icon.id"
              class="card relative flex size-18 items-center justify-center" :class="{ 'border-dashed! opacity-60': !icon.isVisible }"
            >
              <button class="drag-handle btn-ghost absolute top-1 left-1 cursor-move p-0!" aria-label="Drag to reorder">
                <icon name="mdi:drag-vertical" size="20" class="text-muted" />
              </button>
              <nuxt-link :to="icon.url" class="btn-ghost p-0!" :aria-label="icon.platform" target="_blank">
                <icon :name="icon.logo" size="25" />
              </nuxt-link>
              <button :aria-label="icon.isVisible ? 'Hide' : 'Show'" class="btn-ghost absolute top-1 right-1 p-0!" @click="toggleIconVisibility(icon.id, icon.isVisible)">
                <icon :name="icon.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="20" class="text-muted-foreground" />
              </button>
              <button class="btn-ghost absolute right-1 bottom-1 p-0!" aria-label="Delete" @click="handleDeleteIcon(icon.id)">
                <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
              </button>
            </li>
          </VueDraggable>
        </div>

        <Empty v-if="!mainItems.length" message="Customize your profile by adding links and content." icon-name="mdi:shape" />

        <VueDraggable
          v-else v-model="orderedItems"
          tag="ul" class="flex flex-col gap-2"
          handle=".drag-handle" :animation="150"
          @end="reorderItems"
        >
          <li v-for="item in orderedItems" :key="item.id">
            <div v-if="item.type === 'DIVIDER'" class="navigation-group justify-between rounded-xl border px-3 py-2" :class="{ 'opacity-50': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon name="mdi:minus" size="20" class="text-muted-foreground" />
                <span class="text-xs text-muted-foreground italic">Divider</span>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                :show-edit="false" @toggle="toggleItemVisibility(item.id, item.isVisible)"
                @pin="togglePin(item.id, item.isPinned)"
                @schedule="openSchedule(item)" @delete="handleDeleteItem(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'LINK' && item.link" class="card flex flex-col gap-0.5 py-2!" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                  </button>
                  <icon name="mdi:link-variant" size="20" class="shrink-0 text-muted-foreground" />
                  <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ item.link.label }}</span>
                </div>
                <ProfileItemRowActions
                  :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                  @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                  @schedule="openSchedule(item)" @edit="handleEdit(item)"
                  @delete="handleDeleteItem(item.id)"
                />
              </div>
              <nuxt-link :to="item.link.url" class="truncate pl-8 text-xs text-muted-foreground hover:underline" target="_blank">
                {{ item.link.url }}
              </nuxt-link>
            </div>

            <div v-else-if="item.type === 'WIDGET' && item.widget" class="card navigation-group justify-between py-2!" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group min-w-0">
                <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" />
                <div class="flex min-w-0 flex-col">
                  <div class="navigation-group">
                    <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">{{ WIDGET_LABELS[item.widget.type] }}</span>
                    <icon v-if="item.scheduledStart || item.scheduledEnd" name="mdi:calendar-clock" size="15" class="text-caption-info shrink-0" />
                  </div>
                  <span class="truncate text-xs text-muted-foreground">{{ item.widget.handle }}</span>
                </div>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                @schedule="openSchedule(item)" @edit="handleEdit(item)"
                @delete="handleDeleteItem(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'PHOTO_GRID'" class="card navigation-group justify-between py-2!" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="20" class="text-muted" />
                </button>
                <icon name="mdi:image-multiple-outline" size="20" class="text-muted-foreground" />
                <div class="navigation-group">
                  <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">Photo Grid</span>
                  <icon v-if="item.scheduledStart || item.scheduledEnd" name="mdi:calendar-clock" size="15" class="text-caption-info shrink-0" />
                </div>
              </div>
              <ProfileItemRowActions
                :item="item" :is-scheduled="!!(item.scheduledStart || item.scheduledEnd)"
                @toggle="toggleItemVisibility(item.id, item.isVisible)" @pin="togglePin(item.id, item.isPinned)"
                @schedule="openSchedule(item)" @edit="handleEdit(item)"
                @delete="handleDeleteItem(item.id)"
              />
            </div>
          </li>
        </VueDraggable>

        <!-- Add Row -->
        <div v-if="isPicking" class="flex flex-col gap-3 rounded-2xl border bg-card p-4">
          <p class="text-sm font-medium">
            What do you want to add?
          </p>
          <div class="flex flex-row flex-wrap gap-2">
            <button
              v-for="option in ITEM_TYPES" :key="option.type"
              class="card navigation-group p-2! hover:bg-muted!"
              @click="handlePickType(option.type)"
            >
              <icon :name="option.icon" size="20" />
              <span class="text-sm">{{ option.label }}</span>
            </button>
          </div>
          <div class="flex justify-end">
            <button class="btn-ghost text-sm" @click="isPicking = false">
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
    </div>
  </div>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
  <ProfileWidgetDialog :is-open="isWidgetDialogOpen" @close="closeDialog('widget')" />
  <ProfilePhotoGridDialog :is-open="uiState.dialogs.photoGrid.isOpen" @close="closeDialog('photoGrid')" />
  <ProfileScheduleDialog :is-open="isScheduleDialogOpen" :item="schedulingItem" @close="closeScheduleDialog" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { uiState, isLinkDialogOpen, isIconDialogOpen, isWidgetDialogOpen, openDialog, closeDialog } = useUIState()
const isPicking = ref(false)
const isScheduleDialogOpen = ref(false)
const schedulingItem = ref<ProfileItem | null>(null)
const orderedItems = ref<ProfileItem[]>([])
const orderedIcons = ref<NormalizedIcon[]>([])
const icons = computed<NormalizedIcon[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "ICON" && item.icon).map((item: ProfileItem) => ({
  id: item.id,
  platform: item.icon!.platform ?? "",
  url: item.icon!.url ?? "",
  logo: item.icon!.logo ?? "",
  isVisible: item.isVisible,
  order: item.order,
})).sort((a, b) => a.order - b.order))

const mainItems = computed<ProfileItem[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type !== "ICON").sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

async function handlePickType(type: ProfileItemType) {
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

async function reorderIcons() {
  const updates = orderedIcons.value.map((icon, index) => ({ id: icon.id, order: index })).filter(({ id, order }) => icons.value.find(i => i.id === id)?.order !== order)
  if (!updates.length) {
    return
  }
  await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
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

async function toggleIconVisibility(id: string, current: boolean) {
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

async function handleDeleteItem(id: string) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

async function handleDeleteIcon(id: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

watch(() => icons.value, newIcons => orderedIcons.value = [...newIcons], { immediate: true, deep: true })
watch(() => mainItems.value, newItems => orderedItems.value = [...newItems], { immediate: true, deep: true })
</script>
