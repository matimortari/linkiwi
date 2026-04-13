<template>
  <div class="card flex flex-col gap-4">
    <h3>
      My Social Icons
    </h3>

    <div class="flex flex-col gap-2">
      <Loading v-if="loading" />
      <Empty v-else-if="!icons.length" message="Your social icons help visitors connect with you. Add your first social icon!" icon-name="mdi:star-minus" />

      <VueDraggable
        v-else v-model="orderedIcons"
        tag="ul" class="navigation-group"
        handle=".drag-handle" :animation="150"
        @end="reorderIcon"
      >
        <li v-for="icon in orderedIcons" :key="icon.id" class="card relative flex size-20 items-center justify-center" :class="{ 'border-dashed! opacity-60': !icon.isVisible }">
          <button class="drag-handle btn-ghost absolute top-0 left-0 cursor-move p-0.5!" aria-label="Drag to reorder">
            <icon name="mdi:drag-vertical" size="20" class="text-muted" />
          </button>

          <nuxt-link :to="icon.url" class="btn-ghost" :aria-label="icon.platform">
            <icon :name="icon.logo" :size="30" />
          </nuxt-link>

          <button :aria-label="icon.isVisible ? 'Hide Icon' : 'Show Icon'" class="btn-ghost absolute top-0 right-0 flex items-center p-0.5!" @click="toggleVisibility(icon.id!, icon.isVisible ?? true)">
            <icon :name="icon.isVisible !== false ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="25" class="text-muted-foreground" />
          </button>

          <button class="btn-ghost absolute right-0 bottom-0 flex items-center p-0.5!" aria-label="Delete Social Icon" @click="handleDeleteIcon(icon.id!)">
            <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
          </button>
        </li>
      </VueDraggable>

      <button class="btn-primary self-end" @click="openDialog('icon')">
        <icon name="mdi:star-plus" size="25" />
        <span>Add Social Icon</span>
      </button>
    </div>
  </div>

  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const iconStore = useIconsStore()
const { icons, loading } = storeToRefs(iconStore)
const { isIconDialogOpen, openDialog, closeDialog } = useUIState()
const orderedIcons = ref<Icon[]>([])

async function reorderIcon() {
  const previousOrder = [...orderedIcons.value]
  const updates = orderedIcons.value.map((icon, index) => ({ id: icon.id!, order: index })).filter(({ id, order }) => {
    const existing = icons.value.find(icon => icon.id === id)
    return existing?.order !== order
  })

  if (!updates.length) {
    return
  }

  const results = await Promise.all(updates.map(({ id, order }) => iconStore.updateIcon(id, { order })))
  if (results.every(Boolean)) {
    iconStore.icons.sort((a, b) => a.order - b.order)
  }
  else {
    orderedIcons.value = previousOrder
    await iconStore.getIcons()
  }
}

async function handleDeleteIcon(iconId: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }

  await iconStore.deleteIcon(iconId)
}

async function toggleVisibility(iconId: string, currentVisibility: boolean) {
  await iconStore.updateIcon(iconId, { isVisible: !currentVisibility })
}

// Sync store icons to local orderedIcons
watch(() => icons.value, (newIcons) => {
  orderedIcons.value = [...newIcons]
}, { immediate: true, deep: true })
</script>
