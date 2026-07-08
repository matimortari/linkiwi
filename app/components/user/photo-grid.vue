<template>
  <li class="flex w-full min-w-32">
    <div class="w-full overflow-hidden" :style="linkStyle()">
      <div class="grid grid-cols-2 gap-2 md:grid-cols-3" :style="photoGridInnerStyle">
        <img
          v-for="photo in photos" :key="photo.id"
          :src="photo.url" :alt="photo.alt ?? `Photo ${photo.order}`"
          class="aspect-square w-full object-cover"
        >
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: PhotoGridItem[]
  preferences: UserPreferences
}>()

const { linkStyle, photoGridInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
</script>
