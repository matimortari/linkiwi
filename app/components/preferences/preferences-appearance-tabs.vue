<template>
  <div v-if="props.activeTab === 'background'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <PreferencesRadioOptions v-model:value="localPrefs.backgroundType" name="backgroundType" label="Background Type" :options="BACKGROUND_TYPES" />

    <div class="flex flex-col gap-2">
      <PreferencesColorPicker id="backgroundColor" v-model:value="localPrefs.backgroundColor" label="Background Color" :disabled="isBackgroundGradient" />
      <PreferencesColorPicker id="backgroundGradientStart" v-model:value="localPrefs.backgroundGradientStart" label="Gradient Start Color" :disabled="isBackgroundFlat" />
      <PreferencesColorPicker id="backgroundGradientEnd" v-model:value="localPrefs.backgroundGradientEnd" label="Gradient End Color" :disabled="isBackgroundFlat" />
    </div>
  </div>

  <div v-if="props.activeTab === 'user'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <PreferencesSelect id="supportBanner" v-model:value="localPrefs.supportBanner" label="Support Banner" :options="BANNER_OPTIONS" />
      <PreferencesSelect id="profilePictureRadius" v-model:value="localPrefs.profilePictureRadius" label="Profile Picture Radius" :options="RADIUS_SIZES" />
      <PreferencesColorPicker id="profilePictureBorderColor" v-model:value="localPrefs.profilePictureBorderColor" label="Profile Picture Border Color" />
      <PreferencesSelect id="profilePictureBorderWidth" v-model:value="localPrefs.profilePictureBorderWidth" label="Profile Picture Border Width" :options="BORDER_WIDTHS" />
      <PreferencesSelect id="slugFontFamily" v-model:value="localPrefs.slugFontFamily" label="Username Font Family" :options="FONT_FAMILIES" />
      <PreferencesSelect id="slugTextSize" v-model:value="localPrefs.slugTextSize" label="Username Font Size" :options="FONT_SIZES" />
      <PreferencesSelect id="slugTextWeight" v-model:value="localPrefs.slugTextWeight" label="Username Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesColorPicker id="slugTextColor" v-model:value="localPrefs.slugTextColor" label="Username Font Color" />
    </div>

    <div class="flex flex-col gap-2">
      <PreferencesSelect id="headerFontFamily" v-model:value="localPrefs.headerFontFamily" label="Header Font Family" :options="FONT_FAMILIES" />
      <PreferencesSelect id="headerTextSize" v-model:value="localPrefs.headerTextSize" label="Header Font Size" :options="FONT_SIZES" />
      <PreferencesSelect id="headerTextWeight" v-model:value="localPrefs.headerTextWeight" label="Header Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesColorPicker id="headerTextColor" v-model:value="localPrefs.headerTextColor" label="Header Font Color" />
    </div>
  </div>

  <div v-if="props.activeTab === 'links'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <PreferencesColorPicker id="linkBackgroundColor" v-model:value="localPrefs.linkBackgroundColor" label="Background Color" />
      <PreferencesColorPicker id="linkTextColor" v-model:value="localPrefs.linkTextColor" label="Font Color" />
      <PreferencesSelect id="linkFontFamily" v-model:value="localPrefs.linkFontFamily" label="Font Family" :options="FONT_FAMILIES" />
      <PreferencesSelect id="linkTextSize" v-model:value="localPrefs.linkTextSize" label="Font Size" :options="LINK_FONT_SIZES" />
      <PreferencesSelect id="linkTextWeight" v-model:value="localPrefs.linkTextWeight" label="Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesSelect id="linkBorderRadius" v-model:value="localPrefs.linkBorderRadius" label="Radius" :options="RADIUS_SIZES" />
      <PreferencesSelect id="linkPadding" v-model:value="localPrefs.linkPadding" label="Padding" :options="LINK_PADDING_SIZES" />
    </div>

    <div class="flex flex-col gap-2">
      <PreferencesColorPicker id="linkHoverBackgroundColor" v-model:value="localPrefs.linkHoverBackgroundColor" label="Hover Background Color" />
      <PreferencesCheckbox id="isLinkShadow" v-model:value="localPrefs.isLinkShadow" label="Enable Shadow" />
      <PreferencesColorPicker id="linkShadowColor" v-model:value="localPrefs.linkShadowColor" label="Shadow Color" :disabled="isLinkShadowDisabled" />
      <PreferencesSelect
        id="linkShadowWeight" v-model:value="localPrefs.linkShadowWeight"
        label="Shadow Weight" :options="SHADOW_WEIGHTS"
        :disabled="isLinkShadowDisabled"
      />
      <PreferencesCheckbox id="showLinkCopyButton" v-model:value="localPrefs.showLinkCopyButton" label="Show 'Copy to Clipboard' Button" />
    </div>
  </div>

  <div v-if="props.activeTab === 'icons'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <PreferencesColorPicker id="iconBackgroundColor" v-model:value="localPrefs.iconBackgroundColor" label="Background Color" />
      <PreferencesColorPicker id="iconLogoColor" v-model:value="localPrefs.iconLogoColor" label="Icon Color" />
      <PreferencesColorPicker id="iconHoverBackgroundColor" v-model:value="localPrefs.iconHoverBackgroundColor" label="Hover Background Color" />
    </div>

    <div class="flex flex-col gap-2">
      <PreferencesCheckbox id="isIconShadow" v-model:value="localPrefs.isIconShadow" label="Enable Shadow" />
      <PreferencesColorPicker id="iconShadowColor" v-model:value="localPrefs.iconShadowColor" label="Shadow Color" :disabled="isIconShadowDisabled" />
      <PreferencesSelect
        id="iconShadowWeight" v-model:value="localPrefs.iconShadowWeight"
        label="Shadow Weight" :options="SHADOW_WEIGHTS"
        :disabled="isIconShadowDisabled"
      />
    </div>
  </div>

  <PreferencesThemeTab v-if="props.activeTab === 'themes'" :preferences="preferences" />
</template>

<script setup lang="ts">
const props = defineProps<{
  preferences: UserPreferences
  activeTab: string
}>()

const emit = defineEmits<{
  (e: "update:preferences", value: UserPreferences): void
  (e: "update:activeTab", value: string): void
}>()

const localPrefs = ref({ ...toRaw(props.preferences) })
const isBackgroundFlat = computed(() => localPrefs.value.backgroundType === "FLAT")
const isBackgroundGradient = computed(() => localPrefs.value.backgroundType === "GRADIENT")
const isLinkShadowDisabled = computed(() => !localPrefs.value.isLinkShadow)
const isIconShadowDisabled = computed(() => !localPrefs.value.isIconShadow)

watch(localPrefs, (newVal) => {
  emit("update:preferences", { ...newVal })
}, { deep: true })

watch(() => props.preferences, (newPrefs) => {
  localPrefs.value = { ...toRaw(newPrefs) }
}, { deep: true })
</script>
