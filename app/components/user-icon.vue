<template>
  <li class="flex size-10 items-center justify-center rounded-full" :style="iconStyle(isHovered)" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <nuxt-link :to="url" class="flex size-full items-center justify-center" @click="$emit('click')">
      <icon :name="logo" size="20" :style="iconInnerStyle" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
  logo: string
  preferences: UserPreferences | null
}>()

defineEmits(["click"])

const { iconStyle, iconInnerStyle } = useDynamicStyles(toRef(props, "preferences"))

const isHovered = ref(false)
</script>
