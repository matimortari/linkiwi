<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <ClientOnly>
      <nuxt-link to="/">
        <img src="/assets/symbol.png" alt="Logo" width="30" class="absolute top-4 left-4 transition-transform hover:scale-105">
      </nuxt-link>
    </ClientOnly>

    <Loading v-if="loading" class="absolute inset-0 flex items-center justify-center backdrop-blur-sm" />
    <Empty v-else-if="!userProfile && !loading" :message="`User @${slug} not found.`" icon-name="mdi:account-off" />

    <div v-else-if="userProfile" class="flex w-full flex-1 flex-col items-center gap-4 pt-4 pb-32 text-center" :style="backgroundStyle">
      <UserSupportBanner v-if="profilePreferences.supportBanner !== 'NONE'" :preferences="profilePreferences" />

      <div class="flex flex-col items-center gap-2">
        <img :src="userProfile.image" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
        <p :style="slugStyle">
          {{ `@${userProfile.slug}` }}
        </p>
        <p v-if="userProfile.description" class="max-w-sm leading-4 whitespace-break-spaces" :style="descriptionStyle">
          {{ userProfile.description }}
        </p>
      </div>

      <ul v-if="visibleIcons.length" class="navigation-group justify-center">
        <UserSocialIcon
          v-for="item in visibleIcons" :key="item.id"
          :item="item" :preferences="profilePreferences"
          @click="handleClick(item.id ?? '')"
        />
      </ul>

      <div v-if="visibleWidgets.length" class="flex w-full flex-col items-center gap-4 px-4">
        <div v-for="item in visibleWidgets" :key="item.id" class="w-full max-w-xl">
          <UserWidgetGithub v-if="item.widget?.type === 'GITHUB'" :handle="item.widget?.handle ?? ''" :preferences="profilePreferences" />
          <UserWidgetYoutube v-else-if="item.widget?.type === 'YOUTUBE'" :handle="item.widget?.handle ?? ''" :preferences="profilePreferences" />
          <UserWidgetSpotify v-else-if="item.widget?.type === 'SPOTIFY'" :handle="item.widget?.handle ?? ''" :preferences="profilePreferences" />
        </div>
      </div>

      <ul v-if="visibleLinks.length" class="flex w-full flex-col items-center gap-4">
        <UserLink
          v-for="item in visibleLinks" :key="item.id"
          :item="item" :preferences="profilePreferences"
          @click="handleClick(item.id ?? '')"
        />
      </ul>

      <p v-else :style="descriptionStyle">
        No links yet.
      </p>
    </div>

    <UserGuestbook v-if="profilePreferences?.enableGuestbook" :user-id="userProfile?.id" />
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { userProfile, loading } = storeToRefs(userStore)
const profilePreferences = computed(() => userProfile.value?.preferences ?? DEFAULT_PREFERENCES)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(profilePreferences)
const visibleLinks = computed(() => (userProfile.value?.items || []).filter(item => item.type === "LINK" && item.link && item.isVisible !== false))
const visibleIcons = computed(() => (userProfile.value?.items || []).filter(item => item.type === "ICON" && item.icon && item.isVisible !== false))
const visibleWidgets = computed(() => (userProfile.value?.items || []).filter(item => ["GITHUB", "YOUTUBE", "SPOTIFY"].includes(item.type) && item.widget && item.isVisible !== false))

async function handleClick(itemId: string) {
  if (!userProfile.value?.slug) {
    return
  }
  await analyticsStore.recordItemClick(itemId)
}

onMounted(async () => {
  if (!slug.value) {
    return
  }

  await userStore.getUserProfile(slug.value)
  if (userProfile.value) {
    useHead({
      title: `@${userProfile.value.slug}`,
      link: [{ rel: "canonical", href: `${baseURL}/${userProfile.value.slug}` }],
      meta: [{ name: "description", content: `@${userProfile.value.slug} profile on LinKiwi.` }],
    })

    await analyticsStore.recordPageView(userProfile.value.slug, (route.query.ref as string) ?? "direct")
  }
})

definePageMeta({ layout: "minimal" })
</script>
