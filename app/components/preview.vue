<template>
  <!-- Mobile toggle -->
  <button class="btn fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:hidden!" aria-label="Toggle Mobile Preview" @click="isPreviewOpen ? closePreview() : openPreview()">
    <icon :name="isPreviewOpen ? 'mdi:eye-off' : 'mdi:eye'" size="25" />
    <span>{{ isPreviewOpen ? 'Close Preview' : 'Preview' }}</span>
  </button>

  <div v-if="user" class="mx-auto flex justify-center select-none">
    <!-- Mobile full-screen preview -->
    <transition name="slide">
      <div v-if="isPreviewOpen" class="scroll-area fixed top-0 left-0 z-40 size-full overflow-y-auto pb-12 md:hidden" :style="backgroundStyle">
        <button class="btn fixed top-4 right-4 z-50 shadow-lg" aria-label="Close preview" @click="closePreview()">
          <icon name="mdi:close" size="25" />
        </button>

        <div v-if="user.banner?.url" class="relative h-36 w-full">
          <img :src="user.banner.url" alt="Profile Banner" class="size-full object-cover">
        </div>

        <div class="flex flex-col items-center justify-start gap-4 p-4 text-center" :class="{ 'relative z-10 -mt-14': user.banner?.url }">
          <div class="flex flex-col items-center gap-2">
            <img :src="user.image" alt="Avatar" class="size-16 object-cover" :style="profilePictureStyle">
            <p :style="slugStyle">
              @{{ user.slug }}
            </p>
            <p v-if="user.location" class="flex items-center gap-1" :style="descriptionStyle">
              <icon name="mdi:map-marker" size="15" />
              <span>{{ user.location }}</span>
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
              <UserPhotoGrid v-else-if="item.type === 'PHOTO_GRID' && item.photoGrid?.photos?.length" :photos="item.photoGrid.photos.slice(0, 9)" :preferences="preferences" />

              <li v-else-if="item.type === 'WIDGET' && item.widget" class="flex w-full min-w-32">
                <div class="flex w-full items-center gap-2 overflow-hidden" :style="linkStyle()">
                  <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" :style="linkInnerStyle" />
                  <div class="flex min-w-0 flex-col text-left">
                    <span class="truncate text-xs font-semibold" :style="linkInnerStyle">{{ WIDGET_LABELS[item.widget.type] }}</span>
                    <span class="truncate text-xs opacity-60" :style="linkInnerStyle">{{ item.widget.handle }}</span>
                  </div>
                </div>
              </li>
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
      :style="backgroundStyle" class="relative hidden h-150 w-80 overflow-x-hidden rounded-[2.5rem] border-4 shadow-xl md:my-4 md:block"
    >
      <div class="absolute top-2 left-1/2 z-30 h-1.5 w-24 -translate-x-1/2 rounded-full bg-[#111827]" />
      <div class="absolute top-2 z-30 w-full px-6">
        <div class="flex justify-end gap-2 text-[#f9fafb]">
          <icon name="mdi:signal" size="15" />
          <icon name="mdi:wifi" size="15" />
        </div>
      </div>

      <div
        class="scroll-hide flex h-full flex-col items-center justify-start gap-4 overflow-y-auto text-center"
      >
        <div v-if="user.banner?.url" class="h-32 w-full shrink-0">
          <img :src="user.banner.url" alt="Profile Banner" class="size-full object-cover">
        </div>

        <div class="flex w-full flex-col items-center gap-4 px-4 py-8" :class="{ 'relative z-10 -mt-24': user.banner?.url }">
          <div class="flex flex-col items-center gap-2">
            <img :src="user.image" alt="Avatar" class="size-20 object-cover" :style="profilePictureStyle">
            <p :style="slugStyle">
              @{{ user.slug }}
            </p>
            <p v-if="user.location" class="flex items-center gap-1" :style="descriptionStyle">
              <icon name="mdi:map-marker" size="15" />
              <span>{{ user.location }}</span>
            </p>
            <p v-if="user.description" class="line-clamp-2 max-w-xs" :style="descriptionStyle">
              {{ user.description }}
            </p>
          </div>

          <ul v-if="visibleIcons.length" class="flex flex-row flex-wrap justify-center gap-2">
            <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
          </ul>

          <ul class="flex w-full flex-col items-center gap-2">
            <template v-for="item in visiblePreviewItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
              <span v-else-if="item.type === 'DIVIDER'" class="w-full" :style="dividerStyle" />
              <UserPhotoGrid v-else-if="item.type === 'PHOTO_GRID' && item.photoGrid?.photos?.length" :photos="item.photoGrid.photos.slice(0, 9)" :preferences="preferences" />
              <li v-else-if="item.type === 'WIDGET' && item.widget" class="flex w-full min-w-32">
                <div class="flex w-full items-center gap-2 overflow-hidden" :style="linkStyle()">
                  <icon :name="WIDGET_ICONS[item.widget.type]" size="20" class="shrink-0" :style="linkInnerStyle" />
                  <div class="flex min-w-0 flex-col text-left">
                    <span class="truncate text-xs font-semibold" :style="linkInnerStyle">{{ WIDGET_LABELS[item.widget.type] }}</span>
                    <span class="truncate text-xs opacity-60" :style="linkInnerStyle">{{ item.widget.handle }}</span>
                  </div>
                </div>
              </li>
            </template>
            <p v-if="!visiblePreviewItems.length && !visibleIcons.length" class="text-xs opacity-50" :style="descriptionStyle">
              No content yet.
            </p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, preferences: storePreferences } = storeToRefs(useUserStore())
const { items } = storeToRefs(useProfileItemsStore())
const { isPreviewOpen, openPreview, closePreview } = useUIState()
const localPreferences = useState<UserPreferences | null>("localPreferences", () => null)
const pendingThemeTitle = useState<string | null>("pendingThemeTitle", () => null)

const preferences = computed(() => {
  const base = localPreferences.value || storePreferences.value
  if (!pendingThemeTitle.value) {
    return base
  }

  const theme = THEMES.find(t => t.title === pendingThemeTitle.value)
  return theme ? { ...base, ...theme.preferences } : base
})

const { profilePictureStyle, slugStyle, descriptionStyle, linkStyle, linkInnerStyle } = useDynamicStyles(computed(() => preferences.value))
const { backgroundStyle, dividerStyle } = useDynamicStyles(preferences)
const visibleIcons = computed(() => (items.value ?? []).filter(item => item.type === "ICON" && item.isVisible !== false))
const visiblePreviewItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.isVisible !== false).sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))

function scrollLock(locked: boolean) {
  const val = locked ? "hidden" : ""
  document.documentElement.style.overflow = val
  document.body.style.overflow = val
}

watch(isPreviewOpen, scrollLock)

onBeforeUnmount(() => scrollLock(false))
</script>

<style scoped>
.scroll-hide {
  scrollbar-width: none;
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
