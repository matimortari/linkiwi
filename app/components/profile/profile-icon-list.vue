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
        @end="handleReorderIcon"
      >
        <li v-for="icon in orderedIcons" :key="icon.id" class="card relative flex size-20 items-center justify-center">
          <button class="drag-handle btn-ghost absolute top-0 left-0 cursor-move p-0.5!" aria-label="Drag to reorder">
            <icon name="mdi:drag-vertical" size="20" class="text-muted" />
          </button>

          <nuxt-link :to="icon.url" class="btn-ghost">
            <icon :name="icon.logo" :size="30" />
          </nuxt-link>

          <button class="btn-ghost absolute right-0 bottom-0 flex items-center p-0.5!" aria-label="Delete Social Icon" @click="handleDeleteIcon(icon.id!)">
            <icon name="mdi:remove-circle-outline" size="25" class="text-danger" />
          </button>
        </li>
      </VueDraggable>

      <button class="btn-primary self-end" aria-label="Add Social Icon" @click="isDialogOpen = true">
        <icon name="mdi:star-plus" size="25" />
        <span>Add Social Icon</span>
      </button>
    </div>
  </div>

  <ProfileIconDialog :is-open="isDialogOpen" @close=" isDialogOpen = false" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const iconStore = useIconsStore()
const { icons, loading } = storeToRefs(iconStore)
const isDialogOpen = ref(false)
const orderedIcons = ref<Icon[]>([])

async function handleReorderIcon() {
  const updates = orderedIcons.value.map((icon, index) => ({ id: icon.id!, order: index }))
  for (const { id, order } of updates) {
    try {
      await iconStore.updateIcon(id, { order })
    }
    catch (error) {
      console.error(`Failed to update order for icon ${id}:`, error)
    }
  }
}

async function handleDeleteIcon(iconId: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }

  await iconStore.deleteIcon(iconId)
}

// Sync store icons to local orderedIcons
watch(icons, (newIcons) => {
  orderedIcons.value = [...newIcons]
}, { immediate: true })
</script>
