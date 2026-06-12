<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      My Profile
    </h3>

    <div class="flex flex-col gap-4">
      <Loading v-if="loading" />

      <template v-else>
        <div class="flex flex-col gap-2 rounded-xl border bg-muted/40 p-3">
          <p class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Social Icons
          </p>
          <ProfileIconList />
        </div>

        <!-- Main item list -->
        <Empty v-if="!mainItems.length" message="Add links, widgets, dividers and photo grids to build your profile." icon-name="mdi:view-list-outline" />

        <VueDraggable
          v-else v-model="orderedItems"
          tag="ul" class="flex flex-col gap-3"
          handle=".drag-handle" :animation="150"
          @end="reorderItems"
        >
          <li v-for="item in orderedItems" :key="item.id">
            <!-- DIVIDER -->
            <div v-if="item.type === 'DIVIDER'" class="card navigation-group justify-between py-2!" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="22" class="text-muted" />
                </button>
                <icon name="mdi:minus" size="18" class="text-muted-foreground" />
                <span class="text-sm text-muted-foreground italic">Divider</span>
              </div>
              <ProfileItemRowActions
                :item-id="item.id" :is-visible="item.isVisible"
                :show-edit="false" @toggle="toggleVisibility(item.id, item.isVisible)"
                @delete="handleDelete(item.id)"
              />
            </div>

            <div v-else-if="item.type === 'LINK' && item.link" class="card flex flex-col gap-1" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="flex items-center justify-between">
                <div class="navigation-group min-w-0">
                  <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                    <icon name="mdi:drag-vertical" size="22" class="text-muted" />
                  </button>
                  <icon name="mdi:link-variant" size="18" class="shrink-0 text-muted-foreground" />
                  <span class="truncate text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">
                    {{ item.link.label }}
                  </span>
                </div>
                <ProfileItemRowActions
                  :item-id="item.id" :is-visible="item.isVisible"
                  @toggle="toggleVisibility(item.id, item.isVisible)" @edit="handleEdit(item)"
                  @delete="handleDelete(item.id)"
                />
              </div>
              <nuxt-link :to="item.link.url" class="text-caption truncate pl-9 text-xs hover:underline" target="_blank">
                {{ item.link.url }}
              </nuxt-link>
            </div>

            <!-- WIDGET -->
            <div v-else-if="item.type === 'WIDGET' && item.widget" class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group min-w-0">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="22" class="text-muted" />
                </button>
                <icon :name="WIDGET_ICONS[item.widget.type]" size="22" class="shrink-0" />
                <div class="flex min-w-0 flex-col">
                  <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">
                    {{ WIDGET_LABELS[item.widget.type] }}
                  </span>
                  <span class="text-caption truncate text-xs">{{ item.widget.handle }}</span>
                </div>
              </div>
              <ProfileItemRowActions
                :item-id="item.id" :is-visible="item.isVisible"
                @toggle="toggleVisibility(item.id, item.isVisible)" @edit="handleEdit(item)"
                @delete="handleDelete(item.id)"
              />
            </div>

            <!-- PHOTO_GRID -->
            <div v-else-if="item.type === 'PHOTO_GRID'" class="card navigation-group justify-between" :class="{ 'border-dashed! opacity-60': !item.isVisible }">
              <div class="navigation-group">
                <button class="drag-handle btn-ghost cursor-move p-0.5!" aria-label="Drag to reorder">
                  <icon name="mdi:drag-vertical" size="22" class="text-muted" />
                </button>
                <icon name="mdi:image-multiple-outline" size="22" class="text-muted-foreground" />
                <span class="text-sm font-semibold" :class="{ 'text-muted-foreground': !item.isVisible }">Photo Grid</span>
              </div>
              <ProfileItemRowActions
                :item-id="item.id" :is-visible="item.isVisible"
                @toggle="toggleVisibility(item.id, item.isVisible)" @edit="() => { /* TODO: open photo grid dialog */ }"
                @delete="handleDelete(item.id)"
              />
            </div>
          </li>
        </VueDraggable>

        <!-- Type picker or add button -->
        <div v-if="isPicking" class="flex flex-col gap-4 rounded-2xl border bg-card p-4">
          <p class="text-sm font-medium">
            What do you want to add?
          </p>
          <div class="flex flex-row flex-wrap gap-2">
            <button v-for="option in ITEM_TYPE_OPTIONS" :key="option.type" class="card navigation-group p-2! hover:bg-muted!" @click="handlePickType(option.type)">
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
          <icon name="mdi:plus" size="25" />
          <span>Add Item</span>
        </button>
      </template>
    </div>
  </div>

  <ProfileLinkDialog :is-open="isLinkDialogOpen" @close="closeDialog('link')" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const ITEM_TYPE_OPTIONS = [
  { type: "LINK", label: "Link", icon: "mdi:link-variant" },
  { type: "WIDGET", label: "Widget", icon: "mdi:shape-outline" },
  { type: "DIVIDER", label: "Divider", icon: "mdi:minus" },
  { type: "PHOTO_GRID", label: "Photo Grid", icon: "mdi:image-multiple-outline" },
] as const

const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
const { uiState, isLinkDialogOpen, openDialog, closeDialog } = useUIState()
const isPicking = ref(false)
const orderedItems = ref<ProfileItem[]>([])
const mainItems = computed<ProfileItem[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type !== "ICON").sort((a, b) => a.order - b.order))

async function handlePickType(type: ProfileItemType) {
  isPicking.value = false

  if (type === "LINK") {
    uiState.dialogs.link.selectedLink = null
    openDialog("link")
    return
  }

  if (type === "WIDGET") {
    // TODO: open widget dialog when created
    return
  }

  if (type === "PHOTO_GRID") {
    // TODO: open photo grid dialog when created
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
    // TODO: open widget dialog when created
  }
}

async function reorderItems() {
  const previousOrder = [...orderedItems.value]
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
    orderedItems.value = previousOrder
    await profileItemsStore.getItems()
  }
}

async function toggleVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

watch(() => mainItems.value, newItems => orderedItems.value = [...newItems], { immediate: true, deep: true })
</script>
