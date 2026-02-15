<template>
  <div v-if="preset" class="-mb-80 flex items-center justify-center select-none md:w-1/2 md:justify-end">
    <transition name="carousel" mode="out-in">
      <div :key="preset.slug" class="relative flex h-150 w-80 flex-col overflow-hidden rounded-[2.5rem] border-4 shadow-lg">
        <div class="absolute -top-1 z-10 w-full rounded-t-[2.5rem] bg-linear-to-r from-primary to-secondary pb-1">
          <div class="flex flex-row items-center justify-between rounded-t-[2.5rem] bg-[#111016] p-4 pb-2">
            <div class="navigation-group">
              <span v-for="i in 3" :key="i" class="size-2.5 rounded-full bg-[#3b3b41]" />
            </div>

            <span class="rounded-2xl bg-[#3b3b41] p-1 font-mono text-xs text-[#ebe8e8]">@{{ preset.slug }}</span>
          </div>
        </div>

        <div class="scroll-hide flex flex-1 flex-col items-center gap-2 overflow-y-auto px-4 py-24 text-center" :style="backgroundStyle">
          <img :src="getPresetImage(preset.image || '')" :alt="preset.slug" :style="profilePictureStyle" class="size-24">
          <p :style="slugStyle">
            @{{ preset.slug }}
          </p>

          <p :style="descriptionStyle">
            {{ preset.description }}
          </p>

          <ul class="my-2 flex w-full flex-row items-center justify-center gap-2">
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
const preset = getCarouselPreset(CAROUSEL_PRESETS, 3000)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, iconStyle, iconInnerStyle, linkStyle, linkInnerStyle } = useDynamicStyles(computed(() => preset.value?.preferences))
const linkHover = reactive<Record<string, boolean>>({})
const iconHover = reactive<Record<string, boolean>>({})
const images = import.meta.glob("/assets/presets/*", { eager: true, import: "default" })

function getPresetImage(filename: string): string {
  return (images[`/assets/presets/${filename}`] as string) || ""
}

function getCarouselPreset(presets: typeof CAROUSEL_PRESETS, interval = 3000) {
  const { currentIndex } = useCarousel(presets.length, interval)
  return computed(() => presets[currentIndex.value])
}
</script>

<style scoped>
.carousel-enter-active,
.carousel-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
  transform-style: preserve-3d;
}

.carousel-enter-from {
  transform: rotateY(90deg) scale(0.8);
  opacity: 0;
}
.carousel-enter-to {
  transform: rotateY(0deg) scale(1);
  opacity: 1;
}

.carousel-leave-from {
  transform: rotateY(0deg) scale(1);
  opacity: 1;
}
.carousel-leave-to {
  transform: rotateY(-90deg) scale(0.95);
  opacity: 0;
}
</style>
