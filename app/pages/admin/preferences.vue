<template>
  <div v-if="user" class="flex w-full flex-col md:flex-row">
    <div
      v-motion :initial="{ opacity: 0, x: -20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="800"
      class="min-h-screen w-full space-y-4 border-b-0! p-4 md:w-2/3 md:rounded-t-2xl md:border"
    >
      <header class="flex flex-col gap-2">
        <h2 v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :duration="800">
          Preferences
        </h2>
        <p class="text-caption">
          Manage your profile.
        </p>
      </header>

      <div class="flex flex-col gap-4">
        <PreferencesAppearance />
        <PreferencesAccount />
      </div>
    </div>

    <Preview />
  </div>

  <div v-else class="flex h-[calc(100vh-8rem)] w-full items-center justify-center text-center">
    <Loading v-if="loading" />
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const { user, loading } = storeToRefs(useUserStore())

const localPreferences = ref<UserPreferences | null>(null)
provide("localPreferences", localPreferences)

// Watch user preferences and sync to local ref
watch(() => user.value?.preferences, (newPrefs) => {
  if (newPrefs) {
    localPreferences.value = { ...newPrefs }
  }
}, { immediate: true, deep: true })

useHead({
  title: "Preferences",
  link: [{ rel: "canonical", href: `${baseURL}/admin/preferences` }],
  meta: [{ name: "description", content: "LinKiosk preferences page." }],
})

definePageMeta({
  layout: "admin",
  middleware: "auth",
})
</script>
