<template>
  <div class="flex items-center gap-4 overflow-x-auto px-8 py-4 md:px-16">
    <VueDraggable
      v-model="orderedIcons" tag="ul"
      class="flex min-w-max items-center gap-8" handle=".drag-handle"
      :animation="150" @end="reorderIcons"
    >
      <li v-for="icon in orderedIcons" :key="icon.id" class="relative flex size-12 shrink-0 items-center justify-center rounded-full" :class="{ 'opacity-60': !icon.isVisible }">
        <button type="button" class="drag-handle btn-ghost absolute -top-3 -left-3 cursor-move p-0!" aria-label="Drag to reorder">
          <icon name="mdi:drag-vertical" size="25" class="text-muted" />
        </button>
        <nuxt-link :to="icon.url" class="btn-ghost" :aria-label="icon.platform" target="_blank">
          <icon :name="icon.logo" size="30" />
        </nuxt-link>
        <button type="button" class="btn-ghost absolute -right-3 -bottom-3 p-0!" aria-label="Delete" @click="handleDelete(icon.id)">
          <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
        </button>
      </li>
    </VueDraggable>

    <button type="button" class="btn-ghost" aria-label="Add social icon" @click="openDialog('icon')">
      <icon name="mdi:plus" size="35" class="text-muted-foreground" />
    </button>
  </div>

  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const profileItemsStore = useProfileItemsStore()
const { isIconDialogOpen, openDialog, closeDialog } = useUIState()
const orderedIcons = ref<NormalizedIcon[]>([])

const icons = computed<NormalizedIcon[]>(() => (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "ICON" && item.icon).map((item: ProfileItem) => ({
  id: item.id,
  platform: item.icon!.platform ?? "",
  url: item.icon!.url ?? "",
  logo: item.icon!.logo ?? "",
  isVisible: item.isVisible,
  order: item.order,
})).sort((a, b) => a.order - b.order))

async function reorderIcons() {
  const updates = orderedIcons.value.map((icon, index) => ({ id: icon.id, order: index })).filter(({ id, order }) => icons.value.find(i => i.id === id)?.order !== order)
  if (!updates.length) {
    return
  }
  await Promise.all(updates.map(({ id, order }) => profileItemsStore.updateItem(id, { order })))
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

// Keep local ordered list in sync with icons
watch(() => icons.value, newIcons => orderedIcons.value = [...newIcons], { immediate: true, deep: true })
</script>
