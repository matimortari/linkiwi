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
        <div class="flex flex-col items-center justify-start gap-3 p-4 text-center">
          <div class="flex flex-col items-center gap-1.5">
            <img :src="user.image" alt="Avatar" class="size-16 object-cover" :style="profilePictureStyle">
            <p :style="slugStyle">
              @{{ user.slug }}
            </p>
            <p v-if="user.location" class="flex items-center gap-1" :style="descriptionStyle">
              <icon name="mdi:map-marker" size="15" />
              {{ user.location }}
            </p>
            <p v-if="user.description" class="line-clamp-2 max-w-xs" :style="descriptionStyle">
              {{ user.description }}
            </p>
          </div>

          <ul v-if="visibleIcons.length" class="flex flex-row flex-wrap justify-center gap-1.5">
            <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
          </ul>

          <ul class="flex w-full flex-col items-center gap-2 px-2">
            <template v-for="item in visiblePreviewItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
              <span v-else-if="item.type === 'DIVIDER'" class="w-full" :style="dividerStyle" />
              <div v-else-if="item.type === 'PHOTO_GRID' && item.photoGrid?.photos?.length" class="grid w-full grid-cols-3 gap-0.5 overflow-hidden rounded-lg">
                <img
                  v-for="photo in item.photoGrid.photos.slice(0, 9)" :key="photo.id"
                  :src="photo.url" :alt="photo.alt ?? ''"
                  class="aspect-square w-full object-cover"
                >
              </div>

              <div v-else-if="item.type === 'WIDGET' && item.widget" class="flex w-full items-center gap-2 rounded-lg border px-3 py-2" :style="widgetCardStyle">
                <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" />
                <div class="flex min-w-0 flex-col text-left">
                  <span class="text-xs font-semibold">{{ WIDGET_LABELS[item.widget.type] }}</span>
                  <span class="truncate text-xs opacity-60">{{ item.widget.handle }}</span>
                </div>
              </div>
            </template>

            <p v-if="!visiblePreviewItems.length && !visibleIcons.length" class="text-xs opacity-50" :style="descriptionStyle">
              No content yet.
            </p>
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
      <div class="flex flex-col items-center justify-start gap-3 p-4 text-center">
        <div class="flex flex-col items-center gap-1.5">
          <img :src="user.image" alt="Avatar" class="size-16 object-cover" :style="profilePictureStyle">
          <p :style="slugStyle">
            @{{ user.slug }}
          </p>
          <p v-if="user.location" class="flex items-center gap-1" :style="descriptionStyle">
            <icon name="mdi:map-marker" size="15" />
            {{ user.location }}
          </p>
          <p v-if="user.description" class="line-clamp-2 max-w-xs" :style="descriptionStyle">
            {{ user.description }}
          </p>
        </div>

        <ul v-if="visibleIcons.length" class="flex flex-row flex-wrap justify-center gap-1.5">
          <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
        </ul>

        <ul class="flex w-full flex-col items-center gap-2 px-2">
          <template v-for="item in visiblePreviewItems" :key="item.id">
            <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
            <span v-else-if="item.type === 'DIVIDER'" class="w-full" :style="dividerStyle" />
            <div v-else-if="item.type === 'PHOTO_GRID' && item.photoGrid?.photos?.length" class="grid w-full grid-cols-3 gap-0.5 overflow-hidden rounded-lg">
              <img
                v-for="photo in item.photoGrid.photos.slice(0, 9)" :key="photo.id"
                :src="photo.url" :alt="photo.alt ?? ''"
                class="aspect-square w-full object-cover"
              >
            </div>

            <div v-else-if="item.type === 'WIDGET' && item.widget" class="flex w-full items-center gap-2 rounded-lg border px-3 py-2" :style="widgetCardStyle">
              <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" />
              <div class="flex min-w-0 flex-col text-left">
                <span class="text-xs font-semibold">{{ WIDGET_LABELS[item.widget.type] }}</span>
                <span class="truncate text-xs opacity-60">{{ item.widget.handle }}</span>
              </div>
            </div>
          </template>

          <p v-if="!visiblePreviewItems.length && !visibleIcons.length" class="text-xs opacity-50" :style="descriptionStyle">
            No content yet.
          </p>
        </ul>
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
const { profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(computed(() => preferences.value))
const { backgroundStyle, dividerStyle } = useDynamicStyles(preferences)
const visibleIcons = computed(() => (items.value ?? []).filter(item => item.type === "ICON" && item.isVisible !== false))
const visiblePreviewItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.isVisible !== false).sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

const widgetCardStyle = computed(() => ({ backgroundColor: preferences.value?.linkBackgroundColor ?? "#e2e8f0", color: preferences.value?.linkTextColor ?? "#475569" }))
</script>

<style scoped>
.scroll-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}
.slide-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-leave-active {
  transition: transform 0.3s ease-in;
}
</style>
