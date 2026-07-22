<template>
  <Dialog :is-open="isOpen" title="Edit Banner" @update:is-open="emit('close')">
    <div class="flex flex-col gap-4">
      <div v-if="cropSrc" class="flex flex-col gap-2">
        <div class="banner-cropper overflow-hidden rounded-xl bg-muted">
          <img ref="cropImage" :src="cropSrc" alt="Crop banner" class="block max-w-none">
        </div>
        <div class="flex justify-end">
          <button type="button" class="btn-ghost" @click="clearCropSource">
            <icon name="mdi:close" size="20" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div v-else class="relative h-28 w-full overflow-hidden rounded-xl bg-muted md:h-36">
        <img v-if="previewUrl" :src="previewUrl" alt="Banner preview" class="size-full object-cover">
        <span v-else class="text-caption flex size-full items-center justify-center">No banner selected</span>
      </div>

      <p class="text-caption">
        {{ cropSrc ? "Drag to reposition. " : "" }}Recommended size: 1500 x 500.
      </p>

      <div class="flex flex-wrap items-center gap-2">
        <input
          ref="fileInput" type="file"
          class="hidden" accept="image/jpeg,image/png,image/webp"
          @change="handleFileChange"
        >
        <button type="button" class="btn-ghost" @click="fileInput?.click()">
          <icon name="mdi:upload" size="20" />
          <span>Upload & Crop</span>
        </button>

        <button type="button" class="btn-ghost" :disabled="!showLibrary && !userStore.assets.length" @click="toggleLibrary">
          <icon :name="showLibrary ? 'mdi:close' : 'mdi:image-multiple-outline'" size="20" />
          <span>{{ showLibrary ? "Close Library" : "Pick from Library" }}</span>
        </button>

        <button v-if="user?.banner || pendingAsset" type="button" class="btn-ghost text-danger-foreground!" @click="handleRemove">
          <icon name="mdi:trash-can-outline" size="20" />
          <span>{{ pendingAsset ? "Clear Selection" : "Remove Banner" }}</span>
        </button>
      </div>

      <div v-if="showLibrary" class="scroll-area flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
        <Loading v-if="userStore.loading && !userStore.assets.length" />
        <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet." icon-name="mdi:image-off-outline" />
        <button
          v-for="asset in userStore.assets" :key="asset.id"
          type="button" class="group relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
          :class="(pendingAsset?.id ?? user?.banner?.assetId) === asset.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground'"
          @click="selectAsset(asset)"
        >
          <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
          <div v-if="(pendingAsset?.id ?? user?.banner?.assetId) === asset.id" class="absolute inset-0 flex items-center justify-center bg-primary/30">
            <icon name="mdi:check" size="15" class="text-primary-foreground" />
          </div>
        </button>
      </div>

      <footer class="flex flex-row items-center justify-end">
        <div class="navigation-group">
          <button type="button" class="btn-danger" @click="handleCancel">
            Cancel
          </button>
          <button type="button" class="btn-success" :disabled="!canSave" @click="handleSave">
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
const pendingAsset = ref<{ id: string, url: string } | null>(null)
const showLibrary = ref(false)
const previewUrl = computed(() => pendingAsset.value?.url ?? user.value?.banner?.url ?? null)
const canSave = computed(() => !!cropSrc.value || !!pendingAsset.value)

async function initCropper() {
  await nextTick()
  if (!import.meta.client || !cropImage.value) {
    return
  }

  destroyCropper()
  const { default: CropperCtor } = await import("cropperjs")
  cropper.value = new CropperCtor(cropImage.value, {
    template: [
      "<cropper-canvas background>",
      "<cropper-image initial-center-size=\"cover\" zoomable></cropper-image>",
      "<cropper-shade></cropper-shade>",
      "<cropper-selection initial-coverage=\"1\" aspect-ratio=\"3/1\" movable resizable>",
      "<cropper-grid role=\"grid\" covered></cropper-grid>",
      "<cropper-crosshair centered></cropper-crosshair>",
      "<cropper-handle action=\"move\" theme-color=\"rgba(255, 255, 255, 0.35)\"></cropper-handle>",
      "<cropper-handle action=\"n-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"e-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"s-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"w-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"ne-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"nw-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"se-resize\" plain></cropper-handle>",
      "<cropper-handle action=\"sw-resize\" plain></cropper-handle>",
      "</cropper-selection>",
      "</cropper-canvas>",
    ].join(""),
  })

  const canvas = cropper.value.getCropperCanvas()
  const image = cropper.value.getCropperImage()
  const selection = cropper.value.getCropperSelection()
  if (!canvas || !image || !selection) {
    return
  }

  image.addEventListener("transform", (event) => {
    const e = event as CustomEvent<{ matrix: number[] }>
    const canvasRect = canvas.getBoundingClientRect()
    const clone = image.cloneNode() as HTMLElement
    clone.style.cssText = `opacity:0;position:absolute;transform:matrix(${e.detail.matrix.join(",")})`
    canvas.appendChild(clone)
    const imageRect = clone.getBoundingClientRect()
    canvas.removeChild(clone)

    if (imageRect.top > canvasRect.top || imageRect.right < canvasRect.right || imageRect.bottom < canvasRect.bottom || imageRect.left > canvasRect.left) {
      e.preventDefault()
    }
  })

  selection.addEventListener("change", (event) => {
    const e = event as CustomEvent<{ x: number, y: number, width: number, height: number }>
    const { x, y, width, height } = e.detail
    const canvasWidth = canvas.offsetWidth
    const canvasHeight = canvas.offsetHeight
    const minWidth = canvasWidth * 0.25
    const minHeight = canvasHeight * 0.25
    if (x < 0 || y < 0 || x + width > canvasWidth || y + height > canvasHeight || width < minWidth || height < minHeight) {
      e.preventDefault()
    }
  })
}

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

function clearCropSource() {
  destroyCropper()
  revokeCropSrc()
  if (fileInput.value) {
    fileInput.value.value = ""
  }
}

function resetState() {
  clearCropSource()
  pendingAsset.value = null
  showLibrary.value = false
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  pendingAsset.value = null
  showLibrary.value = false
  destroyCropper()
  revokeCropSrc()
  cropSrc.value = URL.createObjectURL(file)
}

function selectAsset(asset: { id: string, url: string }) {
  clearCropSource()
  if (user.value?.banner?.assetId === asset.id) {
    pendingAsset.value = null
    return
  }
  pendingAsset.value = { id: asset.id, url: asset.url }
}

async function toggleLibrary() {
  if (!showLibrary.value && !userStore.assets.length) {
    return
  }
  showLibrary.value = !showLibrary.value
}

async function getCroppedFile(): Promise<File | null> {
  const selection = cropper.value?.getCropperSelection()
  if (!selection) {
    return null
  }

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
    if (uploaded?.newAsset) {
      await userStore.updateUserBanner({ url: uploaded.newAsset.url, assetId: uploaded.newAsset.id })
      saveAction.triggerSuccess()
      resetState()
      emit("close")
    }
    return
  }

  if (pendingAsset.value) {
    await userStore.updateUserBanner({ url: pendingAsset.value.url, assetId: pendingAsset.value.id })
    saveAction.triggerSuccess()
    resetState()
    emit("close")
  }
}

async function handleRemove() {
  if (pendingAsset.value || cropSrc.value) {
    clearCropSource()
    pendingAsset.value = null
    return
  }

  if (!user.value?.banner) {
    return
  }
  if (!confirm("Are you sure you want to remove your profile banner?")) {
    return
  }

  await userStore.deleteUserBanner()
  handleCancel()
}

function handleCancel() {
  resetState()
  emit("close")
}

watch(() => props.isOpen, async (open) => {
  if (open) {
    if (!userStore.assets.length) {
      await userStore.getAssets()
    }
    return
  }
  resetState()
})

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
  if (img.complete) {
    await initCropper()
  }
  else {
    img.addEventListener("load", () => initCropper(), { once: true })
  }
})

onBeforeUnmount(() => {
  destroyCropper()
  revokeCropSrc()
})
</script>

<style scoped>
.banner-cropper {
  aspect-ratio: 3 / 1;
  width: 100%;
}

.banner-cropper :deep(cropper-canvas) {
  width: 100%;
  height: 100%;
}
</style>
