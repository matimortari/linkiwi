<template>
  <Dialog :is-open="isLinkDialogOpen" :title="isUpdateMode ? 'Edit Link' : 'Add Link'" @update:is-open="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex max-w-md flex-col gap-2">
        <label for="title" class="text-sm font-medium">Title</label>
        <input id="title" v-model="form.title" type="text" placeholder="Enter link title">
      </div>

      <div class="flex max-w-md flex-col gap-2">
        <label for="url" class="text-sm font-medium">URL</label>
        <input id="url" v-model="form.url" type="url" placeholder="https://example.com">
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img v-if="selectedAsset" :src="selectedAsset.url" alt="Selected link image" class="size-10 shrink-0 rounded-full object-cover">
          <button type="button" class="btn-ghost text-sm" @click="toggleAssetPicker">
            <icon :name="selectedAsset ? 'mdi:image-edit-outline' : 'mdi:image-plus-outline'" size="20" />
            <span>{{ selectedAsset ? "Change image" : "Add image" }}</span>
          </button>
          <button v-if="selectedAsset" type="button" class="btn-ghost p-0! text-xs" @click="removeAsset">
            Remove
          </button>
        </div>

        <template v-if="showAssetPicker">
          <Loading v-if="userStore.loading" />
          <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet. Upload some from the Asset Manager." icon-name="mdi:image-off-outline" />

          <div v-else class="scroll-area flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
            <button
              v-for="asset in userStore.assets" :key="asset.id"
              class="group relative size-10 shrink-0 overflow-hidden rounded-full border-2 transition-all" :class="selectedAsset?.id === asset.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground'"
              @click="selectAsset(asset)"
            >
              <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
              <div v-if="selectedAsset?.id === asset.id" class="absolute inset-0 flex items-center justify-center bg-primary/30">
                <icon name="mdi:check" size="15" class="text-primary-foreground" />
              </div>
            </button>
          </div>
        </template>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button class="btn-success" type="submit">
            Confirm
          </button>
        </div>
      </footer>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const profileItemsStore = useProfileItemsStore()
const userStore = useUserStore()
const { isLinkDialogOpen, selectedLink } = useUIState()
const form = ref({ title: "", url: "" })
const selectedAsset = ref<{ id: string, url: string } | null>(null)
const showAssetPicker = ref(false)
const editingLinkId = ref<string | null>(null)
const isUpdateMode = computed(() => !!editingLinkId.value)

function buildLinkPayload() {
  return {
    label: form.value.title,
    url: form.value.url,
    assetId: selectedAsset.value?.id ?? null,
  }
}

async function toggleAssetPicker() {
  showAssetPicker.value = !showAssetPicker.value
  if (showAssetPicker.value && !userStore.assets.length) {
    await userStore.getAssets()
  }
}

function selectAsset(asset: { id: string, url: string }) {
  selectedAsset.value = { id: asset.id, url: asset.url }
  showAssetPicker.value = false
}

function removeAsset() {
  selectedAsset.value = null
  showAssetPicker.value = false
}

async function handleSubmit() {
  if (!form.value.title || !form.value.url) {
    return
  }

  const link = buildLinkPayload()

  if (isUpdateMode.value && editingLinkId.value) {
    await profileItemsStore.updateItem(editingLinkId.value, { link })
  }
  else {
    await profileItemsStore.createItem({
      type: "LINK",
      isPinned: false,
      isVisible: true,
      link,
    })
  }
  handleCancel()
}

function handleCancel() {
  resetForm()
  emit("close")
}

function resetForm() {
  editingLinkId.value = null
  form.value.title = ""
  form.value.url = ""
  selectedAsset.value = null
  showAssetPicker.value = false
}

watch([() => isLinkDialogOpen.value, () => selectedLink.value], ([open, item]) => {
  if (!open) {
    return
  }

  if (item?.link) {
    editingLinkId.value = item.id
    form.value.title = item.link.label
    form.value.url = item.link.url
    selectedAsset.value = item.link.assetId && item.link.imageUrl
      ? { id: item.link.assetId, url: item.link.imageUrl }
      : null
    showAssetPicker.value = false
  }
  else {
    resetForm()
  }
}, { immediate: true })
</script>
