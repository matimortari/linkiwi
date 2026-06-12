<template>
  <div class="grid grid-cols-2 gap-2 md:grid-cols-3" :style="photoGridStyle">
    <img
      v-for="photo in photos" :key="photo.id"
      :src="photo.url" :alt="photo.alt ?? `Photo ${photo.order}`"
      class="aspect-square w-full rounded-lg object-cover"
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: PhotoGridItem[]
  preferences: UserPreferences
}>()

const { photoGridStyle } = useDynamicStyles(toRef(props, "preferences"))
</script>
