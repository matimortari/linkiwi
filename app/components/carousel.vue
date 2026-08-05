<template>
  <div class="carousel-viewport" aria-hidden="true">
    <div class="carousel-track">
      <div v-for="loop in 2" :key="loop" class="carousel-group">
        <div
          v-for="preset in CAROUSEL_PRESETS" :key="`${loop}-${preset.slug}`"
          class="phone-mockup relative flex flex-col overflow-hidden rounded-[2.5rem] border-4 shadow-xl"
        >
          <div class="absolute -top-1 z-10 w-full rounded-t-[2.5rem] bg-linear-to-r from-primary to-secondary pb-1">
            <div class="flex flex-row items-center justify-between rounded-t-[2.5rem] bg-[#030712] p-4 pb-2">
              <div class="navigation-group">
                <span v-for="i in 3" :key="i" class="size-2.5 rounded-full bg-[#111827]" />
              </div>
              <span class="rounded-2xl bg-[#111827] p-1 px-2.5 font-mono text-xs text-[#f9fafb]">@{{ preset.slug }}</span>
            </div>
          </div>

          <div class="scroll-hide flex h-full flex-1 flex-col items-center gap-2 overflow-hidden px-4 py-24 text-center" :style="backgroundStyle(preset)">
            <img :src="getPresetImage(preset.image)" :alt="preset.slug" :style="profilePictureStyle(preset)" class="size-24">
            <p :style="slugStyle(preset)">
              @{{ preset.slug }}
            </p>
            <p :style="descriptionStyle(preset)">
              {{ preset.description }}
            </p>

            <ul class="my-2 navigation-group w-full justify-center">
              <li v-for="icon in preset.icons" :key="icon.id" class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(preset)">
                <icon :name="icon.logo" size="20" :style="iconInnerStyle(preset)" />
              </li>
            </ul>

            <ul class="flex w-full flex-col items-center gap-4">
              <li v-for="link in preset.links" :key="link.id" class="flex w-full max-w-72 justify-center" :style="linkStyle(preset)">
                <span :style="linkInnerStyle(preset)">{{ link.title }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = import.meta.glob("/assets/presets/*", { eager: true, import: "default" })

function getPresetImage(filename: string) {
  return images[`/assets/presets/${filename}`] as string
}

function backgroundStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return pref.backgroundType === "GRADIENT" ? { background: `linear-gradient(to bottom, ${pref.backgroundGradientStart}, ${pref.backgroundGradientEnd})` } : { backgroundColor: pref.backgroundColor }
}

function profilePictureStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return {
    borderRadius: pref.profilePictureRadius,
    borderColor: pref.profilePictureBorderColor,
    borderWidth: pref.profilePictureBorderWidth,
    borderStyle: "solid",
  }
}

function slugStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return {
    color: pref.slugTextColor,
    fontWeight: pref.slugTextWeight,
    fontSize: pref.slugTextSize,
    fontFamily: pref.slugFontFamily,
  }
}

function descriptionStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return {
    color: pref.headerTextColor,
    fontWeight: pref.headerTextWeight,
    fontSize: pref.headerTextSize,
    fontFamily: pref.headerFontFamily,
  }
}

function iconStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  const shadowMap: Record<string, string> = {
    none: "none",
    light: `0 2px 4px ${pref.iconShadowColor}`,
    medium: `0 4px 6px ${pref.iconShadowColor}`,
    heavy: `0 6px 10px ${pref.iconShadowColor}`,
  }
  return {
    backgroundColor: pref.iconBackgroundColor,
    boxShadow: pref.isIconShadow ? shadowMap[pref.iconShadowWeight!] : "none",
  }
}

function iconInnerStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return { color: pref.iconLogoColor }
}

function linkStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  const shadowMap: Record<string, string> = {
    none: "none",
    light: `0 2px 4px ${pref.linkShadowColor}`,
    medium: `0 4px 6px ${pref.linkShadowColor}`,
    heavy: `0 6px 10px ${pref.linkShadowColor}`,
  }
  return {
    backgroundColor: pref.linkBackgroundColor,
    boxShadow: pref.isLinkShadow ? shadowMap[pref.linkShadowWeight!] : "none",
    borderRadius: pref.linkBorderRadius,
    padding: pref.linkPadding,
  }
}

function linkInnerStyle({ preferences: pref }: typeof CAROUSEL_PRESETS[number]) {
  return {
    color: pref.linkTextColor,
    fontWeight: pref.linkTextWeight,
    fontFamily: pref.linkFontFamily,
    fontSize: pref.linkTextSize,
  }
}
</script>

<style scoped>
.carousel-viewport {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.carousel-track {
  display: flex;
  width: max-content;
  animation: carousel-marquee 50s linear infinite;
}

.carousel-group {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-inline: 1rem;
}

.phone-mockup {
  width: 16rem;
  height: 30rem;
  flex-shrink: 0;
}

.scroll-hide {
  scrollbar-width: none;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}

@keyframes carousel-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
