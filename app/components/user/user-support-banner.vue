<template>
  <transition name="banner-slide-up">
    <div v-if="showBanner && banner" class="fixed bottom-0 z-50 flex w-screen flex-col items-center justify-between gap-2 p-4 text-[#ebe8e8] md:flex-row md:gap-2" :class="banner.class">
      <div class="navigation-group md:flex-col md:items-start">
        <div class="flex flex-col gap-2 text-start">
          <div class="navigation-group">
            <icon :name="banner.icon" size="35" class="hidden shrink-0 text-[#ebe8e8] md:block" />
            <h5>
              {{ banner.message }}
            </h5>
          </div>
          <p class="text-xs/4 md:text-sm">
            {{ banner.description }}
          </p>
        </div>
      </div>

      <nuxt-link :to="banner.link" class="btn self-end md:self-center">
        <span>Learn More</span>
        <icon name="mdi:arrow-right" size="20" />
      </nuxt-link>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  preferences: UserPreferences
}>()

const showBanner = ref(true)
let lastScrollY = window.scrollY

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

function handleScroll() {
  const current = window.scrollY
  showBanner.value = current < lastScrollY || current < 10
  lastScrollY = current
}

onMounted(() => addEventListener("scroll", handleScroll))
onBeforeUnmount(() => removeEventListener("scroll", handleScroll))
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

.banner-slide-up-enter-active,
.banner-slide-up-leave-active {
  transition:
    transform 0.8s,
    opacity 0.8s;
}
.banner-slide-up-enter-from,
.banner-slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
