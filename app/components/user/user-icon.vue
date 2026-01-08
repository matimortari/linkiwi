<template>
  <li class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="item.url" class="flex size-full items-center justify-center" target="_blank" @click="handleClick">
      <icon :name="item.logo" size="20" :style="iconInnerStyle" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: Icon
  preferences: UserPreferences
}>()

const emit = defineEmits<(e: "click") => void>()

const isHovered = ref(false)

async function handleClick(event: MouseEvent) {
  event.preventDefault()
  emit("click")
  await nextTick()
  window.open(props.item.url, "_blank", "noopener,noreferrer")
}

const { iconStyle, iconInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
</script>
