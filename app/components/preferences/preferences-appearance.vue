<template>
  <div v-if="preferences" class="card flex flex-col gap-4">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        Appearance
      </h3>
      <p class="text-caption">
        Customize the appearance for your page.
      </p>
    </header>

    <div class="flex flex-col justify-between gap-4 border-b py-4 md:flex-row">
      <div class="flex flex-row flex-wrap items-center gap-1 md:flex-nowrap">
        <button
          v-for="t in APPEARANCE_TABS" :key="t.value"
          class="btn" :class="{ 'brightness-80': activeTab === t.value }"
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
    <PreferencesAppearanceThemeTab v-if="activeTab === 'themes'" :preferences="preferences" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { errors, preferences } = storeToRefs(userStore)
const activeTab = ref("background")
const status = ref<"idle" | "saved" | "reset">("idle")

async function handleUpdatePreferences() {
  errors.value.updatePreferences = null

  try {
    await userStore.updatePreferences(preferences.value!)
    status.value = "saved"
  }
  catch (err: any) {
    errors.value.updatePreferences = err.data.message
  }
}

async function handleResetPreferences() {
  errors.value.updatePreferences = null

  try {
    await userStore.updatePreferences(DEFAULT_PREFERENCES)
    Object.assign(preferences.value, DEFAULT_PREFERENCES)
    status.value = "reset"
  }
  catch (err: any) {
    errors.value.updatePreferences = err.data.message
  }
}

watch(status, (newStatus, _oldStatus, onInvalidate) => {
  if (newStatus !== "idle") {
    const timer = setTimeout(() => {
      status.value = "idle"
    }, 2000)
    onInvalidate(() => clearTimeout(timer))
  }
})
</script>
