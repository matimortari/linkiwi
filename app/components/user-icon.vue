<template>
  <li class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="icon.url" class="flex size-full items-center justify-center" @click="$emit('click')">
      <icon :name="icon.logo" size="20" :style="iconInnerStyle" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: Icon
  preferences: UserPreferences | null
}>()

defineEmits<{ (e: "click"): void }>()

const { iconStyle, iconInnerStyle } = useDynamicStyles(toRef(props, "preferences"))
const isHovered = ref(false)
</script>
