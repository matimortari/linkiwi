<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useSessionMonitor()

useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", href: "/favicon.svg" }],
  titleTemplate: "%s – LinKiosk",
  meta: [
    { name: "description", content: "Create your own landing page for sharing links to your social media profiles, websites, and more!" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${BASE_URL}/og-image.png` },
    { name: "google-site-verification", content: "ek-IcOQaYofyH-JDVxvCdqxC-Ys0QpMOpKy9FGe3XnQ" },
  ],
})
</script>
