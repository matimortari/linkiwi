<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Account Options
    </h3>

    <div class="flex flex-col gap-4">
      <div class="card flex flex-col gap-2">
        <h4>
          Profile Banner
        </h4>
        <p class="text-caption">
          Upload a banner image to display at the top of your profile.
        </p>

        <div v-if="bannerPreview" class="relative overflow-hidden rounded-xl">
          <img :src="bannerPreview" alt="Profile banner preview" class="h-32 w-full object-cover">
          <button class="btn-danger absolute top-2 right-2 p-1!" aria-label="Remove banner" @click="handleRemoveBanner">
            <icon name="mdi:close" size="20" />
          </button>
        </div>

        <div class="navigation-group">
          <label class="btn-ghost cursor-pointer text-sm">
            <icon name="mdi:upload" size="20" />
            <span>{{ bannerPreview ? "Change Image" : "Upload Image" }}</span>
            <input
              ref="bannerInput" type="file"
              class="hidden" accept="image/jpeg,image/png,image/webp"
              @change="handleBannerFileChange"
            >
          </label>
          <span class="text-xs text-muted-foreground">JPEG, PNG or WebP · max 5 MB</span>
        </div>

        <div v-if="bannerFile" class="flex justify-end">
          <button class="btn-primary" :disabled="bannerLoading" @click="handleUploadBanner">
            <icon :name="bannerLoading ? 'mdi:loading' : 'mdi:content-save-check'" size="20" :class="{ 'animate-spin': bannerLoading }" />
            <span>Save Banner</span>
          </button>
        </div>
      </div>

      <PreferencesAssetManager />

      <div class="card flex flex-col gap-2">
        <h4>
          Guestbook
        </h4>
        <p class="text-caption">
          Allow visitors to leave comments on your profile page.
        </p>

        <div class="flex items-center justify-between gap-2">
          <PreferencesCheckbox id="enableGuestbook" v-model:value="guestbookEnabled" label="Enable Guestbook" class="max-w-xs" />
          <button class="btn-primary" @click="handleSaveGuestbook">
            <icon :name="guestbookAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>

        <div v-if="guestbookEnabled" class="card flex flex-col gap-2">
          <h5>
            Comments
          </h5>
          <p v-if="!comments.length" class="text-caption">
            No comments yet.
          </p>

          <div v-else class="scroll-area flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            <div v-for="comment in comments" :key="comment.id" class="card flex flex-col">
              <div class="flex justify-between">
                <div class="flex items-center gap-1">
                  <p class="font-semibold">
                    {{ comment.name }}
                  </p>
                  <span v-if="comment.email" class="text-xs text-muted-foreground">({{ comment.email }})</span>
                </div>
                <span class="text-caption">{{ formatDate(new Date(comment.createdAt)) }}</span>
              </div>
              <p class="text-sm text-muted-foreground">
                {{ comment.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card flex flex-col gap-2">
        <h4>Delete Account</h4>
        <p class="text-caption-danger">
          This action is irreversible. All data will be lost.
        </p>
        <button class="btn-danger md:self-end" @click="handleDeleteUser">
          <icon name="mdi:user-remove" size="20" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const { clear } = useUserSession()
const userStore = useUserStore()
const assetsStore = useAssetsStore()
const { user, preferences } = storeToRefs(userStore)
const comments = computed(() => user.value?.comments ?? [])
const guestbookEnabled = ref(preferences.value?.enableGuestbook ?? false)
const guestbookAction = createActionHandler("mdi:content-save-check")
const bannerLoading = ref(false)
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
  bannerLoading.value = true

  try {
    const uploadedAsset = await assetsStore.uploadAsset(bannerFile.value)
    if (uploadedAsset?.newAsset) {
      await userStore.updateUserBanner({ url: uploadedAsset.newAsset.url, assetId: uploadedAsset.newAsset.id })
    }
    bannerFile.value = null
    if (bannerInput.value) {
      bannerInput.value.value = ""
    }
  }
  finally {
    bannerLoading.value = false
  }
}

async function handleRemoveBanner() {
  bannerPreview.value = null
  bannerFile.value = null
}

async function handleSaveGuestbook() {
  await userStore.updatePreferences({ enableGuestbook: guestbookEnabled.value })
  guestbookAction.triggerSuccess()
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
</script>
