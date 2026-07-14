<template>
  <li class="flex w-full min-w-32">
    <div class="w-full overflow-hidden" :style="linkStyle()">
      <div class="grid grid-cols-3 gap-2">
        <img
          v-for="photo in photos" :key="photo.id"
          :src="photo.url" :alt="photo.alt ?? `Photo ${photo.order}`"
          class="aspect-square w-full object-cover" :style="photoStyle"
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

const { linkStyle } = useDynamicStyles(toRef(props, "preferences"))
const photoStyle = computed(() => ({ borderRadius: props.preferences.linkBorderRadius }))
</script>
