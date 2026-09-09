<template>
  <div v-if="user" class="flex w-full flex-col md:flex-row md:gap-4">
    <div
      v-motion :initial="{ opacity: 0, x: -20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="1000"
      class="min-h-screen w-full max-w-7xl space-y-4 border-b-0! p-4 md:rounded-t-2xl md:border md:p-8"
    >
      <AppearanceOptions />
      <AppearanceThemes />
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

useHead({
  title: "Appearance",
  link: [{ rel: "canonical", href: `${baseURL}/admin/appearance` }],
  meta: [{ name: "description", content: "Customize your LinKiwi profile appearance." }],
})

definePageMeta({ layout: "admin", middleware: "auth" })
</script>
