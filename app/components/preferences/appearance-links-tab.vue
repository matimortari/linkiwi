<template>
  <div class="grid grid-cols-1 gap-2 py-2 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <PreferencesAppearanceColorPicker id="linkBackgroundColor" v-model:value="localPrefs.linkBackgroundColor" label="Background Color" />
      <PreferencesAppearanceColorPicker id="linkTextColor" v-model:value="localPrefs.linkTextColor" label="Font Color" />
      <PreferencesAppearanceSelect id="linkFontFamily" v-model:value="localPrefs.linkFontFamily" label="Font Family" :options="FONT_FAMILIES" />
      <PreferencesAppearanceSelect id="linkTextSize" v-model:value="localPrefs.linkTextSize" label="Font Size" :options="LINK_FONT_SIZES" />
      <PreferencesAppearanceSelect id="linkTextWeight" v-model:value="localPrefs.linkTextWeight" label="Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesAppearanceSelect id="linkBorderRadius" v-model:value="localPrefs.linkBorderRadius" label="Radius" :options="RADIUS_SIZES" />
      <PreferencesAppearanceSelect id="linkPadding" v-model:value="localPrefs.linkPadding" label="Padding" :options="LINK_PADDING_SIZES" />
    </div>

    <div class="flex flex-col gap-2">
      <PreferencesAppearanceColorPicker id="linkHoverBackgroundColor" v-model:value="localPrefs.linkHoverBackgroundColor" label="Hover Background Color" />
      <PreferencesAppearanceCheckbox id="isLinkShadow" v-model:value="localPrefs.isLinkShadow" label="Enable Shadow" />
      <PreferencesAppearanceColorPicker id="linkShadowColor" v-model:value="localPrefs.linkShadowColor" label="Shadow Color" :disabled="isLinkShadowDisabled" />
      <PreferencesAppearanceSelect
        id="linkShadowWeight" v-model:value="localPrefs.linkShadowWeight"
        label="Shadow Weight" :options="SHADOW_WEIGHTS"
        :disabled="isLinkShadowDisabled"
      />
      <PreferencesAppearanceCheckbox id="showLinkCopyButton" v-model:value="localPrefs.showLinkCopyButton" label="Show 'Copy to Clipboard' Button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FONT_FAMILIES, FONT_WEIGHTS, LINK_FONT_SIZES, LINK_PADDING_SIZES, RADIUS_SIZES, SHADOW_WEIGHTS } from "#shared/config/appearance-options"

const props = defineProps<{
  preferences: UserPreferences
}>()

const emit = defineEmits<{
  (e: "update:preferences", value: UserPreferences): void
}>()

const localPrefs = reactive({ ...props.preferences, linkFontFamily: props.preferences.linkFontFamily ?? "'Roboto'" })

const isLinkShadowDisabled = computed(() => localPrefs.isLinkShadow)

watch(localPrefs, (newVal) => {
  emit("update:preferences", { ...newVal })
}, { deep: true })
</script>
