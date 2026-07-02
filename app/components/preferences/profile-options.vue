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
            <p class="text-caption text-xs">
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
            <p class="text-caption text-xs">
              Allow visitors to leave comments on your profile.
            </p>
          </div>
          <div class="navigation-group">
            <PreferencesCheckbox id="enableGuestbook" v-model:value="guestbookEnabled" label="Enable" class="max-w-xs" />
            <button class="btn-primary" @click="handleSaveGuestbook">
              <icon :name="guestbookAction.icon.value" size="20" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <template v-if="guestbookEnabled">
          <p v-if="!comments.length" class="text-caption text-xs">
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
                  <span class="text-caption text-xs">{{ formatDate(new Date(comment.createdAt)) }}</span>
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
            <p class="text-caption text-xs">
              Uploaded images for banners, links and photo grids.
            </p>
          </div>
          <icon :name="assetsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="20" class="shrink-0 text-muted-foreground" />
        </button>

        <PreferencesAssetManager v-if="assetsOpen" />
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

// Profile form
const profileForm = ref({ name: "", slug: "", description: "", location: "" })
const profileAction = createActionHandler("mdi:content-save-check")

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

// Banner
const bannerInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(user.value?.banner?.url ?? null)

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

watch(() => user.value?.banner?.url, (url) => {
  if (!bannerFile.value) {
    bannerPreview.value = url ?? null
  }
})

// Assets collapsible
const assetsOpen = ref(false)

// Guestbook
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const guestbookAction = createActionHandler("mdi:content-save-check")

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

watch(() => preferences.value?.enableGuestbook, (val) => {
  if (val !== undefined) {
    guestbookEnabled.value = val ?? false
  }
})

onMounted(async () => await analyticsStore.getComments())
</script>
