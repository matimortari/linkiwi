<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Account Options
    </h3>

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

<<<<<<< Updated upstream
      <div v-if="bannerPreview" class="overflow-hidden rounded-lg">
        <img :src="bannerPreview" alt="Banner preview" class="h-28 w-full object-cover">
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs text-muted-foreground">JPEG, PNG or WebP · max 5 MB</span>
        <button v-if="bannerFile" class="btn-primary text-sm" @click="handleUploadBanner">
          <icon name="mdi:content-save-check" size="20" />
          <span>Save</span>
||||||| Stash base
      <PreferencesAssetManager />

      <!-- Support Button -->
      <div class="card flex flex-col gap-3">
        <h4>
          Support Button
        </h4>
        <p class="text-caption">
          Let visitors support you via Ko-fi, Buy Me a Coffee, Pix, or a custom link.
        </p>

        <PreferencesCheckbox id="supportEnabled" v-model:value="supportForm.isEnabled" label="Enable support button" class="max-w-xs" />

        <template v-if="supportForm.isEnabled">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Platform</label>
            <div class="flex flex-row flex-wrap gap-2">
              <button
                v-for="opt in SUPPORT_PLATFORM_OPTIONS" :key="opt.value"
                class="card navigation-group p-2! hover:bg-muted!" :class="{ 'bg-muted!': supportForm.platform === opt.value }"
                @click="supportForm.platform = opt.value"
              >
                <icon :name="opt.icon" size="20" />
                <span class="text-sm">{{ opt.label }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="supportUrl" class="text-sm font-medium">URL</label>
            <input id="supportUrl" v-model="supportForm.url" type="url" placeholder="https://ko-fi.com/yourname">
          </div>

          <div class="flex flex-col gap-1">
            <label for="thankYou" class="text-sm font-medium">
              Thank You Message <span class="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="thankYou" v-model="supportForm.thankYouMessage"
              type="text" maxlength="500"
              placeholder="Thank you for your support!"
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Suggested Amounts <span class="text-muted-foreground">(optional, max 5)</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <!-- Fixed: iterate by index, not value -->
              <div v-for="(_, i) in supportForm.suggestedAmounts" :key="i" class="navigation-group rounded-lg border px-2 py-1">
                <span class="text-sm">$</span>
                <input v-model.number="supportForm.suggestedAmounts[i]" type="number" min="1" class="w-14 border-none bg-transparent p-0 text-sm focus:ring-0">
                <button class="btn-ghost p-0.5!" @click="supportForm.suggestedAmounts.splice(i, 1)">
                  <icon name="mdi:close" size="14" class="text-muted-foreground" />
                </button>
              </div>
              <button v-if="supportForm.suggestedAmounts.length < 5" class="btn-ghost text-sm" @click="supportForm.suggestedAmounts.push(5)">
                <icon name="mdi:plus" size="20" />
                Add
              </button>
            </div>
          </div>
        </template>

        <div class="flex justify-end">
          <button class="btn-primary" :disabled="supportLoading" @click="handleSaveSupport">
            <icon :name="supportAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- Guestbook -->
      <div class="card flex flex-col gap-2">
        <h4>Guestbook</h4>
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
          <h5>Comments</h5>
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
        <h4>
          Delete Account
        </h4>
        <p class="text-caption-danger">
          This action is irreversible. All data will be lost.
        </p>

        <button class="btn-danger md:self-end" @click="handleDeleteUser">
          <icon name="mdi:user-remove" size="20" />
          <span>Delete Account</span>
=======
      <PreferencesAssetManager />

      <!-- Guestbook -->
      <div class="card flex flex-col gap-2">
        <h4>Guestbook</h4>
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
          <h5>Comments</h5>
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
        <h4>
          Delete Account
        </h4>
        <p class="text-caption-danger">
          This action is irreversible. All data will be lost.
        </p>

        <button class="btn-danger md:self-end" @click="handleDeleteUser">
          <icon name="mdi:user-remove" size="20" />
          <span>Delete Account</span>
>>>>>>> Stashed changes
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
            <div class="flex justify-between">
              <div class="navigation-group">
                <p class="text-sm font-semibold">
                  {{ comment.name }}
                </p>
                <span v-if="comment.email" class="text-xs text-muted-foreground">({{ comment.email }})</span>
              </div>
              <span class="text-caption text-xs">{{ formatDate(new Date(comment.createdAt)) }}</span>
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
const comments = computed(() => user.value?.comments ?? [])
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
<<<<<<< Updated upstream
||||||| Stash base
  bannerFile.value = null
}

const supportLoading = ref(false)
const supportAction = createActionHandler("mdi:content-save-check")
const supportForm = ref({
  isEnabled: user.value?.supportButton?.isEnabled ?? false,
  platform: user.value?.supportButton?.platform ?? "CUSTOM" as const,
  url: user.value?.supportButton?.url ?? "",
  thankYouMessage: user.value?.supportButton?.thankYouMessage ?? "",
  suggestedAmounts: [...(user.value?.supportButton?.suggestedAmounts ?? [])],
})

async function handleSaveSupport() {
  supportLoading.value = true
  try {
    await userStore.updateSupportButton(supportForm.value)
    supportAction.triggerSuccess()
  }
  finally {
    supportLoading.value = false
  }
}

=======
  bannerFile.value = null
>>>>>>> Stashed changes
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

onMounted(async () => await analyticsStore.getComments())
</script>
