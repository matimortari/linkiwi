<template>
  <div class="card flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-2">
        <h5>
          Asset Manager
        </h5>
        <p class="text-caption">
          Images you've uploaded. Used for banners and photo grids.
        </p>
      </div>

      <label class="btn-ghost cursor-pointer text-sm">
        <icon name="mdi:upload" size="20" />
        <span>Upload</span>
        <input
          type="file" class="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif" multiple
          @change="handleUpload"
        >
      </label>
    </div>

    <Loading v-if="userStore.loading" />
    <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet." icon-name="mdi:image-off-outline" />

    <div v-else class="scroll-area grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 md:grid-cols-6">
      <div v-for="asset in userStore.assets" :key="asset.id" class="group relative aspect-square overflow-hidden rounded-xl border">
        <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
        <div class="absolute inset-0 flex flex-col items-end justify-between bg-black/0 p-1 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
          <button class="btn-danger p-1!" aria-label="Delete asset" @click="handleDelete(asset.id)">
            <icon name="mdi:trash-can-outline" size="15" />
          </button>
          <span v-if="asset.label" class="[#eeeeee] w-full truncate rounded-sm bg-black/50 p-1 text-xs">{{ asset.label }}</span>
        </div>
      </div>
    </div>

    <p class="text-xs text-muted-foreground">
      JPEG, PNG, WebP or GIF · max 5 MB per file
    </p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.assets.length) {
    await userStore.getAssets()
  }
})

async function handleUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) {
    return
  }

  await Promise.all(Array.from(files).map(file => userStore.uploadAsset(file)))
  ;(e.target as HTMLInputElement).value = ""
}

async function handleDelete(id: string) {
  if (!confirm("Delete this image? It will be removed from any photo grids or banners using it.")) {
    return
  }
  await userStore.deleteAsset(id)
}
</script>
