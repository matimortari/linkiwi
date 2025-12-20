<template>
  <nav class="flex flex-row items-center justify-between p-4">
    <div class="flex flex-row items-center gap-8">
      <Logo />

      <div v-if="user" class="hidden md:navigation-group">
        <nuxt-link :to="`/${user.slug}`" class="btn bg-muted! p-1! text-xs! text-muted-foreground!" title="Go to your profile page">
          <icon name="mdi:arrow-top-right" size="20" class="text-secondary" />
          <span class="truncate">{{ pageUrl }}</span>
        </nuxt-link>

        <button class="btn flex items-center gap-2 whitespace-nowrap" title="See sharing options" aria-label="Share Profile" @click="isDialogOpen = true">
          <icon name="mdi:share-variant" size="20" />
          <span>Share</span>
        </button>
      </div>
    </div>

    <p v-if="shouldShowPreview" class="text-caption ml-auto hidden md:block">
      Live Preview
    </p>

    <UserShareDialog :is-open="isDialogOpen" @close="isDialogOpen = false" />
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = storeToRefs(useUserStore())
const isDialogOpen = ref(false)
const shouldShowPreview = computed(() => route.path !== "/admin/analytics")
const pageUrl = computed(() => `${BASE_URL.replace(/^https?:\/\//, "")}/${user?.value?.slug}`)
</script>
