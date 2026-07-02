<template>
  <div v-if="user" class="flex w-full flex-col md:flex-row">
    <div
      v-motion :initial="{ opacity: 0, x: -20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="800"
      class="min-h-screen w-full space-y-4 border-b-0! p-4 md:w-2/3 md:rounded-t-2xl md:border"
    >
      <header class="flex flex-col gap-2">
        <h3>
          Appearance
        </h3>
        <p class="text-caption">
          Customize how your public profile looks.
        </p>
      </header>

      <PreferencesAppearanceOptions />
      <PreferencesThemeTab :preferences="themePreferences" @update:preferences="handleThemeApply" />
    </div>

    <Preview />
  </div>

  <div v-else class="flex h-[calc(100vh-8rem)] w-full items-center justify-center text-center">
    <Loading v-if="loading" />
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const userStore = useUserStore()
const { user, loading } = storeToRefs(userStore)

const themePreferences = computed(() => user.value?.preferences ?? DEFAULT_PREFERENCES)

async function handleThemeApply(prefs: UserPreferences) {
  await userStore.updatePreferences(prefs)
}

useHead({
  title: "Appearance",
  link: [{ rel: "canonical", href: `${baseURL}/admin/appearance` }],
  meta: [{ name: "description", content: "Customize your LinKiwi profile appearance." }],
})

definePageMeta({ layout: "admin", middleware: "auth" })
</script>
