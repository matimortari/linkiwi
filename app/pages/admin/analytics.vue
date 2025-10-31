<template>
  <div v-if="user" class="flex w-full flex-col gap-4 md:flex-row">
    <div
      v-motion class="card flex-1"
      :initial="{ opacity: 0, x: -20 }" :visible="{ opacity: 1, x: 0 }"
      :duration="800"
    >
      <header class="flex flex-col items-start gap-2 border-b py-4">
        <h2 v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :duration="800">
          Analytics
        </h2>
        <p class="text-caption">
          View your profile analytics.
        </p>
      </header>

      <div class="flex flex-col gap-4 p-2">
        <AnalyticsSummary />
        <AnalyticsClicksByItem />
      </div>
    </div>
  </div>

  <div v-else class="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
    <Spinner v-if="loading" />
    <p class="text-caption text-center" :class="{ 'text-destructive-foreground': errors.getUser || errors.getUserBySlug }">
      {{ errors.getUser || errors.getUserBySlug || 'User not found.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user, loading, errors } = storeToRefs(userStore)

useHead({
  title: "Analytics",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/admin/analytics" }],
  meta: [{ name: "description", content: "LinkNest analytics page." }],
})

definePageMeta({
  layout: "admin",
  middleware: auth,
})
</script>
