<template>
  <Dialog :is-open="isPhotoGridDialogOpen" :title="isUpdateMode ? 'Edit Photo Grid' : 'Add Photo Grid'" @update:is-open="emit('close')">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Select Photos <span class="text-muted-foreground">(max 9)</span></span>
          <span class="text-xs text-muted-foreground">{{ selected.length }}/9 selected</span>
        </div>

        <Loading v-if="userStore.loading" />
        <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet. Upload some from the Asset Manager." icon-name="mdi:image-off-outline" />

        <div v-else class="scroll-area flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
          <button
            v-for="asset in userStore.assets" :key="asset.id"
            type="button" class="group relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
            :class="isSelected(asset.id) ? 'border-primary' : 'border-transparent hover:border-muted-foreground'"
            :disabled="!isSelected(asset.id) && selected.length >= 9" @click="toggleAsset(asset)"
          >
            <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
            <div v-if="isSelected(asset.id)" class="absolute inset-0 flex items-center justify-center bg-primary/30">
              <span class="text-primary-foreground flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold">
                {{ selectedIndex(asset.id) + 1 }}
              </span>
            </div>
            <div v-else-if="selected.length >= 9" class="absolute inset-0 bg-background/50" />
          </button>
        </div>
      </div>

      <footer class="flex items-center justify-between">
        <span class="text-xs text-muted-foreground">Photos appear in selection order.</span>
        <div class="navigation-group">
          <button type="button" class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button type="button" class="btn-success" :disabled="!selected.length" @click="handleSubmit">
            Confirm
          </button>
        </div>
      </footer>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const profileItemsStore = useProfileItemsStore()
const userStore = useUserStore()
const { isPhotoGridDialogOpen, selectedPhotoGrid } = useUIState()
const selected = ref<{ id: string, url: string }[]>([])
const editingId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingId.value)

function isSelected(id: string) {
  return selected.value.some(a => a.id === id)
}

function selectedIndex(id: string) {
  return selected.value.findIndex(a => a.id === id)
}

function toggleAsset(asset: { id: string, url: string }) {
  if (isSelected(asset.id)) {
    selected.value = selected.value.filter(a => a.id !== asset.id)
  }
  else if (selected.value.length < 9) {
    selected.value.push({ id: asset.id, url: asset.url })
  }
}

function pruneStaleSelection() {
  const assetById = new Map(userStore.assets.map(asset => [asset.id, asset]))
  selected.value = selected.value
    .filter(photo => assetById.has(photo.id))
    .map(photo => ({ id: photo.id, url: assetById.get(photo.id)!.url }))
}

function loadPhotoGrid(item: ProfileItem | null) {
  if (item?.type === "PHOTO_GRID" && item.photoGrid?.photos?.length) {
    editingId.value = item.id
    const assetById = new Map(userStore.assets.map(asset => [asset.id, asset]))
    selected.value = [...item.photoGrid.photos]
      .sort((a, b) => a.order - b.order)
      .filter(photo => !!photo.assetId && (assetById.size === 0 || assetById.has(photo.assetId)))
      .map((photo) => {
        const asset = photo.assetId ? assetById.get(photo.assetId) : undefined
        return { id: photo.assetId!, url: asset?.url ?? photo.url }
      })
    return
  }
  resetForm()
}

async function handleSubmit() {
  pruneStaleSelection()
  if (!selected.value.length) {
    return
  }

  const photoGrid = {
    photos: selected.value.map((a, i) => ({ assetId: a.id, url: a.url, order: i })),
  }

  if (isUpdateMode.value && editingId.value) {
    // Grid may have been removed after its last asset was deleted
    const stillExists = profileItemsStore.items.some(item => item.id === editingId.value)
    if (!stillExists) {
      editingId.value = null
    }
  }

  if (isUpdateMode.value && editingId.value) {
    await profileItemsStore.updateItem(editingId.value, { photoGrid })
  }
  else {
    await profileItemsStore.createItem({
      type: "PHOTO_GRID",
      isPinned: false,
      isVisible: true,
      photoGrid,
    })
  }

  handleCancel()
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  editingId.value = null
  selected.value = []
}

watch(selectedPhotoGrid, (item) => {
  // Prefer the live store copy so deleted assets are already scrubbed
  const fresh = item?.id ? profileItemsStore.items.find(i => i.id === item.id) ?? item : null
  loadPhotoGrid(fresh)
}, { immediate: true })

watch(isPhotoGridDialogOpen, async (open) => {
  if (!open) {
    resetForm()
    return
  }

  await userStore.getAssets()
  const itemId = selectedPhotoGrid.value?.id ?? editingId.value
  const fresh = itemId ? profileItemsStore.items.find(item => item.id === itemId) ?? null : null
  if (fresh) {
    loadPhotoGrid(fresh)
  }
  pruneStaleSelection()
})
</script>
