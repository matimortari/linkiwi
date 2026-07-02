<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
      <h4>
        Profile
      </h4>

      <form class="flex flex-col gap-4" @submit.prevent="handleSaveProfile">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="name" class="text-xs font-medium text-muted-foreground">Name</label>
            <input id="name" v-model="profileForm.name" type="text" placeholder="Your name">
          </div>
          <div class="flex flex-col gap-1">
            <label for="slug" class="text-xs font-medium text-muted-foreground">Username</label>
            <input id="slug" v-model="profileForm.slug" type="text" placeholder="your-slug">
          </div>
          <div class="flex flex-col gap-1">
            <label for="location" class="text-xs font-medium text-muted-foreground">Location</label>
            <input id="location" v-model="profileForm.location" type="text" placeholder="City, Country">
          </div>
          <div class="flex flex-col gap-1">
            <label for="description" class="text-xs font-medium text-muted-foreground">Bio</label>
            <input id="description" v-model="profileForm.description" type="text" placeholder="A short bio">
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn-primary text-sm" type="submit">
            <icon :name="profileAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>

    <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
      <h4>
        Profile Customization
      </h4>

      <div class="card flex flex-col gap-4">
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium">Banner</span>
            <p class="text-caption">
              Displayed at the top of your public profile.
            </p>
          </div>
          <div class="navigation-group">
            <label class="btn-ghost shrink-0 cursor-pointer text-sm">
              <icon name="mdi:upload" size="20" />
              <span>{{ bannerPreview ? "Change" : "Upload" }}</span>
              <input
                ref="bannerInput" type="file"
                class="hidden" accept="image/jpeg,image/png,image/webp"
                @change="handleBannerFileChange"
              >
            </label>
            <button v-if="bannerPreview" class="btn-danger" aria-label="Remove banner" @click="handleRemoveBanner">
              <icon name="mdi:close" size="20" />
            </button>
          </div>
        </div>

        <div v-if="bannerPreview" class="overflow-hidden rounded-lg">
          <img :src="bannerPreview" alt="Banner preview" class="h-28 w-full object-cover">
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs text-muted-foreground">JPEG, PNG or WebP · max 5 MB</span>
          <button v-if="bannerFile" class="btn-primary text-sm" @click="handleUploadBanner">
            <icon name="mdi:content-save-check" size="20" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div class="card flex flex-col gap-4">
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium">Guestbook</span>
            <p class="text-caption">
              Allow visitors to leave comments on your profile.
            </p>
          </div>
          <div class="navigation-group">
            <Checkbox id="enableGuestbook" v-model:value="guestbookEnabled" label="Enable" class="max-w-xs" />
            <button class="btn-primary" @click="handleSaveGuestbook">
              <icon :name="guestbookAction.icon.value" size="20" />
              <span>Save</span>
            </button>
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

      <div class="card flex flex-col gap-2">
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
            <label class="btn-ghost shrink-0 cursor-pointer text-sm">
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
            <div v-for="asset in userStore.assets" :key="asset.id" class="group relative aspect-square overflow-hidden rounded-xl border">
              <img :src="asset.url" :alt="asset.label ?? 'Asset'" class="size-full object-cover">
              <div class="absolute inset-0 flex flex-col items-end justify-between bg-black/0 p-1 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                <button class="btn-danger p-1!" aria-label="Delete asset" @click="handleAssetDelete(asset.id)">
                  <icon name="mdi:trash-can-outline" size="15" />
                </button>
                <span v-if="asset.label" class="w-full truncate rounded-sm bg-black/50 p-1 text-xs text-[#eeeeee]">{{ asset.label }}</span>
              </div>
            </div>
          </div>

          <p class="text-xs text-muted-foreground">
            JPEG, PNG, WebP or GIF · max 5 MB per file
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { user, preferences } = storeToRefs(userStore)
const { comments } = storeToRefs(analyticsStore)
const profileForm = ref({ name: "", slug: "", description: "", location: "" })
const profileAction = createActionHandler("mdi:content-save-check")
const bannerInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(user.value?.banner?.url ?? null)
const assetsOpen = ref(false)
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const guestbookAction = createActionHandler("mdi:content-save-check")

async function handleSaveProfile() {
  if (!user.value?.id || !profileForm.value.name || !profileForm.value.slug) {
    return
  }

  await userStore.updateUser({ name: profileForm.value.name, slug: profileForm.value.slug, description: profileForm.value.description, location: profileForm.value.location })
  await userStore.getUser()
  profileAction.triggerSuccess()
}

watch(user, (u) => {
  if (u) {
    profileForm.value = { name: u.name ?? "", slug: u.slug ?? "", description: u.description ?? "", location: u.location ?? "" }
  }
}, { immediate: true })

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
