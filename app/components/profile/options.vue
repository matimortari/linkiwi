<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Profile Options
    </h4>

    <div class="card mx-4 flex flex-col gap-4">
      <div class="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Banner</span>
          <p class="text-caption">
            Displayed at the top of your public profile.
          </p>
        </div>

        <div class="navigation-group shrink-0 self-end md:self-auto">
          <label class="btn-ghost cursor-pointer">
            <icon name="mdi:upload" size="20" />
            <span>{{ bannerPreview ? "Change" : "Upload" }}</span>
            <input
              ref="bannerInput" type="file"
              class="hidden" accept="image/jpeg,image/png,image/webp"
              @change="handleBannerFileChange"
            >
          </label>
          <button v-if="bannerFile" class="btn-primary" @click="handleUploadBanner">
            <icon :name="bannerAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div v-if="!bannerPreview" class="flex h-28 items-center justify-center rounded-lg border-2 border-dashed">
        <span class="text-xs text-muted-foreground">No banner uploaded</span>
      </div>

      <div v-else class="group relative h-28 overflow-hidden rounded-lg">
        <img :src="bannerPreview" alt="Banner preview" class="size-full object-cover">

        <div class="absolute inset-0 flex items-center justify-center bg-muted/30 opacity-0 backdrop-blur-xs transition-all group-hover:opacity-100">
          <button class="btn-ghost" aria-label="Remove banner" @click="handleRemoveBanner">
            <icon name="mdi:trash-can-outline" size="20" />
          </button>
        </div>
      </div>

      <span class="text-xs text-muted-foreground">JPEG, PNG or WebP · max 5 MB</span>
    </div>

    <div class="card mx-4 flex flex-col gap-4">
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

    <div class="card mx-4 flex flex-col gap-4">
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
          <label class="btn-ghost">
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
const { createActionHandler } = useActionIcon()
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { user, preferences } = storeToRefs(userStore)
const { comments } = storeToRefs(analyticsStore)
const bannerInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(user.value?.banner?.url ?? null)
const assetsOpen = ref(false)
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const bannerAction = createActionHandler("mdi:content-save-check")
const guestbookAction = createActionHandler("mdi:content-save-check")

function handleBannerFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }

  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
}

async function handleUploadBanner() {
  if (!bannerFile.value) {
    return
  }

  const uploadedAsset = await userStore.uploadAsset(bannerFile.value)
  if (uploadedAsset?.newAsset) {
    await userStore.updateUserBanner({ url: uploadedAsset.newAsset.url, assetId: uploadedAsset.newAsset.id })
  }
  bannerFile.value = null
  if (bannerInput.value) {
    bannerInput.value.value = ""
  }
}

async function handleRemoveBanner() {
  if (bannerFile.value) {
    bannerFile.value = null
    bannerPreview.value = user.value?.banner?.url ?? null
    if (bannerInput.value) {
      bannerInput.value.value = ""
    }
    return
  }
  if (!user.value?.banner) {
    return
  }
  if (!confirm("Are you sure you want to remove your profile banner?")) {
    return
  }
  await userStore.deleteUserBanner()
  bannerPreview.value = null
  bannerFile.value = null
}

async function handleSaveGuestbook() {
  await userStore.updatePreferences({ enableGuestbook: guestbookEnabled.value })
  guestbookAction.triggerSuccess()
}

async function handleDeleteComment(id: string) {
  if (!confirm("Delete this comment?")) {
    return
  }

  await analyticsStore.deleteComment(id)
}

watch(() => user.value?.banner?.url, (url) => {
  if (!bannerFile.value) {
    bannerPreview.value = url ?? null
  }
})

watch(() => preferences.value?.enableGuestbook, (val) => {
  if (val !== undefined) {
    guestbookEnabled.value = val ?? false
  }
})

async function handleAssetUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) {
    return
  }

  await Promise.all(Array.from(files).map(file => userStore.uploadAsset(file)))
  ;(e.target as HTMLInputElement).value = ""
}

async function handleAssetDelete(id: string) {
  if (!confirm("Delete this image? It will be removed from any photo grids or banners using it.")) {
    return
  }
  await userStore.deleteAsset(id)
}

onMounted(async () => {
  await analyticsStore.getComments()
  if (!userStore.assets.length) {
    await userStore.getAssets()
  }
})
</script>
