<template>
  <nav class="flex flex-row items-center justify-between p-4">
    <div class="flex flex-row items-center gap-8">
      <Logo />

      <div class="hidden h-8 md:flex md:items-center">
        <nuxt-link v-if="user" :to="`/${user.slug}`" class="btn bg-muted/50! p-1! text-xs! text-muted-foreground!" target="_blank">
          <icon name="mdi:arrow-top-right" size="20" class="text-secondary" />
          <span class="truncate">{{ pageUrl }}</span>
        </nuxt-link>

        <div v-else class="h-7 w-48 animate-pulse rounded-full bg-muted" />
      </div>
    </div>

    <p v-if="user && showPreview" class="text-caption ml-auto hidden md:block">
      Live Preview
    </p>
  </nav>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const route = useRoute()
const { user } = storeToRefs(useUserStore())
const showPreview = computed(() => route.path !== "/admin/analytics")
const pageUrl = computed(() => user.value ? `${baseURL.replace(/^https?:\/\//, "")}/${user.value.slug}` : "")
</script>
