<template>
  <Dialog :is-open="isPhotoGridDialogOpen" title="Add Photo Grid" @update:is-open="emit('close')">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Select Photos <span class="text-muted-foreground">(max 9)</span></span>
          <span class="text-xs text-muted-foreground">{{ selected.length }}/9 selected</span>
        </div>

        <Loading v-if="userStore.loading" />
        <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet. Upload some from the Asset Manager." icon-name="mdi:image-off-outline" />

        <div v-else class="scroll-area grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
          <button
            v-for="asset in userStore.assets" :key="asset.id"
            class="group relative aspect-square overflow-hidden rounded-xl border-2 transition-all"
            :class="isSelected(asset.id) ? 'border-primary' : 'border-transparent hover:border-muted-foreground'"
            :disabled="!isSelected(asset.id) && selected.length >= 9"
            @click="toggleAsset(asset)"
          >
            <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
            <div v-if="isSelected(asset.id)" class="absolute inset-0 flex items-center justify-center bg-primary/30">
              <span class="[#eeeeee] flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold">
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
          <button class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button class="btn-success" :disabled="!selected.length" @click="handleSubmit">
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
const { isPhotoGridDialogOpen } = useUIState()
const selected = ref<{ id: string, url: string }[]>([])

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

async function handleSubmit() {
  if (!selected.value.length) {
    return
  }

  await profileItemsStore.createItem({
    type: "PHOTO_GRID",
    isPinned: false,
    isVisible: true,
    photoGrid: { photos: selected.value.map((a, i) => ({ assetId: a.id, url: a.url, order: i })) },
  })

  handleCancel()
}

function handleCancel() {
  selected.value = []
  emit("close")
}

watch(isPhotoGridDialogOpen, async (open) => {
  if (open && !userStore.assets.length) {
    await userStore.getAssets()
  }
  if (!open) {
    selected.value = []
  }
})
</script>
