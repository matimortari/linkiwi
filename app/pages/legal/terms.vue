<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const pageContent = await queryCollection("content").path("/terms-of-service").first()

useHead({
  title: "Terms of Service",
  link: [{ rel: "canonical", href: `${baseURL}/legal/terms` }],
  meta: [{ name: "description", content: "LinKiosk Terms of Service." }],
})

definePageMeta({
  layout: "content",
})
</script>
