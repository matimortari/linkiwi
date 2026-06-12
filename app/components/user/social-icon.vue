<template>
  <li class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link
      :to="item.icon?.url" class="flex size-full items-center justify-center"
      :aria-label="item.icon?.platform ?? ''" target="_blank"
      @click="handleClick"
    >
      <icon :name="item.icon?.logo ?? 'mdi:help'" size="20" :style="iconInnerStyle" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: ProfileItem
  preferences: UserPreferences
}>()

const emit = defineEmits<{ click: [] }>()

const isHovered = ref(false)

async function handleClick(event: MouseEvent) {
  event.preventDefault()
  emit("click")
  await nextTick()
  if (props.item.icon?.url) {
    window.open(props.item.icon.url, "_blank", "noopener,noreferrer")
  }
}

const { iconStyle, iconInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
</script>
