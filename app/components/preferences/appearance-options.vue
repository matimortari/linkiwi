<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Appearance
    </h3>

    <div class="flex flex-col gap-2">
      <div class="flex flex-col justify-between gap-2 md:flex-row">
        <div class="navigation-group flex-wrap">
          <button
            v-for="t in APPEARANCE_TABS" :key="t.value"
            class="navigation-group justify-start rounded-lg rounded-b-none p-2 text-sm font-semibold transition-all hover:bg-muted/30"
            :class="{ 'border-b-2 border-b-secondary!': activeTab === t.value }" @click="activeTab = t.value"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="navigation-group">
          <button class="btn-danger" @click="handleResetPreferences">
            <icon :name="resetAction.icon.value" size="20" />
            <span>Reset</span>
          </button>
          <button class="btn-primary" @click="handleUpdatePreferences">
            <icon :name="saveAction.icon.value" size="20" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <PreferencesAppearanceTabs v-model:preferences="preferences" v-model:active-tab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const activeTab = ref("background")
const preferences = ref<UserPreferences>({ ...DEFAULT_PREFERENCES })
const localPreferences = useState<UserPreferences | null>("localPreferences", () => null)
const saveAction = createActionHandler("mdi:content-save-check")
const resetAction = createActionHandler("mdi:close")

async function handleUpdatePreferences() {
  await userStore.updatePreferences(preferences.value)
  saveAction.triggerSuccess()
}

async function handleResetPreferences() {
  preferences.value = { ...DEFAULT_PREFERENCES }
  await userStore.updatePreferences(preferences.value)
  resetAction.triggerSuccess()
}

// Watch for changes in user preferences and update local state accordingly
watch(() => user.value?.preferences, (newPrefs) => {
  if (newPrefs) {
    preferences.value = { ...newPrefs }
  }
}, { immediate: true, deep: true })

// Sync local changes to parent's localPreferences for live preview
watch(preferences, newPrefs => localPreferences.value = { ...newPrefs }, { deep: true })
</script>
