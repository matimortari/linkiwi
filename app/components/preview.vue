<template>
  <!-- Mobile toggle -->
  <button class="btn fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden!" aria-label="Toggle Mobile Preview" @click="isPreviewOpen ? closePreview() : openPreview()">
    <icon :name="isPreviewOpen ? 'mdi:eye-off' : 'mdi:eye'" size="25" />
    <span>{{ isPreviewOpen ? 'Close Preview' : 'Preview' }}</span>
  </button>

  <div v-if="user" class="mx-auto flex justify-center select-none">
    <!-- Mobile full-screen preview -->
    <transition name="slide">
      <div v-if="isPreviewOpen" class="scroll-area fixed top-0 left-0 z-40 size-full overflow-y-auto pb-12 md:hidden" :style="backgroundStyle">
        <div v-if="user.banner?.url" class="relative h-36 w-full">
          <img :src="user.banner.url" alt="Profile Banner" class="size-full object-cover">
        </div>

        <div class="flex flex-col items-center justify-start gap-4 p-4 text-center" :class="{ 'relative z-10 -mt-14': user.banner?.url }">
          <div class="flex flex-col items-center gap-2">
            <img :src="user.image" alt="Avatar" class="size-16 object-cover" :style="profilePictureStyle">
            <p :style="slugStyle">
              @{{ user.slug }}
            </p>
<<<<<<< Updated upstream
            <p v-if="user.location" class="flex items-center gap-1" :style="descriptionStyle">
||||||| Stash base
            <p v-if="user.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm! leading-4 whitespace-break-spaces" :style="descriptionStyle">
=======
            <p v-if="user.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm/4 whitespace-break-spaces" :style="descriptionStyle">
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
                <icon :name="WIDGET_ICONS[item.widget.type as keyof typeof WIDGET_ICONS]" size="20" class="shrink-0" />
                <div class="flex min-w-0 flex-col text-left">
                  <span class="text-xs font-semibold">{{ WIDGET_LABELS[item.widget.type as keyof typeof WIDGET_LABELS] }}</span>
                  <span class="truncate text-xs opacity-60">{{ item.widget.handle }}</span>
                </div>
              </div>
            </template>

            <p v-if="!visiblePreviewItems.length && !visibleIcons.length" class="text-xs opacity-50" :style="descriptionStyle">
              No content yet.
            </p>
||||||| Stash base
          <div class="w-full">
            <ul class="flex w-full flex-col items-center gap-4">
              <template v-for="item in visibleMainItems" :key="item.id">
                <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
                <div v-else-if="item.type === 'WIDGET'" class="w-full text-xs" :style="descriptionStyle">
                  Widget: {{ item.widget?.type }}
                </div>
                <div v-else-if="item.type === 'DIVIDER'" :style="dividerStyle" />
                <div v-else-if="item.type === 'PHOTO_GRID'" :style="photoGridStyle">
                  <img v-for="photo in item.photoGrid?.photos" :key="photo.id" :src="photo.url" class="rounded-lg">
                </div>
              </template>
            </ul>
          </div>
=======
          <ul class="flex w-full max-w-xl flex-col items-center gap-4 px-4">
            <template v-for="item in visiblePreviewItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
              <span v-else-if="item.type === 'DIVIDER'" :style="dividerStyle" />
              <div v-else-if="item.type === 'PHOTO_GRID'" :style="photoGridStyle">
                <img v-for="photo in item.photoGrid?.photos" :key="photo.id" :src="photo.url" class="rounded-lg">
              </div>
            </template>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      <div
        class="scroll-hide flex h-full flex-col items-center justify-start gap-4 overflow-y-auto text-center"
      >
        <div v-if="user.banner?.url" class="h-32 w-full shrink-0">
          <img :src="user.banner.url" alt="Profile Banner" class="size-full object-cover">
||||||| Stash base
      <div class="flex flex-col items-center justify-start gap-4 overflow-y-auto p-4 text-center">
        <div class="flex flex-col items-center gap-2">
          <img :src="user.image" alt="Avatar" class="size-24 object-cover" :style="profilePictureStyle">
          <p class="line-clamp-3 max-w-sm truncate whitespace-break-spaces" :style="slugStyle">
            @{{ user.slug }}
          </p>
          <p v-if="user.location" class="flex max-w-sm flex-row items-center gap-1 truncate text-sm! leading-4 whitespace-break-spaces" :style="descriptionStyle">
            <icon name="mdi:map-marker" size="15" />
            <span>{{ user.location }}</span>
          </p>
          <p v-if="user.description" class="line-clamp-3 max-w-sm truncate leading-4 whitespace-break-spaces" :style="descriptionStyle">
            {{ user.description }}
          </p>
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
          <ul v-if="visibleIcons.length" class="flex flex-row flex-wrap justify-center gap-2">
            <UserSocialIcon v-for="item in visibleIcons" :key="item.id" :item="item" :preferences="preferences" />
          </ul>

          <ul class="flex w-full flex-col items-center gap-2">
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
                <icon :name="WIDGET_ICONS[item.widget.type as keyof typeof WIDGET_ICONS]" size="20" class="shrink-0" />
                <div class="flex min-w-0 flex-col text-left">
                  <span class="text-xs font-semibold">{{ WIDGET_LABELS[item.widget.type as keyof typeof WIDGET_LABELS] }}</span>
                  <span class="truncate text-xs opacity-60">{{ item.widget.handle }}</span>
                </div>
              </div>
            </template>
            <p v-if="!visiblePreviewItems.length && !visibleIcons.length" class="text-xs opacity-50" :style="descriptionStyle">
              No content yet.
            </p>
          </ul>
        </div>
||||||| Stash base
        <div class="w-full">
          <ul class="flex w-full flex-col items-center gap-4">
            <template v-for="item in visibleMainItems" :key="item.id">
              <UserLink v-if="item.type === 'LINK'" :item="item" :preferences="preferences" />
              <div v-else-if="item.type === 'WIDGET'" class="w-full text-xs" :style="descriptionStyle">
                Widget: {{ item.widget?.type }}
              </div>
              <div v-else-if="item.type === 'DIVIDER'" :style="dividerStyle" />
              <div v-else-if="item.type === 'PHOTO_GRID'" :style="descriptionStyle">
                <img v-for="photo in item.photoGrid?.photos" :key="photo.id" :src="photo.url" class="rounded-lg">
              </div>
            </template>
          </ul>
        </div>
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
const { profilePictureStyle, slugStyle, descriptionStyle } = useDynamicStyles(computed(() => preferences.value))
const { backgroundStyle, dividerStyle } = useDynamicStyles(preferences)

||||||| Stash base
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, dividerStyle, photoGridStyle } = useDynamicStyles(preferences)
const visibleMainItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.isVisible !== false).sort((a, b) => a.order - b.order))
=======
const { backgroundStyle, profilePictureStyle, slugStyle, descriptionStyle, dividerStyle, photoGridStyle } = useDynamicStyles(preferences)
const visiblePreviewItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.type !== "WIDGET" && item.isVisible !== false).sort((a, b) => a.order - b.order))
>>>>>>> Stashed changes
const visibleIcons = computed(() => (items.value ?? []).filter(item => item.type === "ICON" && item.isVisible !== false))
const widgetCardStyle = computed(() => ({ backgroundColor: preferences.value?.linkBackgroundColor ?? "#e2e8f0", color: preferences.value?.linkTextColor ?? "#475569" }))
const visiblePreviewItems = computed(() => (items.value ?? []).filter(item => item.type !== "ICON" && item.isVisible !== false).sort((a, b) => {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  }
  return a.order - b.order
}))
</script>

<style scoped>
.scroll-hide {
  scrollbar-width: none;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}
</style>
