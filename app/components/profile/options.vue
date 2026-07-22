<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Layout Options
    </h4>

    <div class="card flex flex-col gap-4 md:mx-4">
      <div class="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Guestbook</span>
          <p class="text-caption">
            Allow visitors to leave comments on your profile.
          </p>
        </div>

        <div class="navigation-group self-end md:self-auto">
          <label class="inline-flex cursor-pointer items-center gap-2">
            <input
              id="enableGuestbook" v-model="guestbookEnabled"
              type="checkbox" class="peer sr-only"
              @change="handleSaveGuestbook"
            >
            <span class="relative h-6 w-11 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-[#f9fafb] after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
            <span class="text-sm font-medium">{{ guestbookEnabled ? "Enabled" : "Disabled" }}</span>
          </label>
        </div>
      </div>

      <template v-if="guestbookEnabled">
        <p v-if="!comments.length" class="text-caption">
          No comments yet.
        </p>
        <div v-else class="scroll-area flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          <div v-for="comment in comments" :key="comment.id" class="rounded-lg border bg-card p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="navigation-group min-w-0">
                <p class="text-sm font-semibold">
                  {{ comment.name }}
                </p>
                <span v-if="comment.email" class="text-xs text-muted-foreground">({{ comment.email }})</span>
              </div>
              <div class="navigation-group shrink-0">
                <span class="text-caption">{{ formatDate(new Date(comment.createdAt)) }}</span>
                <button class="btn-ghost p-0!" aria-label="Delete comment" @click="handleDeleteComment(comment.id)">
                  <icon name="mdi:delete-outline" size="15" />
                </button>
              </div>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ comment.message }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <div class="card flex flex-col gap-4 md:mx-4">
      <button class="flex w-full items-center justify-between text-left" @click="assetsOpen = !assetsOpen">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Assets</span>
          <p class="text-caption">
            Images you've uploaded. Used for banners, links and photo grids.
          </p>
        </div>
        <icon :name="assetsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="20" class="shrink-0 text-muted-foreground" />
      </button>

      <template v-if="assetsOpen">
        <div class="flex items-center justify-between gap-2">
          <label class="btn-ghost cursor-pointer">
            <icon name="mdi:upload" size="20" />
            <span>Upload</span>
            <input
              type="file" class="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif" multiple
              @change="handleAssetUpload"
            >
          </label>
        </div>

        <Loading v-if="userStore.loading" />
        <Empty v-else-if="!userStore.assets.length" message="No images uploaded yet." icon-name="mdi:image-off-outline" />

        <div v-else class="scroll-area grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 md:grid-cols-6">
          <div v-for="asset in userStore.assets" :key="asset.id" class="flex flex-col gap-1">
            <div class="group relative aspect-square overflow-hidden rounded-xl border">
              <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
              <div class="absolute inset-0 flex items-center justify-center bg-muted/30 opacity-0 backdrop-blur-xs transition-all group-hover:opacity-100">
                <button class="btn-ghost" aria-label="Delete asset" @click="handleAssetDelete(asset.id)">
                  <icon name="mdi:trash-can-outline" size="20" />
                </button>
              </div>
            </div>
            <span v-if="asset.label" class="text-caption truncate">{{ asset.label }}</span>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          JPEG, PNG, WebP or GIF · max 5 MB per file
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const profileItemsStore = useProfileItemsStore()
const analyticsStore = useAnalyticsStore()
const { preferences } = storeToRefs(userStore)
const { comments } = storeToRefs(analyticsStore)
const assetsOpen = ref(false)
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const guestbookAction = useActionIcon("mdi:content-save-check")

async function handleSaveGuestbook() {
  await userStore.updatePreferences({ enableGuestbook: guestbookEnabled.value })
  guestbookAction.triggerSuccess()
}

async function handleDeleteComment(id: string) {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return
  }

  await analyticsStore.deleteComment(id)
}

async function handleAssetUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) {
    return
  }

  await Promise.all(Array.from(files).map(file => userStore.uploadAsset(file)))
  ;(e.target as HTMLInputElement).value = ""
}

async function handleAssetDelete(id: string) {
  if (!confirm("Are you sure you want to delete this image? It will be removed from any photo grids, links, or banners using it.")) {
    return
  }
  await userStore.deleteAsset(id)
  await profileItemsStore.getItems()
}

onMounted(async () => {
  await analyticsStore.getComments()
  if (!userStore.assets.length) {
    await userStore.getAssets()
  }
})

watch(() => preferences.value?.enableGuestbook, (val) => {
  if (val !== undefined) {
    guestbookEnabled.value = val ?? false
  }
})
</script>
