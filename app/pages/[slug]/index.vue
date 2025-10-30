<template>
  <nuxt-link to="/" class="hover:scale-sm fixed top-4 left-4 z-50 flex flex-row items-center gap-2 rounded-full transition-all select-none">
    <img src="/assets/logo.png" alt="Logo" width="30">
  </nuxt-link>

  <div v-if="user && !loading" class="min-h-screen p-12 pb-28" :style="backgroundStyle">
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

  <div v-else class="flex min-h-screen flex-col items-center justify-center gap-4 p-12 text-center">
    <Spinner v-if="loading" />

    <p v-else class="text-lead">
      User {{ slug }} not found.
    </p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const route = useRoute()
const slug = route.params.slug as string
const { user, loading } = storeToRefs(userStore)
const preferences = computed(() => user.value?.preferences ?? null)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(preferences)

async function handleLinkClick(linkId: string) {
  if (user.value?.id) {
    await analyticsService.recordLinkClick(user.value.id, linkId)
  }
}

async function handleIconClick(iconId: string) {
  if (user.value?.id) {
    await analyticsService.recordIconClick(user.value.id, iconId)
  }
}

watch(() => route.params.slug, async (newSlug) => {
  let lastRecordedSlug: string | null = null
  if (!newSlug || newSlug === lastRecordedSlug)
    return

  await userStore.getUserBySlug(newSlug as string)
  const currentUser = userStore.user
  if (currentUser?.id) {
    await analyticsService.recordPageView(currentUser.id)
    lastRecordedSlug = typeof newSlug === "string" ? newSlug : Array.isArray(newSlug) ? newSlug[0] ?? null : null

    useHead({
      title: `@${currentUser.slug}`,
      link: [{ rel: "canonical", href: `https://linknest.vercel.app/${currentUser.slug}` }],
      meta: [{ name: "description", content: `@${currentUser.slug} profile on LinkNest.` }],
    })
  }
}, { immediate: true })

definePageMeta({
  layout: "user",
})
</script>
