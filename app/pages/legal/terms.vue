<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const pageContent = await queryCollection("content").path("/terms-of-service").first()

useHead({
  title: "Terms of Service",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/legal/terms" }],
  meta: [{ name: "description", content: "LinkNest Terms of Service." }],
})

definePageMeta({
  layout: "content",
})
</script>
