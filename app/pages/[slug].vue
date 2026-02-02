<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <nuxt-link to="/">
      <img src="/assets/symbol.png" alt="Logo" width="30" class="absolute top-4 left-4 transition-transform hover:scale-105">
    </nuxt-link>

    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Spinner />
    </div>

    <Empty v-else-if="!userProfile" :message="`User @${slug} not found.`" icon-name="mdi:account-off" />

    <div v-else-if="userProfile" class="flex w-full flex-1 flex-col items-center gap-4 py-12 text-center" :style="backgroundStyle">
      <UserSupportBanner v-if="profilePreferences.supportBanner !== 'NONE'" :preferences="profilePreferences" />

      <img :src="userProfile.image || DEFAULT_AVATAR" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
      <p :style="slugStyle">
        {{ `@${userProfile.slug}` }}
      </p>

      <p class="max-w-sm leading-4 whitespace-break-spaces" :style="descriptionStyle">
        {{ userProfile.description }}
      </p>

      <ul v-if="userProfile.icons?.length" class="my-2 navigation-group justify-center">
        <UserIcon
          v-for="icon in userProfile.icons" :key="icon.id"
          :item="icon" :preferences="profilePreferences"
          @click="handleClick(icon.id ?? '', 'icon')"
        />
      </ul>

      <ul v-if="userProfile.links?.length" class="flex w-full flex-col items-center gap-4">
        <UserLink
          v-for="link in userProfile.links" :key="link.id"
          :item="link" :preferences="profilePreferences"
          @click="handleClick(link.id ?? '', 'link')"
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
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { userProfile, loading } = storeToRefs(userStore)
const profilePreferences = computed(() => userProfile.value?.preferences ?? DEFAULT_PREFERENCES)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(profilePreferences)

async function handleClick(itemId: string, type: "link" | "icon") {
  if (!userProfile.value?.id) {
    return
  }

  type === "link" ? await analyticsStore.recordLinkClick(userProfile.value.id, itemId) : await analyticsStore.recordIconClick(userProfile.value.id, itemId)
}

onMounted(async () => {
  if (!slug.value) {
    return
  }

  await userStore.getUserProfile(slug.value)
  if (userProfile.value) {
    useHead({
      title: `@${userProfile.value.slug}`,
      link: [{ rel: "canonical", href: `https://alllinks-bio.vercel.app/${userProfile.value.slug}` }],
      meta: [{ name: "description", content: `@${userProfile.value.slug} profile on AllLinks.` }],
    })

    const referrer = (typeof document === "undefined" ? "" : document.referrer) || (route.query.ref as string) || ""
    await analyticsStore.recordPageView(userProfile.value.id, referrer)
  }
})

definePageMeta({
  layout: "minimal",
})
</script>
