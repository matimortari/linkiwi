<template>
  <li class="relative flex w-full max-w-80 min-w-32 flex-row items-center justify-center" :style="linkStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="link.url" class="flex size-full items-center justify-center" @click="$emit('click')">
      <span class="mx-2 inline-block truncate px-4 text-center" :style="linkInnerStyle">{{ link.title }}</span>
    </nuxt-link>

    <button v-if="preferences?.showLinkCopyButton" class="absolute right-2 shrink-0" aria-label="Copy Link" @click.stop="copyToClipboard(link.url)">
      <icon :name="isCopied ? 'mdi:check' : 'mdi:content-copy'" size="15" :style="{ color: preferences?.linkTextColor }" />
    </button>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  link: Link
  preferences: UserPreferences | null
}>()

defineEmits<{ (e: "click"): void }>()

const { linkStyle, linkInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
const isHovered = ref(false)
const isCopied = ref(false)
</script>
