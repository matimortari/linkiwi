<template>
  <div class="relative flex min-h-screen flex-col items-center overflow-x-hidden">
    <ClientOnly>
      <nuxt-link to="/">
        <img src="/assets/symbol.png" alt="Logo" width="35" class="absolute top-4 left-4 z-30 transition-transform hover:scale-105">
      </nuxt-link>
    </ClientOnly>

    <Loading v-if="loading" class="absolute inset-0 flex items-center justify-center backdrop-blur-sm" />
    <Empty v-else-if="!userProfile && !loading" :message="`User @${slug} not found.`" icon-name="mdi:account-off" />

    <div v-else-if="userProfile" class="flex w-full flex-1 flex-col items-center text-center" :style="backgroundStyle">
      <UserSupportBanner v-if="profilePreferences.supportBanner !== 'NONE'" :preferences="profilePreferences" />
      <UserGuestbook v-if="profilePreferences?.enableGuestbook" :user-id="userProfile?.id" />

      <div
        v-motion :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }" :duration="500"
        class="flex w-full flex-col items-center"
      >
        <div v-if="userProfile.banner?.url" class="w-full max-w-2xl px-4 pt-8">
          <img :src="userProfile.banner.url" alt="Profile Banner" class="h-32 w-full rounded-xl object-cover md:h-40">
        </div>

        <div class="flex w-full max-w-3xl flex-col items-center gap-4 px-4">
          <div class="flex flex-col items-center gap-2" :class="userProfile.banner?.url ? 'relative z-10 -mt-12' : 'pt-12'">
            <img :src="userProfile.image" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
            <p :style="slugStyle">
              {{ `@${userProfile.slug}` }}
            </p>
            <p v-if="userProfile.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm/4 whitespace-break-spaces" :style="descriptionStyle">
              <icon name="mdi:map-marker" size="15" />
              <span>{{ userProfile.location }}</span>
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

          <ul class="flex w-full max-w-md flex-col items-center gap-4">
            <template v-for="item in visibleItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="profilePreferences" @click="handleClick(item.id ?? '')" />
              <UserPhotoGrid v-else-if="item.type === 'PHOTO_GRID'" :photos="item.photoGrid?.photos ?? []" :preferences="profilePreferences" />
              <UserWidget v-else-if="item.type === 'WIDGET' && item.widget" :type="item.widget.type" :handle="item.widget.handle ?? ''" :preferences="profilePreferences" />
              <span v-else-if="item.type === 'DIVIDER'" class="w-full" :style="dividerStyle" />
            </template>
          </ul>
        </div>
      </div>

      <div class="mt-auto flex justify-center px-4 pt-12" :class="profilePreferences.supportBanner !== 'NONE' ? 'pb-36 md:pb-28' : 'pb-8'">
        <nuxt-link to="/" class="navigation-group transition-transform hover:scale-105">
          <span class="text-xs font-medium" :style="{ color: profilePreferences.linkTextColor }">Made with</span>
          <ClientOnly>
            <img src="/assets/symbol.png" alt="LinKiwi" width="20" class="size-5 shrink-0">
            <img :src="themeTitle" alt="LinKiwi" width="72">
          </ClientOnly>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const { themeTitle } = useTheme()
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { userProfile, loading } = storeToRefs(userStore)
const profilePreferences = computed(() => userProfile.value?.preferences ?? DEFAULT_PREFERENCES)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, dividerStyle } = useDynamicStyles(profilePreferences)
const visibleIcons = computed(() => (userProfile.value?.items ?? []).filter(i => i.type === "ICON" && i.isVisible !== false))
const visibleItems = computed(() => (userProfile.value?.items ?? []).filter(i => i.type !== "ICON" && i.isVisible !== false).sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

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
