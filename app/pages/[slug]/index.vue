<template>
  <nuxt-link to="/" class="hover:scale-sm fixed top-4 left-4 z-50 flex flex-row items-center gap-2 rounded-full transition-all select-none">
    <img src="/assets/logo.png" alt="Logo" width="30">
  </nuxt-link>

  <div v-if="userStore.loading || !user" class="flex min-h-screen flex-col items-center justify-center gap-4 p-12 text-center">
    <Spinner v-if="userStore.loading" />

    <p v-else class="text-lead">
      User {{ slug }} not found.
    </p>
  </div>

  <div v-else class="min-h-screen p-12 pb-28" :style="backgroundStyle">
    <div class="flex flex-col items-center justify-center gap-4 text-center">
      <SupportBanner v-if="user.preferences?.supportBanner && user.preferences.supportBanner !== 'NONE'" :type="user.preferences.supportBanner" />

      <img
        v-if="user.image" :src="user.image"
        alt="Avatar" class="size-24 object-cover"
        :style="profilePictureStyle"
      >

      <p :style="slugStyle">
        {{ `@${user.slug}` }}
      </p>
      <p v-if="user.description" class="max-w-sm truncate leading-4 whitespace-break-spaces" :style="descriptionStyle">
        {{ user.description }}
      </p>

      <ul v-if="user.icons?.length && user.preferences" class="my-2 flex flex-row items-center justify-center gap-2">
        <UserIcon
          v-for="icon in user.icons" :key="icon.id"
          :url="icon.url" :logo="icon.logo"
          :preferences="user.preferences" @click="handleIconClick(icon.id ?? '')"
        />
      </ul>

      <ul v-if="user.links?.length && user.preferences" class="flex flex-col items-center gap-4">
        <UserLink
          v-for="link in user.links" :key="link.id"
          :url="link.url" :title="link.title"
          :preferences="user.preferences" @click="handleLinkClick(link.id ?? '')"
        />
      </ul>

      <p v-else :style="descriptionStyle">
        No links yet.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { analyticsService } from "~/lib/services/analytics-service"

const userStore = useUserStore()
const route = useRoute()
const slug = route.params.slug as string
const { user } = storeToRefs(userStore)
const preferences = computed(() => user.value?.preferences ?? null)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(preferences)

async function handleLinkClick(linkId: string) {
  if (!user.value?.id)
    return

  try {
    await analyticsService.recordLinkClick(user.value.id, linkId)
  }
  catch (err: any) {
    console.error("Failed to track link click:", err)
  }
}

async function handleIconClick(iconId: string) {
  if (!user.value?.id)
    return

  try {
    await analyticsService.recordIconClick(user.value.id, iconId)
  }
  catch (err: any) {
    console.error("Failed to track icon click:", err)
  }
}

watch(() => route.params.slug, async (newSlug) => {
  if (!newSlug)
    return

  try {
    await userStore.getUserBySlug(newSlug as string)

    const currentUser = userStore.user
    if (currentUser?.id) {
      await analyticsService.recordPageView(currentUser.id)

      useHead({
        title: `@${currentUser.slug}`,
        link: [{ rel: "canonical", href: `https://linknest.vercel.app/${currentUser.slug}` }],
        meta: [{ name: "description", content: `@${currentUser.slug} profile on LinkNest.` }],
      })
    }
  }
  catch (error) {
    console.error("Failed to load user profile:", error)
  }
}, { immediate: true })

definePageMeta({
  layout: "fullscreen",
})
</script>
