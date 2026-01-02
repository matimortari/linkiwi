<template>
  <NuxtLayout>
    <Analytics :debug="false" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt"

const { loggedIn } = useUserSession()
let sessionCheckInterval: NodeJS.Timeout | null = null

watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    sessionCheckInterval = setInterval(async () => {
      try {
        await $fetch("/api/auth/validate", { method: "POST", credentials: "include" })
      }
      catch (err: any) {
        if (err.statusCode === 401) {
          await signOut()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }
  else {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval)
      sessionCheckInterval = null
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
  }
})

useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", href: "/favicon.svg" }],
  titleTemplate: "%s - Linkstashr",
  meta: [
    { name: "description", content: "Create your own landing page for sharing links to your social media profiles, websites, and more!" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://linkstashr.vercel.app/og-image.png" },
    { name: "google-site-verification", content: "2j0bcfhh8FCYPpzFylzbiPjl3Pa0X7lMuG060ctsCsA" },
  ],
})
</script>
