<template>
  <Dialog :is-open="isOpen" title="Edit Banner" @update:is-open="emit('close')">
    <div class="flex w-full flex-col gap-4 md:w-lg">
      <div v-if="cropSrc" class="banner-frame overflow-hidden rounded-xl">
        <img ref="cropImage" :src="cropSrc" alt="Crop banner" class="block max-w-none">
      </div>

      <div v-else class="banner-frame relative overflow-hidden rounded-xl bg-muted">
        <img v-if="previewUrl" :src="previewUrl" alt="Banner preview" class="size-full object-cover">
        <span v-else class="text-caption flex size-full items-center justify-center">No banner selected</span>
      </div>

      <p v-if="isRemoving" class="text-caption-danger">
        Remove your profile banner?
      </p>
      <p v-else class="text-caption">
        {{ cropSrc ? "Drag to reposition, scroll to zoom. Recommended size: 1500 × 500." : "Recommended size: 1500 × 500." }}
      </p>

      <div class="flex flex-wrap items-center gap-2">
        <input
          ref="fileInput" type="file"
          class="hidden" accept="image/jpeg,image/png,image/webp"
          @change="handleFileChange"
        >

        <button type="button" class="btn-ghost" :disabled="isRemoving" @click="fileInput?.click()">
          <icon name="mdi:upload" size="20" />
          <span>{{ cropSrc ? "Choose Another" : "Upload & Crop" }}</span>
        </button>

        <button
          type="button" class="btn-ghost"
          :disabled="isRemoving || (!showLibrary && !userStore.assets.length)"
          @click="toggleLibrary"
        >
          <icon :name="showLibrary ? 'mdi:close' : 'mdi:image-multiple-outline'" size="20" />
          <span>{{ showLibrary ? "Close Library" : "Pick from Library" }}</span>
        </button>

        <button
          v-if="cropSrc || libraryAssetId" type="button"
          class="btn-ghost" :disabled="isRemoving"
          @click="clearDraft"
        >
          <icon name="mdi:image-remove-outline" size="20" />
          <span>Clear</span>
        </button>

        <button
          v-if="!cropSrc && !libraryAssetId && user?.banner" type="button"
          class="btn-ghost" :disabled="isRemoving"
          @click="isRemoving = true"
        >
          <icon name="mdi:trash-can-outline" size="20" class="text-caption-danger" />
          <span>Remove Banner</span>
        </button>
      </div>

      <div v-if="showLibrary" class="scroll-area flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
        <Loading v-if="userStore.loading && !userStore.assets.length" />
        <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet." icon-name="mdi:image-off-outline" />
        <button
          v-for="asset in userStore.assets" :key="asset.id"
          type="button" class="group relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
          :class="selectedAssetId === asset.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground'"
          :disabled="isRemoving" @click="selectAsset(asset)"
        >
          <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
          <div v-if="selectedAssetId === asset.id" class="absolute inset-0 flex items-center justify-center bg-primary/30">
            <icon name="mdi:check" size="15" class="text-primary-foreground" />
          </div>
        </button>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-ghost" @click="handleFooterCancel">
            Cancel
          </button>
          <button v-if="isRemoving" type="button" class="btn-danger" @click="confirmRemoveBanner">
            <icon name="mdi:trash-can-outline" size="20" />
            <span>Remove</span>
          </button>
          <button
            v-else type="button"
            class="btn-success" :disabled="!canSave"
            @click="handleSave"
          >
            <icon :name="saveAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </footer>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type Cropper from "cropperjs"

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const saveAction = useActionIcon("mdi:content-save-check")
const fileInput = ref<HTMLInputElement | null>(null)
const cropImage = ref<HTMLImageElement | null>(null)
const cropper = shallowRef<Cropper | null>(null)
const cropSrc = ref<string | null>(null)
const libraryAssetId = ref<string | null>(null)
const showLibrary = ref(false)
const isRemoving = ref(false)
const libraryPreviewUrl = computed(() => {
  if (!libraryAssetId.value) {
    return null
  }
  return userStore.assets.find(asset => asset.id === libraryAssetId.value)?.url ?? null
})
const previewUrl = computed(() => libraryPreviewUrl.value ?? user.value?.banner?.url ?? null)
const selectedAssetId = computed(() => libraryAssetId.value ?? user.value?.banner?.assetId ?? null)
const canSave = computed(() => !!cropSrc.value || (!!libraryAssetId.value && libraryAssetId.value !== user.value?.banner?.assetId))

function destroyCropper() {
  cropper.value?.destroy()
  cropper.value = null
}

function revokeCropSrc() {
  if (cropSrc.value?.startsWith("blob:")) {
    URL.revokeObjectURL(cropSrc.value)
  }
  cropSrc.value = null
}

function clearCrop() {
  destroyCropper()
  revokeCropSrc()
  if (fileInput.value) {
    fileInput.value.value = ""
  }
}

function clearDraft() {
  clearCrop()
  libraryAssetId.value = null
  isRemoving.value = false
}

function resetState() {
  clearDraft()
  showLibrary.value = false
}

async function initCropper() {
  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  if (!import.meta.client || !cropImage.value || !cropSrc.value) {
    return
  }

  destroyCropper()
  const { default: CropperCtor } = await import("cropperjs")
  cropper.value = new CropperCtor(cropImage.value, {
    template: [
      "<cropper-canvas>",
      "<cropper-image initial-fit=\"cover\" min-fit=\"cover\" scalable translatable></cropper-image>",
      `<cropper-selection initial-coverage="1" aspect-ratio="${1500 / 500}">`,
      "<cropper-grid role=\"grid\" covered></cropper-grid>",
      "</cropper-selection>",
      "<cropper-handle action=\"move\" plain></cropper-handle>",
      "</cropper-canvas>",
    ].join(""),
  })
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  libraryAssetId.value = null
  showLibrary.value = false
  isRemoving.value = false
  destroyCropper()
  revokeCropSrc()
  cropSrc.value = URL.createObjectURL(file)
}

function selectAsset(asset: { id: string, url: string }) {
  showLibrary.value = false
  isRemoving.value = false
  clearCrop()
  libraryAssetId.value = asset.id
}

function toggleLibrary() {
  if (!showLibrary.value && !userStore.assets.length) {
    return
  }
  showLibrary.value = !showLibrary.value
}

function ensureImageCoversCanvas() {
  const image = cropper.value?.getCropperImage()
  const canvasEl = cropper.value?.getCropperCanvas()
  if (!image || !canvasEl) {
    return
  }

  const canvasRect = canvasEl.getBoundingClientRect()
  let imageRect = image.getBoundingClientRect()

  // Zoom in if the image is smaller than the crop area on either axis
  const scale = Math.max(canvasRect.width / Math.max(imageRect.width, 1), canvasRect.height / Math.max(imageRect.height, 1), 1)
  if (scale > 1.0001) {
    image.$scale(scale)
    imageRect = image.getBoundingClientRect()
  }

  // Pull the image back so no empty edges remain in the crop
  let dx = 0
  let dy = 0
  if (imageRect.left > canvasRect.left) {
    dx = canvasRect.left - imageRect.left
  }
  else if (imageRect.right < canvasRect.right) {
    dx = canvasRect.right - imageRect.right
  }
  if (imageRect.top > canvasRect.top) {
    dy = canvasRect.top - imageRect.top
  }
  else if (imageRect.bottom < canvasRect.bottom) {
    dy = canvasRect.bottom - imageRect.bottom
  }
  if (dx || dy) {
    image.$move(dx, dy)
  }
}

async function getCroppedFile(): Promise<File | null> {
  const selection = cropper.value?.getCropperSelection()
  if (!selection) {
    return null
  }

  ensureImageCoversCanvas()
  const canvas = await selection.$toCanvas({ width: 1500, height: 500 })
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      resolve(new File([blob], `banner-${Date.now()}.webp`, { type: "image/webp" }))
    }, "image/webp", 0.92)
  })
}

async function handleSave() {
  if (cropSrc.value) {
    const file = await getCroppedFile()
    if (!file) {
      return
    }

    const uploaded = await userStore.uploadAsset(file)
    if (!uploaded?.newAsset) {
      return
    }
    await userStore.updateUserBanner({ assetId: uploaded.newAsset.id })
  }
  else if (libraryAssetId.value) {
    await userStore.updateUserBanner({ assetId: libraryAssetId.value })
  }
  else {
    return
  }

  saveAction.triggerSuccess()
  resetState()
  emit("close")
}

async function confirmRemoveBanner() {
  if (!user.value?.banner) {
    isRemoving.value = false
    return
  }

  await userStore.deleteUserBanner()
  handleCancel()
}

function handleFooterCancel() {
  if (isRemoving.value) {
    isRemoving.value = false
    return
  }
  handleCancel()
}

function handleCancel() {
  resetState()
  emit("close")
}

// Fetch assets when the dialog opens, reset when it closes
watch(() => props.isOpen, async (open) => {
  if (open) {
    if (!userStore.assets.length) {
      await userStore.getAssets()
    }
    return
  }
  resetState()
})

// Initialize cropper when a new image is selected for cropping
watch(cropSrc, async (src) => {
  if (!src) {
    destroyCropper()
    return
  }

  await nextTick()
  const img = cropImage.value
  if (!img) {
    return
  }

  if (img.complete && img.naturalWidth > 0) {
    await initCropper()
    return
  }

  img.addEventListener("load", () => initCropper(), { once: true })
})

onBeforeUnmount(() => {
  destroyCropper()
  revokeCropSrc()
})
</script>

<style scoped>
.banner-frame {
  aspect-ratio: 3 / 1;
  width: 100%;
  overflow: hidden;
}

.banner-frame :deep(cropper-canvas) {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
