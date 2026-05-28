<template>
  <div v-if="embedUrl" class="overflow-hidden rounded-xl" :style="linkStyle()">
    <iframe
      :src="embedUrl" width="100%"
      height="152" frameborder="0"
      loading="lazy" style="border-radius: 12px"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  handle: string
  preferences: UserPreferences
}>()

const { linkStyle } = useDynamicStyles(toRef(props, "preferences"))

const embedUrl = computed(() => {
  const urlMatch = props.handle.trim().match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(?:[a-z]{2}(?:-[a-z]{2,4})?\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
  if (urlMatch) {
    return `https://open.spotify.com/embed/${urlMatch[1]}/${urlMatch[2]}?utm_source=generator`
  }

  const uriMatch = props.handle.trim().match(/spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/)
  if (uriMatch) {
    return `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}?utm_source=generator`
  }

  return null
})
</script>
