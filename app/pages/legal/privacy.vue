<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const pageContent = await queryCollection("content").path("/privacy-policy").first()

useHead({
  title: "Privacy Policy",
  link: [{ rel: "canonical", href: `${BASE_URL}/legal/privacy` }],
  meta: [{ name: "description", content: "LinKiosk Privacy Policy." }],
})

definePageMeta({
  layout: "content",
})
</script>
