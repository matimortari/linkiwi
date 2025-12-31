<template>
  <nav class="flex flex-row items-center justify-between p-4">
    <div class="flex flex-row items-center gap-8">
      <Logo />

      <div v-if="user" class="hidden md:navigation-group">
        <nuxt-link :to="`/${user.slug}`" class="btn bg-muted/50! p-1! text-xs! text-muted-foreground!" target="_blank" title="Go to your profile page">
          <icon name="mdi:arrow-top-right" size="20" class="text-secondary" />
          <span class="truncate">{{ pageUrl }}</span>
        </nuxt-link>
      </div>
    </div>

    <p v-if="user && showPreview" class="text-caption ml-auto hidden md:block">
      Live Preview
    </p>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = storeToRefs(useUserStore())
const showPreview = computed(() => route.path !== "/admin/analytics")
const pageUrl = computed(() => `${BASE_URL.replace(/^https?:\/\//, "")}/${user?.value?.slug}`)
</script>
