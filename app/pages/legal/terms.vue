<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const pageContent = await queryCollection("content").path("/terms-of-service").first()

useHead({
  title: "Terms of Service",
  link: [{ rel: "canonical", href: "https://alllinks-bio.vercel.app/legal/terms" }],
  meta: [{ name: "description", content: "AllLinks Terms of Service." }],
})

definePageMeta({
  layout: "content",
})
</script>
