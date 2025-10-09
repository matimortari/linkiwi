<template>
  <transition name="banner-slide-up">
    <div v-if="showBanner" class="fixed bottom-0 z-50 flex w-screen flex-col items-center justify-between gap-4 p-6 text-[#ebe8e8] md:flex-row md:gap-2" :class="banner.class" >
      <div class="flex flex-row items-center gap-2 md:flex-col md:items-start">
        <div class="flex flex-col gap-2 text-start">
          <div class="flex flex-row items-center gap-2">
            <icon :name="banner.icon" size="35" class="hidden shrink-0 text-[#ebe8e8] md:block" />
            <h5>
              {{ banner.message }}
            </h5>
          </div>
          <p class="text-sm leading-4">
            {{ banner.description }}
          </p>
        </div>
      </div>

      <nuxt-link :to="banner.link" class="btn self-center">
        ACT NOW
      </nuxt-link>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { BANNER_DESCRIPTIONS, BANNER_ICONS, BANNER_LINKS, BANNER_MESSAGES, BANNER_STYLES } from "#shared/config/banner-options"

const props = defineProps<{ 
    type: keyof typeof BANNER_MESSAGES
 }>()

const banner = computed(() => ({
  message: BANNER_MESSAGES[props.type],
  description: BANNER_DESCRIPTIONS[props.type],
  icon: BANNER_ICONS[props.type],
  link: BANNER_LINKS[props.type],
  class: BANNER_STYLES[props.type],
}))

const showBanner = ref(true)
let lastScrollY = window.scrollY

function handleScroll() {
  const current = window.scrollY
  showBanner.value = current < lastScrollY || current < 10
  lastScrollY = current
}

addEventListener("scroll", handleScroll)
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
