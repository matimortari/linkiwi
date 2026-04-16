<template>
  <div v-if="preset" class="carousel-host -mb-80 flex items-center justify-center select-none md:w-full md:justify-end">
    <transition name="carousel" mode="out-in">
      <div :key="preset.slug" class="phone-mockup relative flex flex-col overflow-hidden rounded-[2.5rem] border-4 shadow-lg md:my-4 md:block">
        <div class="absolute -top-1 z-10 w-full rounded-t-[2.5rem] bg-linear-to-r from-primary to-secondary pb-1">
          <div class="flex flex-row items-center justify-between rounded-t-[2.5rem] bg-[#111016] p-4 pb-2">
            <div class="navigation-group">
              <span v-for="i in 3" :key="i" class="size-2.5 rounded-full bg-[#3b3b41]" />
            </div>

            <span class="rounded-2xl bg-[#3b3b41] p-1 font-mono text-xs text-[#ebe8e8]">@{{ preset.slug }}</span>
          </div>
        </div>

        <div class="scroll-hide flex h-full flex-1 flex-col items-center gap-2 overflow-y-auto px-4 py-24 text-center" :style="backgroundStyle">
          <img :src="getPresetImage(preset.image || '')" :alt="preset.slug" :style="profilePictureStyle" class="size-24">
          <p :style="slugStyle">
            /{{ preset.slug }}
          </p>

          <p :style="descriptionStyle">
            {{ preset.description }}
          </p>

          <ul class="my-2 navigation-group w-full justify-center">
            <li
              v-for="icon in preset.icons" :key="icon.id"
              class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(iconHover[icon.id] ?? false)"
              @mouseenter="iconHover[icon.id] = true" @mouseleave="iconHover[icon.id] = false"
            >
              <icon :name="icon.logo" size="20" :style="iconInnerStyle" />
            </li>
          </ul>

          <ul class="flex w-full flex-col items-center gap-4">
            <li
              v-for="link in preset.links" :key="link.id"
              class="flex w-full max-w-72 justify-center" :style="linkStyle(linkHover[link.id] ?? false)"
              @mouseenter="linkHover[link.id] = true" @mouseleave="linkHover[link.id] = false"
            >
              <span :style="linkInnerStyle">{{ link.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { currentIndex } = useCarousel(CAROUSEL_PRESETS.length, 3000)
const preset = computed(() => CAROUSEL_PRESETS[currentIndex.value])
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, iconStyle, iconInnerStyle, linkStyle, linkInnerStyle } = useDynamicStyles(computed(() => preset.value?.preferences))
const linkHover = reactive<Record<string, boolean>>({})
const iconHover = reactive<Record<string, boolean>>({})
const images = import.meta.glob("/assets/presets/*", { eager: true, import: "default" })

function getPresetImage(filename: string): string {
  return images[`/assets/presets/${filename}`] as string || ""
}
</script>

<style scoped>
.carousel-host {
  perspective: 1200px;
}

.phone-mockup {
  width: clamp(17rem, 82vw, 23rem);
  height: clamp(34rem, 84vw, 39rem);
  transform-origin: center;
}

.scroll-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}

.carousel-enter-active,
.carousel-leave-active {
  transition:
    transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;
}

.carousel-enter-from {
  transform: translateX(30px) rotateY(22deg) rotateX(4deg) scale(0.93);
  opacity: 0;
  filter: blur(6px);
}
.carousel-enter-to {
  transform: translateX(0) rotateY(0deg) rotateX(0deg) scale(1);
  opacity: 1;
  filter: blur(0);
}

.carousel-leave-from {
  transform: translateX(0) rotateY(0deg) rotateX(0deg) scale(1);
  opacity: 1;
  filter: blur(0);
}
.carousel-leave-to {
  transform: translateX(-30px) rotateY(-18deg) rotateX(-3deg) scale(0.95);
  opacity: 0;
  filter: blur(4px);
}

@media (min-width: 768px) {
  .phone-mockup {
    width: clamp(20rem, 34vw, 24rem);
    height: clamp(36rem, 48vw, 41rem);
  }
}
</style>
