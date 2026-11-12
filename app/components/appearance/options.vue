<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <div class="flex flex-wrap items-center gap-2 md:gap-4">
      <h4 class="w-full">
        Appearance
      </h4>

      <div class="scroll-area flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-full border p-1">
        <button
          v-for="t in APPEARANCE_TABS" :key="t.value"
          type="button" class="navigation-group flex-1 justify-center rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
          :class="activeTab === t.value ? 'bg-primary text-neutral-100' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'" @click="activeTab = t.value"
        >
          <icon :name="t.icon" size="18" />
          <span>{{ t.label }}</span>
        </button>
      </div>

      <button type="button" class="btn-primary shrink-0" @click="handleUpdatePreferences">
        <icon :name="saveAction.icon.value" size="20" />
        <span>Save</span>
      </button>
    </div>

    <AppearanceTabs v-model:preferences="preferences" v-model:active-tab="activeTab" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const activeTab = ref("base")
const preferences = ref<UserPreferences>({ ...DEFAULT_PREFERENCES })
const localPreferences = useState<UserPreferences | null>("localPreferences", () => null)
const saveAction = useActionIcon("mdi:content-save-check")

async function handleUpdatePreferences() {
  await userStore.updatePreferences(preferences.value)
  saveAction.triggerSuccess()
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
