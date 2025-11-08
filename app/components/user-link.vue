<template>
  <li class="relative flex w-full max-w-80 min-w-32 flex-row items-center justify-center" :style="linkStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="url" class="flex size-full items-center justify-center" @click="$emit('click')">
      <span class="mx-2 inline-block truncate px-4 text-center" :style="linkInnerStyle">{{ title }}</span>
    </nuxt-link>

    <button v-if="preferences?.showLinkCopyButton" class="absolute right-2 shrink-0" aria-label="Copy Link" @click.stop="copyToClipboard(url)">
      <icon :name="isCopied ? 'mdi:check' : 'mdi:content-copy'" size="15" :style="{ color: preferences?.linkTextColor }" />
    </button>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
  preferences: UserPreferences | null
}>()

defineEmits(["click"])

const { linkStyle, linkInnerStyle } = useDynamicStyles(toRef(props, "preferences"))

const isHovered = ref(false)
const isCopied = ref(false)
</script>
