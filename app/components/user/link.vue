<template>
  <li class="flex w-full max-w-80 min-w-32">
    <nuxt-link
      :to="item.link?.url" class="relative flex w-full items-center justify-center gap-2"
      :style="linkStyle(isHovered)" @mouseenter="isHovered = true"
      @mouseleave="isHovered = false" @click="handleClick"
    >
      <img v-if="item.link?.imageUrl" :src="item.link.imageUrl" :alt="item.link.label" class="absolute left-2 size-8 shrink-0 rounded-full object-cover">
      <span class="inline-block truncate text-center" :style="linkInnerStyle">{{ item.link?.label }}</span>

      <button
        v-if="preferences.showLinkCopyButton" class="absolute inset-y-0 right-2 flex shrink-0 items-center transition-transform hover:scale-110"
        aria-label="Copy Link" type="button"
        @click.stop.prevent="copyAction.triggerCopy(item.link?.url ?? '')"
      >
        <icon :name="copyAction.icon.value" size="15" :style="{ color: preferences.linkTextColor }" />
      </button>
    </nuxt-link>
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
