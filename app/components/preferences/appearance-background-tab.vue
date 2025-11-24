<template>
  <div class="grid grid-cols-1 gap-2 py-2 md:grid-cols-2">
    <PreferencesAppearanceRadioOptions v-model:value="localPrefs.backgroundType" name="backgroundType" label="Background Type" :options="BACKGROUND_TYPES" />

    <div class="flex flex-col gap-2">
      <PreferencesAppearanceColorPicker id="backgroundColor" v-model:value="localPrefs.backgroundColor" label="Background Color" :disabled="isBackgroundGradient" />
      <PreferencesAppearanceColorPicker id="backgroundGradientStart" v-model:value="localPrefs.backgroundGradientStart" label="Gradient Start Color" :disabled="isBackgroundFlat" />
      <PreferencesAppearanceColorPicker id="backgroundGradientEnd" v-model:value="localPrefs.backgroundGradientEnd" label="Gradient End Color" :disabled="isBackgroundFlat" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BACKGROUND_TYPES } from "#shared/lib/constants"

const props = defineProps<{
  preferences: UserPreferences
}>()

const emit = defineEmits<(e: "update:preferences", value: UserPreferences) => void>()

const localPrefs = reactive({ ...props.preferences })
const isBackgroundFlat = computed(() => localPrefs.backgroundType === "FLAT")
const isBackgroundGradient = computed(() => localPrefs.backgroundType === "GRADIENT")

watch(localPrefs, (newVal) => {
  emit("update:preferences", { ...newVal })
}, { deep: true })
</script>
