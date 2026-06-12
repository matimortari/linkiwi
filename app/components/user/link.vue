<template>
  <li class="relative flex w-full max-w-80 min-w-32 flex-row items-center justify-center" :style="linkStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="item.link?.url" class="flex size-full items-center justify-center" target="_blank" @click="handleClick">
      <span class="mx-2 inline-block truncate px-4 text-center" :style="linkInnerStyle">{{ item.link?.label }}</span>
    </nuxt-link>

    <button v-if="preferences.showLinkCopyButton" class="absolute right-2 shrink-0 transition-transform hover:scale-110" aria-label="Copy Link" @click.stop="copyAction.triggerCopy(item.link?.url ?? '')">
      <icon :name="copyAction.icon.value" size="15" :style="{ color: preferences.linkTextColor }" />
    </button>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: ProfileItem
  preferences: UserPreferences
}>()

const emit = defineEmits<{ click: [] }>()

const { createActionHandler } = useActionIcon()
const { linkStyle, linkInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
const isHovered = ref(false)
const copyAction = createActionHandler("mdi:content-copy")

async function handleClick(event: MouseEvent) {
  event.preventDefault()
  emit("click")
  await nextTick()
  if (props.item.link?.url) {
    window.open(props.item.link.url, "_blank", "noopener,noreferrer")
  }
}
</script>
