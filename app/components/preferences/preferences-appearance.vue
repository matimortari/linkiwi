<template>
  <div v-if="preferences" class="section-container flex flex-col gap-4">
    <header class="my-2 flex flex-col gap-1">
      <h3>
        Appearance
      </h3>
      <p class="text-caption">
        Customize the appearance for your page.
      </p>
    </header>

    <div class="flex flex-col justify-between gap-4 py-2 md:flex-row">
      <div class="flex flex-row flex-wrap items-center gap-1 md:flex-nowrap">
        <button
          v-for="t in tabs" :key="t.value"
          class="btn" :class="{ ' brightness-50': activeTab === t.value }"
          @click="activeTab = t.value"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="flex flex-row flex-wrap items-center gap-1 md:flex-nowrap">
        <button class="btn-primary" @click="handleUpdatePreferences">
          <icon name="mdi:content-save-check" size="20" />
          <span>{{ status === 'saved' ? 'Saved!' : status === 'reset' ? 'Reset!' : 'Save Changes' }}</span>
        </button>
        <button class="btn-danger" @click="handleResetPreferences">
          <icon name="mdi:close" size="20" />
          <span>Reset</span>
        </button>
      </div>
    </div>

    <PreferencesAppearanceBackgroundTab v-if="activeTab === 'background'" v-model:preferences="preferences" />
    <PreferencesAppearanceProfileTab v-if="activeTab === 'user'" v-model:preferences="preferences" />
    <PreferencesAppearanceLinksTab v-if="activeTab === 'links'" v-model:preferences="preferences" />
    <PreferencesAppearanceIconsTab v-if="activeTab === 'icons'" v-model:preferences="preferences" />
    <PreferencesAppearanceThemeTab v-if="activeTab === 'themes'" :preferences="preferences" :set-theme="handleApplyTheme" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

const preferences = ref(userStore.user?.preferences ?? null)
const activeTab = ref("background")
const status = ref<"idle" | "saved" | "reset">("idle")

const tabs = [
  { label: "Background", value: "background" },
  { label: "User Info", value: "user" },
  { label: "Links", value: "links" },
  { label: "Social Icons", value: "icons" },
  { label: "Themes", value: "themes" },
]

function handleApplyTheme(newPreferences: UserPreferences) {
  preferences.value = newPreferences
}

async function handleUpdatePreferences() {
  userStore.errors.updatePreferences = null

  try {
    await userStore.updatePreferences(preferences.value!)
    status.value = "saved"
  }
  catch (err: any) {
    console.error("Failed to update preferences:", err)
    userStore.errors.updatePreferences = err.message
  }
}

async function handleResetPreferences() {
  userStore.errors.updatePreferences = null

  try {
    const defaultPreferences = {
      backgroundType: "FLAT" as const,
      backgroundColor: "#f9f5f2",
      backgroundGradientStart: "#000000",
      backgroundGradientEnd: "#000000",
      profilePictureRadius: "0.5rem",
      profilePictureBorderColor: "#cecfd1",
      profilePictureBorderWidth: "2px",
      slugTextColor: "#111827",
      slugTextWeight: "400",
      slugTextSize: "1rem",
      slugFontFamily: "Roboto, sans-serif",
      headerTextColor: "#1f2937",
      headerTextWeight: "400",
      headerTextSize: "1.1rem",
      headerFontFamily: "Roboto, sans-serif",
      linkBackgroundColor: "#cecfd1",
      linkTextColor: "#374151",
      linkTextWeight: "400",
      linkTextSize: "0.9rem",
      linkFontFamily: "Roboto, sans-serif",
      isLinkShadow: false,
      linkShadowColor: "#9ca3af",
      linkShadowWeight: "medium",
      linkHoverBackgroundColor: "#9ca3af",
      linkBorderRadius: "0.5rem",
      linkPadding: "0.5rem",
      showLinkCopyButton: true,
      iconBackgroundColor: "#cecfd1",
      isIconShadow: false,
      iconShadowColor: "#9ca3af",
      iconShadowWeight: "medium",
      iconLogoColor: "#374151",
      iconHoverBackgroundColor: "#9ca3af",
      supportBanner: "NONE" as const,
    }

    await userStore.updatePreferences(defaultPreferences)
    preferences.value = { ...defaultPreferences }
    status.value = "reset"
  }
  catch (err: any) {
    console.error("Failed to reset preferences:", err)
    userStore.errors.updatePreferences = err.message
  }
}

watch(status, (newStatus, _, onInvalidate) => {
  if (newStatus !== "idle") {
    const timer = setTimeout(() => {
      status.value = "idle"
    }, 2000)
    onInvalidate(() => clearTimeout(timer))
  }
})

watch(() => userStore.user?.preferences, (newPreferences) => {
  if (newPreferences) {
    preferences.value = { ...newPreferences }
  }
}, { immediate: true })
</script>
