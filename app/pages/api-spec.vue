<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const pageContent = await queryCollection("content").path("/api-spec").first()

provide("contentHeaders", useContent({ selector: ".markdown", parseMethod: true }))

useHead({
  title: "API Specification",
  link: [{ rel: "canonical", href: `${baseURL}/api-spec` }],
  meta: [{ name: "description", content: "LinKiosk API Specification." }],
})

definePageMeta({
  layout: "content",
  layoutProps: { parseMethod: true },
})
</script>
