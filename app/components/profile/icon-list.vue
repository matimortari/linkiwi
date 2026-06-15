<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Social Icons
    </h3>

    <div class="flex flex-col gap-4">
      <Loading v-if="loading" />

      <template v-else>
        <Empty v-if="!icons.length" message="Pin quick links to your most important social profiles." icon-name="mdi:star" />

        <VueDraggable
          v-else v-model="orderedIcons"
          tag="ul" class="flex flex-row flex-wrap items-center gap-4"
          handle=".drag-handle" :animation="150"
          @end="reorderIcons"
        >
          <li v-for="icon in orderedIcons" :key="icon.id" class="card relative flex size-20 items-center justify-center" :class="{ 'border-dashed! opacity-60': !icon.isVisible }">
            <button class="drag-handle btn-ghost absolute top-0 left-0 cursor-move p-0.5!" aria-label="Drag to reorder">
              <icon name="mdi:drag-vertical" size="20" class="text-muted" />
            </button>

            <nuxt-link :to="icon.url" class="btn-ghost" :aria-label="icon.platform" target="_blank">
              <icon :name="icon.logo" size="30" />
            </nuxt-link>

            <button :aria-label="icon.isVisible ? 'Hide Icon' : 'Show Icon'" class="btn-ghost absolute top-0 right-0 p-0.5!" @click="toggleVisibility(icon.id, icon.isVisible)">
              <icon :name="icon.isVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="20" class="text-muted-foreground" />
            </button>

            <button class="btn-ghost absolute right-0 bottom-0 p-0.5!" aria-label="Delete Social Icon" @click="handleDelete(icon.id)">
              <icon name="mdi:remove-circle-outline" size="20" class="text-caption-danger" />
            </button>
          </li>
        </VueDraggable>

        <button class="btn-primary self-end" @click="openDialog('icon')">
          <icon name="mdi:plus" size="25" />
          <span>Add Social Icon</span>
        </button>
      </template>
    </div>
  </div>

  <ProfileIconDialog :is-open="isIconDialogOpen" @close="closeDialog('icon')" />
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"

const profileItemsStore = useProfileItemsStore()
const { loading } = storeToRefs(profileItemsStore)
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

async function toggleVisibility(id: string, current: boolean) {
  await profileItemsStore.updateItem(id, { isVisible: !current })
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this social icon?")) {
    return
  }
  await profileItemsStore.deleteItem(id)
}

watch(() => icons.value, newIcons => orderedIcons.value = [...newIcons], { immediate: true, deep: true })
</script>
