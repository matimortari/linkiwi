<template>
  <div class="relative flex min-h-screen items-center justify-center">
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Spinner />
    </div>

    <p v-if="!loading && !user" class="text-lead text-center">
      User {{ slug }} not found.
    </p>

    <div v-else-if="user" class="flex min-h-screen w-full flex-col items-center gap-4 py-24 text-center" :style="backgroundStyle">
      <SupportBanner v-if="preferences?.supportBanner && preferences.supportBanner !== 'NONE'" :type="preferences.supportBanner" />

      <img
        v-if="user.image" :src="user.image"
        alt="Avatar" class="size-24 object-cover"
        :style="profilePictureStyle"
      >

      <p :style="slugStyle">
        {{ `@${user.slug}` }}
      </p>

      <p class="max-w-sm leading-4 whitespace-break-spaces" :style="descriptionStyle">
        {{ user.description }}
      </p>

      <ul v-if="user.icons?.length" class="my-2 flex flex-row items-center justify-center gap-2">
        <UserIcon
          v-for="icon in user.icons" :key="icon.id"
          :item="icon" :preferences="preferences"
          @click="handleIconClick(icon.id ?? '')"
        />
      </ul>

      <ul v-if="user.links?.length" class="flex w-full flex-col items-center gap-4">
        <UserLink
          v-for="link in user.links" :key="link.id"
          :item="link" :preferences="preferences"
          @click="handleLinkClick(link.id ?? '')"
        />
      </ul>

      <p v-else :style="descriptionStyle">
        No links yet.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { user, loading, preferences } = storeToRefs(userStore)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle }
  = useDynamicStyles(preferences)

async function handleLinkClick(linkId: string) {
  if (user.value?.id) {
    await analyticsStore.recordLinkClick(user.value.id, linkId)
  }
}

async function handleIconClick(iconId: string) {
  if (user.value?.id) {
    await analyticsStore.recordIconClick(user.value.id, iconId)
  }
}

watch(() => route.params.slug, async (newSlug) => {
  if (!newSlug)
    return

  await userStore.getUserBySlug(newSlug as string)
  const currentUser = user.value
  if (currentUser?.id) {
    await analyticsStore.recordPageView(currentUser.id)

    useHead({
      title: `@${currentUser.slug}`,
      link: [{ rel: "canonical", href: `https://linknest.vercel.app/${currentUser.slug}` }],
      meta: [{ name: "description", content: `@${currentUser.slug} profile on LinkNest.` }],
    })
  }
}, { immediate: true })

definePageMeta({
  layout: "minimal",
})
</script>
