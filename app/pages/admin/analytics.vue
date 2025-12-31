<template>
  <div v-if="user" class="flex w-full flex-col gap-4 md:flex-row">
    <div
      v-motion :initial="{ opacity: 0, x: -20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="800"
      class="min-h-screen w-full space-y-4 border-r-0! border-b-0! p-4 md:rounded-tl-2xl md:border"
    >
      <header class="flex flex-col gap-2">
        <h2 v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :duration="800">
          Analytics
        </h2>
        <p class="text-caption">
          View your profile analytics.
        </p>
      </header>

      <div class="flex flex-col gap-4">
        <AnalyticsSummary />
        <AnalyticsClicksByItem />
      </div>
    </div>
  </div>

  <div v-else class="flex h-[calc(100vh-8rem)] w-full items-center justify-center text-center">
    <Spinner v-if="loading" />
    <p class="text-caption" :class="{ 'text-danger!': errors.getUser || errors.getUserProfile }">
      {{ errors.getUser || errors.getUserProfile }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { user, loading, errors } = storeToRefs(useUserStore())

useHead({
  title: "Analytics",
  link: [{ rel: "canonical", href: "https://linkstashr.vercel.app/admin/analytics" }],
  meta: [{ name: "description", content: "Linkstashr analytics page." }],
})

definePageMeta({
  layout: "admin",
  middleware: auth,
})
</script>
