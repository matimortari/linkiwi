<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Account Options
    </h4>

    <div class="card flex flex-col gap-4">
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-col gap-2">
          <h5>
            Profile Banner
          </h5>
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

    <PreferencesAssetManager />

    <div class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h5>
          Guestbook
        </h5>
        <p class="text-caption text-xs">
          Allow visitors to leave comments on your profile.
        </p>
      </div>

      <div class="flex items-center justify-between gap-2">
        <PreferencesCheckbox id="enableGuestbook" v-model:value="guestbookEnabled" label="Enable Guestbook" class="max-w-xs" />
        <button class="btn-primary" @click="handleSaveGuestbook">
          <icon :name="guestbookAction.icon.value" size="20" />
          <span>Save</span>
        </button>
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

    <div class="flex items-center justify-between gap-2 rounded-xl border border-danger bg-danger/10 p-4">
      <div class="flex flex-col gap-2">
        <h5>
          Delete Account
        </h5>
        <p class="text-caption-danger text-xs">
          This action is irreversible. All data will be lost.
        </p>
      </div>

      <button class="btn-danger shrink-0" @click="handleDeleteUser">
        <icon name="mdi:user-remove" size="20" />
        <span class="hidden md:inline">Delete</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const { clear } = useUserSession()
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { user, preferences } = storeToRefs(userStore)
const { comments } = storeToRefs(analyticsStore)
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const guestbookAction = createActionHandler("mdi:content-save-check")
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

async function handleDeleteUser() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  await userStore.deleteUser()
  await clear()
  await navigateTo("/", { replace: true })
}

// Sync user data into local form state when store updates
watch(() => user.value, (u) => {
  if (!u) {
    return
  }
  bannerPreview.value = u.banner?.url ?? null
}, { deep: true })

watch(() => preferences.value, (p) => {
  if (!p) {
    return
  }
  guestbookEnabled.value = p.enableGuestbook ?? false
}, { deep: true })

onMounted(async () => await analyticsStore.getComments())
</script>
