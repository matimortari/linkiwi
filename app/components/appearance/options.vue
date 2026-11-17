<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Appearance
    </h4>

    <div class="flex items-center gap-2 px-1 md:mx-4 md:gap-4 md:px-0">
      <div class="scroll-area flex min-w-0 flex-1 gap-1 rounded-full border p-1 max-sm:overflow-visible sm:overflow-x-auto">
        <button
          v-for="t in APPEARANCE_TABS" :key="t.value"
          type="button" class="group/tooltip relative navigation-group flex-1 justify-center rounded-full px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-3"
          :class="activeTab === t.value ? 'bg-primary text-neutral-100' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'" :aria-expanded="openTooltipKey === t.value"
          :aria-label="t.label" @click="handleTabClick(t.value, $event)"
        >
          <icon :name="t.icon" size="20" />
          <span class="max-sm:hidden">{{ t.label }}</span>
          <span class="card pointer-events-none absolute top-full right-0 z-10 -mt-1 w-max p-1! text-xs! font-normal transition-opacity group-hover/tooltip:opacity-100 sm:hidden" :class="openTooltipKey === t.value ? 'opacity-100' : 'opacity-0'">{{ t.label }}</span>
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
const openTooltipKey = ref<string | null>(null)
const openTooltipEl = ref<HTMLElement | null>(null)
useClickOutside(openTooltipEl, () => {
  openTooltipKey.value = null
  openTooltipEl.value = null
}, { escapeKey: true })

function toggleTooltip(key: string, event: MouseEvent) {
  if (openTooltipKey.value === key) {
    openTooltipKey.value = null
    openTooltipEl.value = null
    return
  }

  openTooltipKey.value = key
  openTooltipEl.value = event.currentTarget as HTMLElement
}

function handleTabClick(value: string, event: MouseEvent) {
  activeTab.value = value
  if (import.meta.client && window.matchMedia("(max-width: 639px)").matches) {
    event.stopPropagation()
    toggleTooltip(value, event)
  }
  else {
    openTooltipKey.value = null
    openTooltipEl.value = null
  }
}

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
