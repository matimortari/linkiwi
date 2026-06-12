<template>
  <!-- Mobile toggle -->
  <button class="btn fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden!" aria-label="Toggle Mobile Preview" @click="isPreviewOpen ? closePreview() : openPreview()">
    <icon :name="isPreviewOpen ? 'mdi:eye-off' : 'mdi:eye'" size="25" />
    <span>{{ isPreviewOpen ? 'Close Preview' : 'Preview' }}</span>
  </button>

  <div v-if="user" class="mx-auto flex justify-center select-none">
    <!-- Mobile full-screen preview -->
    <transition name="slide">
      <div v-if="isPreviewOpen" class="fixed top-0 left-0 z-40 size-full overflow-y-auto p-12 md:hidden" :style="backgroundStyle">
        <div class="flex max-h-full flex-col items-center justify-start gap-4 overflow-y-auto p-4 text-center">
          <div class="flex flex-col items-center gap-2">
            <img :src="user.image" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
            <p class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="slugStyle">
              @{{ user.slug }}
            </p>
            <p v-if="user.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm/4 whitespace-break-spaces" :style="descriptionStyle">
              <icon name="mdi:map-marker" size="15" />
              <span>{{ user.location }}</span>
              shed
            </p>
            <p v-if="user.description" class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="descriptionStyle">
              {{ user.description }}
            </p>
          </div>

          <ul v-if="visibleIcons.length" class="navigation-group justify-center">
            <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
          </ul>

          <ul class="flex w-full max-w-xl flex-col items-center gap-4 px-4">
            <template v-for="item in visiblePreviewItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
              <span v-else-if="item.type === 'DIVIDER'" :style="dividerStyle" />
              <div v-else-if="item.type === 'PHOTO_GRID'" :style="photoGridStyle">
                <img v-for="photo in item.photoGrid?.photos" :key="photo.id" :src="photo.url" class="rounded-lg">
              </div>
            </template>
          </ul>
        </div>
      </div>
    </transition>

    <!-- Desktop preview -->
    <div
      v-motion :initial="{ opacity: 0, x: 20 }"
      :visible="{ opacity: 1, x: 0 }" :duration="800"
      :style="backgroundStyle" class="scroll-hide relative hidden h-150 w-80 overflow-x-hidden rounded-[2.5rem] border-4 shadow-xl md:my-4 md:block 2xl:w-96"
    >
      <div class="sticky top-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div class="sticky top-2 w-full px-4">
        <div class="flex justify-end gap-2 text-black">
          <icon name="mdi:signal" size="15" />
          <icon name="mdi:wifi" size="15" />
        </div>
      </div>

      <div class="flex flex-col items-center justify-start gap-4 overflow-y-auto p-4 text-center">
        <div class="flex flex-col items-center gap-2">
          <img :src="user.image" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
          <p class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="slugStyle">
            @{{ user.slug }}
          </p>
          <p v-if="user.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm/4 whitespace-break-spaces" :style="descriptionStyle">
            <icon name="mdi:map-marker" size="15" />
            <span>{{ user.location }}</span>
          </p>
          <p v-if="user.description" class="line-clamp-3 max-w-sm truncate leading-4 whitespace-break-spaces" :style="descriptionStyle">
            {{ user.description }}
          </p>
        </div>

        <ul v-if="visibleIcons.length" class="navigation-group justify-center">
          <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
        </ul>

        <ul class="flex w-full max-w-xl flex-col items-center gap-4 px-4">
          <template v-for="item in visiblePreviewItems" :key="item.id">
            <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
            <span v-else-if="item.type === 'DIVIDER'" :style="dividerStyle" />
            <div v-else-if="item.type === 'PHOTO_GRID'" :style="photoGridStyle" class="grid grid-cols-2 gap-2 md:grid-cols-3">
              <img
                v-for="photo in item.photoGrid?.photos" :key="photo.id"
                :src="photo.url" :alt="photo.alt ?? `Photo ${photo.order}`"
                class="aspect-square w-full rounded-lg object-cover"
              >
            </div>
          </template>
        </ul>

        <p v-if="!visiblePreviewItems.length && !visibleIcons.length" :style="descriptionStyle">
          No content yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, preferences: storePreferences } = storeToRefs(useUserStore())
const { items } = storeToRefs(useProfileItemsStore())
const { isPreviewOpen, openPreview, closePreview } = useUIState()
const localPreferences = useState<UserPreferences | null>("localPreferences", () => null)
const preferences = computed(() => localPreferences.value || storePreferences.value)
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, dividerStyle, photoGridStyle } = useDynamicStyles(preferences)
const visiblePreviewItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.type !== "WIDGET" && item.isVisible !== false).sort((a, b) => a.order - b.order))
const visibleIcons = computed(() => (items.value ?? []).filter(item => item.type === "ICON" && item.isVisible !== false))
</script>

<style scoped>
.scroll-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}

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
