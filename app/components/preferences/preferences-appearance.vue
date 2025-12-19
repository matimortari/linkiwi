<template>
  <div class="card flex flex-col gap-2">
    <h3>
      Appearance
    </h3>

    <div class="flex flex-col justify-between gap-2 border-b py-4 md:flex-row">
      <div class="flex flex-row items-center gap-1">
        <button
          v-for="t in APPEARANCE_TABS" :key="t.value"
          class="btn" :class="{ 'bg-muted!': activeTab === t.value }"
          @click="activeTab = t.value"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="flex flex-row items-center gap-1">
        <button class="btn-danger" @click="handleResetPreferences">
          <icon :name="resetStatus === 'reset' ? 'mdi:check' : 'mdi:close'" size="20" />
          <span>Reset</span>
        </button>
        <button class="btn-primary" @click="handleUpdatePreferences">
          <icon :name="saveStatus === 'saved' ? 'mdi:check' : 'mdi:content-save-check'" size="20" />
          <span class="truncate">Save</span>
        </button>
      </div>
    </div>

    <PreferencesTabs v-model:preferences="preferences" v-model:active-tab="activeTab" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { errors, preferences } = storeToRefs(userStore)
const activeTab = ref("background")
const saveStatus = ref<"idle" | "saved">("idle")
const resetStatus = ref<"idle" | "reset">("idle")

async function handleUpdatePreferences() {
  errors.value.updatePreferences = null

  try {
    await userStore.updatePreferences(preferences.value!)
    saveStatus.value = "saved"
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
    resetStatus.value = "reset"
  }
  catch (err: any) {
    errors.value.updatePreferences = err.data.message
  }
}

function useStatusAutoReset(statusRef: Ref<"idle" | string>) {
  watch(statusRef, (value, _, onInvalidate) => {
    if (value !== "idle") {
      const t = setTimeout(() => (statusRef.value = "idle"), 2000)
      onInvalidate(() => clearTimeout(t))
    }
  })
}

onMounted(() => {
  useStatusAutoReset(saveStatus)
  useStatusAutoReset(resetStatus)
})
</script>
