<template>
  <!-- Mobile toggle -->
  <button class="btn fixed bottom-4 left-1/2 z-30 -translate-x-1/2 md:hidden!" aria-label="Toggle Mobile Preview" @click="isPreviewOpen = !isPreviewOpen">
    <icon :name="isPreviewOpen ? 'mdi:eye-off' : 'mdi:eye'" size="25" />
    <span>{{ isPreviewOpen ? 'Close Preview' : 'Preview' }}</span>
  </button>

  <div v-if="user" class="mx-auto my-4 flex items-center select-none md:h-150 md:w-80 2xl:w-90">
    <!-- Mobile full-screen preview -->
    <transition name="slide">
      <div v-if="isPreviewOpen" class="fixed top-0 left-0 z-20 size-full overflow-y-auto p-12 md:hidden" :style="backgroundStyle">
        <div class="flex max-h-full flex-col items-center justify-start gap-4 overflow-y-auto p-4 text-center">
          <img :src="user.image ?? undefined" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
          <p class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="slugStyle">
            @{{ user.slug }}
          </p>

          <p v-if="user.description" class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="descriptionStyle">
            {{ user.description }}
          </p>

          <ul v-if="icons.length" class="my-2 flex w-full flex-row items-center justify-center gap-2">
            <UserIcon v-for="icon in icons" :key="icon.id" :item="icon" :preferences="preferences" />
          </ul>

          <ul v-if="links.length" class="flex w-full flex-col items-center gap-4">
            <UserLink v-for="link in links" :key="link.id" :item="link" :preferences="preferences" />
          </ul>

          <p v-else :style="descriptionStyle">
            No links yet.
          </p>
        </div>
      </div>
    </transition>

    <!-- Desktop preview -->
    <div
      v-motion :initial="{ opacity: 0, x: 20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="800"
      :style="backgroundStyle" class="scroll-hide relative hidden h-150 w-full overflow-x-hidden rounded-[2.5rem] border-4 shadow-lg md:block"
    >
      <div class="sticky top-2 left-1/2 z-10 h-2 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div class="sticky top-2 z-10 w-full px-4">
        <div class="flex justify-end gap-2 text-black">
          <icon name="mdi:signal" size="15" />
          <icon name="mdi:wifi" size="15" />
        </div>
      </div>

      <div class="flex flex-col items-center justify-start gap-4 overflow-y-auto p-4 text-center">
        <img :src="user.image ?? undefined" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">

        <p class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="slugStyle">
          @{{ user.slug }}
        </p>
        <p v-if="user.description" class="line-clamp-3 max-w-sm truncate leading-4 whitespace-break-spaces" :style="descriptionStyle">
          {{ user.description }}
        </p>

        <div class="my-2 w-full">
          <ul v-if="icons.length" class="flex flex-row items-center justify-center gap-2">
            <UserIcon v-for="icon in icons" :key="icon.id" :item="icon" :preferences="preferences" />
          </ul>
        </div>

        <div class="w-full">
          <ul v-if="links.length" class="flex flex-col items-center gap-4">
            <UserLink v-for="link in links" :key="link.id" :item="link" :preferences="preferences" />
          </ul>

          <p v-else :style="descriptionStyle">
            No links yet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, preferences } = storeToRefs(useUserStore())
const { links } = storeToRefs(useLinksStore())
const { icons } = storeToRefs(useIconsStore())
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(preferences)
const isPreviewOpen = ref(false)
</script>

<style scoped>
.slide-enter-from {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0);
}
.slide-enter-active {
  transition: transform 0.3s ease-out;
}

.slide-leave-from {
  transform: translateY(0);
}
.slide-leave-to {
  transform: translateY(100%);
}
.slide-leave-active {
  transition: transform 0.3s ease-in;
}
</style>
