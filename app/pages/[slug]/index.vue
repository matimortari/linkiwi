<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Spinner />
    </div>

    <Empty v-else-if="!userProfile" :message="`User @${slug} not found.`" icon-name="mdi:account-off" />

    <div v-else-if="userProfile" class="flex w-full flex-1 flex-col items-center gap-4 py-12 text-center" :style="backgroundStyle">
      <SupportBanner v-if="profilePreferences?.supportBanner && profilePreferences.supportBanner !== 'NONE'" :type="profilePreferences.supportBanner" />

      <img
        v-if="userProfile.image" :src="userProfile.image"
        alt="Avatar" class="size-24 object-cover"
        :style="profilePictureStyle"
      >

      <p :style="slugStyle">
        {{ `@${userProfile.slug}` }}
      </p>

      <p class="max-w-sm leading-4 whitespace-break-spaces" :style="descriptionStyle">
        {{ userProfile.description }}
      </p>

      <ul v-if="userProfile.icons?.length" class="my-2 flex flex-row items-center justify-center gap-2">
        <UserIcon
          v-for="icon in userProfile.icons" :key="icon.id"
          :item="icon" :preferences="profilePreferences"
          @click="handleIconClick(icon.id ?? '')"
        />
      </ul>

      <ul v-if="userProfile.links?.length" class="flex w-full flex-col items-center gap-4">
        <UserLink
          v-for="link in userProfile.links" :key="link.id"
          :item="link" :preferences="profilePreferences"
          @click="handleLinkClick(link.id ?? '')"
        />
      </ul>

      <p v-else :style="descriptionStyle">
        No links yet.
      </p>
    </div>

    <Guestbook :user-id="userProfile?.id" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const { userProfile, loading } = storeToRefs(userStore)
const profilePreferences = computed(() => userProfile.value?.preferences ?? DEFAULT_PREFERENCES)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(profilePreferences)

async function handleLinkClick(linkId: string) {
  if (userProfile.value?.id) {
    await analyticsStore.recordLinkClick(userProfile.value.id, linkId)
  }
}

async function handleIconClick(iconId: string) {
  if (userProfile.value?.id) {
    await analyticsStore.recordIconClick(userProfile.value.id, iconId)
  }
}

async function loadUserProfile(slug: string) {
  if (!slug) {
    return
  }

  await userStore.getUserProfile(slug)
  const currentUser = userProfile.value
  if (currentUser?.id) {
    const referrer = route.query.ref as string

    if (referrer) {
      await analyticsStore.recordPageView(currentUser.id, referrer)
    }
    else {
      await analyticsStore.recordPageView(currentUser.id)
    }

    useHead({
      title: `@${currentUser.slug}`,
      link: [{ rel: "canonical", href: `https://linkstashr.vercel.app/${currentUser.slug}` }],
      meta: [{ name: "description", content: `@${currentUser.slug} profile on Linkstashr.` }],
    })
  }
}

onMounted(() => {
  loadUserProfile(slug)
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadUserProfile(newSlug as string)
  }
})

definePageMeta({
  layout: "minimal",
})
</script>
