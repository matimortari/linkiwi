<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Appearance
    </h4>

    <div class="flex flex-col gap-4 md:mx-4 md:flex-row md:items-center md:justify-between">
      <div class="navigation-group overflow-x-auto">
        <button
          v-for="t in APPEARANCE_TABS" :key="t.value"
          class="navigation-group justify-start rounded-lg rounded-b-none p-2 text-sm font-semibold whitespace-nowrap transition-all hover:bg-muted/30"
          :class="{ 'border-b-2 border-b-secondary!': activeTab === t.value }" @click="activeTab = t.value"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="navigation-group shrink-0 self-end">
        <button class="btn-danger" @click="handleResetPreferences">
          <icon :name="resetAction.icon.value" size="20" />
          <span>Reset All</span>
        </button>
        <button class="btn-primary" @click="handleUpdatePreferences">
          <icon :name="saveAction.icon.value" size="20" />
          <span>Save</span>
        </button>
      </div>
    </div>

    <AppearanceTabs v-model:preferences="preferences" v-model:active-tab="activeTab" />
  </div>
</template>

<script setup lang="ts">
const { createActionHandler } = useActionIcon()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const activeTab = ref("base")
const preferences = ref<UserPreferences>({ ...DEFAULT_PREFERENCES })
const localPreferences = useState<UserPreferences | null>("localPreferences", () => null)
const saveAction = createActionHandler("mdi:content-save-check")
const resetAction = createActionHandler("mdi:close")

async function handleUpdatePreferences() {
  await userStore.updatePreferences(preferences.value)
  saveAction.triggerSuccess()
}

async function handleResetPreferences() {
  if (!confirm("Are you sure you want to reset all appearance settings to default?")) {
    return
  }

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
