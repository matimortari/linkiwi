<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const route = useRoute()
const slug = route.params.slug as string
const pageContent = await queryCollection("content").path(`/${slug === "privacy" ? "privacy-policy" : slug === "terms" ? "terms-of-service" : slug}`).first()

const PAGE_TITLES: Record<string, string> = { privacy: "Privacy Policy", terms: "Terms of Service" }
const PAGE_DESCRIPTIONS: Record<string, string> = { privacy: "Read the privacy policy for LinKiwi.", terms: "Read the terms of service for LinKiwi." }

useHead({
  title: PAGE_TITLES[slug],
  link: [{ rel: "canonical", href: `${baseURL}/legal/${slug}` }],
  meta: [{ name: "description", content: PAGE_DESCRIPTIONS[slug] }],
})

definePageMeta({ layout: "content" })
</script>
