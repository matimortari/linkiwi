<template>
  <div class="flex w-full flex-col gap-4 md:flex-row">
    <div
      v-motion class="card flex-1"
      :initial="{ opacity: 0, x: -20 }" :visible="{ opacity: 1, x: 0 }"
      :duration="800"
    >
      <header class="space-y-2 border-b py-2">
        <h2 v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :duration="800">
          Analytics
        </h2>
        <p class="text-caption">
          View your profile analytics.
        </p>
      </header>

      <div class="flex flex-col gap-4 p-2">
        <AnalyticsSummary />
        <AnalyticsClicksByLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
