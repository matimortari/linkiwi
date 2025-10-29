<template>
  <div class="grid grid-cols-1 gap-2 py-2 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <PreferencesAppearanceSelect id="supportBanner" v-model:value="localPrefs.supportBanner" label="Support Banner" :options="BANNER_OPTIONS" />
      <PreferencesAppearanceSelect id="profilePictureRadius" v-model:value="localPrefs.profilePictureRadius" label="Profile Picture Radius" :options="RADIUS_SIZES" />
      <PreferencesAppearanceColorPicker id="profilePictureBorderColor" v-model:value="localPrefs.profilePictureBorderColor" label="Profile Picture Border Color" />
      <PreferencesAppearanceSelect id="profilePictureBorderWidth" v-model:value="localPrefs.profilePictureBorderWidth" label="Profile Picture Border Width" :options="BORDER_WIDTHS" />
      <PreferencesAppearanceSelect id="slugFontFamily" v-model:value="localPrefs.slugFontFamily" label="Username Font Family" :options="FONT_FAMILIES" />
      <PreferencesAppearanceSelect id="slugTextSize" v-model:value="localPrefs.slugTextSize" label="Username Font Size" :options="FONT_SIZES" />
      <PreferencesAppearanceSelect id="slugTextWeight" v-model:value="localPrefs.slugTextWeight" label="Username Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesAppearanceColorPicker id="slugTextColor" v-model:value="localPrefs.slugTextColor" label="Username Font Color" />
    </div>

    <div class="flex flex-col gap-2">
      <PreferencesAppearanceSelect id="headerFontFamily" v-model:value="localPrefs.headerFontFamily" label="Header Font Family" :options="FONT_FAMILIES" />
      <PreferencesAppearanceSelect id="headerTextSize" v-model:value="localPrefs.headerTextSize" label="Header Font Size" :options="FONT_SIZES" />
      <PreferencesAppearanceSelect id="headerTextWeight" v-model:value="localPrefs.headerTextWeight" label="Header Font Weight" :options="FONT_WEIGHTS" />
      <PreferencesAppearanceColorPicker id="headerTextColor" v-model:value="localPrefs.headerTextColor" label="Header Font Color" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BANNER_OPTIONS, BORDER_WIDTHS, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS, RADIUS_SIZES } from "#shared/lib/constants"

const props = defineProps<{
  preferences: UserPreferences
}>()

const emit = defineEmits<{
  (e: "update:preferences", value: UserPreferences): void
}>()

const localPrefs = reactive({ ...props.preferences })

watch(localPrefs, (newVal) => {
  emit("update:preferences", { ...newVal })
}, { deep: true })
</script>
