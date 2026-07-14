<template>
  <div v-if="banner" class="fixed bottom-0 z-30 flex w-screen flex-col items-center justify-between gap-2 p-4 text-[#f9fafb] md:flex-row md:gap-2" :class="banner.class">
    <div class="navigation-group w-full justify-between md:flex-col md:items-start">
      <div class="flex w-full flex-col justify-between gap-2 text-start">
        <div class="navigation-group">
          <icon :name="banner.icon" size="35" class="hidden shrink-0 text-[#f9fafb] md:block" />
          <h5>
            {{ banner.message }}
          </h5>

          <nuxt-link :to="banner.link" class="btn ml-auto">
            <span>Learn More</span>
            <icon name="mdi:arrow-right" size="20" />
          </nuxt-link>
        </div>

        <p class="text-xs/4 md:text-sm">
          {{ banner.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  preferences: UserPreferences
}>()

const activeBanner = computed<Exclude<BannerOption, "NONE"> | null>(() => {
  const value = props.preferences.supportBanner
  return value && value !== "NONE" ? value : null
})

const banner = computed(() => {
  if (!activeBanner.value) {
    return null
  }

  return {
    message: BANNER_MESSAGES[activeBanner.value],
    description: BANNER_DESCRIPTIONS[activeBanner.value],
    icon: BANNER_ICONS[activeBanner.value],
    link: BANNER_LINKS[activeBanner.value],
    class: BANNER_STYLES[activeBanner.value],
  }
})
</script>

<style scoped>
.banner.lgbtq-rights {
  background-color: #5c3963;
}
.banner.anti-racism {
  background-color: #1a1919;
}
.banner.mental-health {
  background-color: #285274;
}
.banner.climate-action {
  background-color: #287445;
}
</style>
