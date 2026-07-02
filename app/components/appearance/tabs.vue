<template>
  <div v-if="props.activeTab === 'background'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <RadioOptions v-model:value="localPrefs.backgroundType" name="backgroundType" label="Background Type" :options="BACKGROUND_TYPES" />
    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Colors
      </h6>
      <ColorPicker id="backgroundColor" v-model:value="localPrefs.backgroundColor" label="Background Color" :disabled="isBackgroundGradient" />
      <ColorPicker id="backgroundGradientStart" v-model:value="localPrefs.backgroundGradientStart" label="Gradient Start Color" :disabled="isBackgroundFlat" />
      <ColorPicker id="backgroundGradientEnd" v-model:value="localPrefs.backgroundGradientEnd" label="Gradient End Color" :disabled="isBackgroundFlat" />
    </div>
  </div>

  <div v-if="props.activeTab === 'layout'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Header & Profile
      </h6>
      <Selector id="supportBanner" v-model:value="localPrefs.supportBanner" label="Support Banner" :options="BANNER_OPTIONS" />
      <Selector id="profilePictureRadius" v-model:value="localPrefs.profilePictureRadius" label="Profile Picture Radius" :options="RADIUS_SIZES" />
      <ColorPicker id="profilePictureBorderColor" v-model:value="localPrefs.profilePictureBorderColor" label="Profile Picture Border Color" />
      <Selector id="profilePictureBorderWidth" v-model:value="localPrefs.profilePictureBorderWidth" label="Profile Picture Border Width" :options="BORDER_WIDTHS" />

      <h6 class="py-2">
        Dividers
      </h6>
      <ColorPicker id="dividerColor" v-model:value="localPrefs.dividerColor" label="Divider Color" />
      <Selector id="dividerThickness" v-model:value="localPrefs.dividerThickness" label="Thickness" :options="BORDER_WIDTHS" />
      <Selector id="dividerStyle" v-model:value="localPrefs.dividerStyle" label="Style" :options="DIVIDER_STYLES" />
    </div>

    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Username
      </h6>
      <Selector id="slugFontFamily" v-model:value="localPrefs.slugFontFamily" label="Font Family" :options="FONT_FAMILIES" />
      <Selector id="slugTextSize" v-model:value="localPrefs.slugTextSize" label="Font Size" :options="FONT_SIZES" />
      <Selector id="slugTextWeight" v-model:value="localPrefs.slugTextWeight" label="Font Weight" :options="FONT_WEIGHTS" />
      <ColorPicker id="slugTextColor" v-model:value="localPrefs.slugTextColor" label="Font Color" />
    </div>
  </div>

  <div v-if="props.activeTab === 'links'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Base Styles
      </h6>
      <ColorPicker id="linkBackgroundColor" v-model:value="localPrefs.linkBackgroundColor" label="Background Color" />
      <ColorPicker id="linkTextColor" v-model:value="localPrefs.linkTextColor" label="Font Color" />
      <Selector id="linkFontFamily" v-model:value="localPrefs.linkFontFamily" label="Font Family" :options="FONT_FAMILIES" />
      <Selector id="linkTextSize" v-model:value="localPrefs.linkTextSize" label="Font Size" :options="LINK_FONT_SIZES" />
      <Selector id="linkTextWeight" v-model:value="localPrefs.linkTextWeight" label="Font Weight" :options="FONT_WEIGHTS" />
      <Selector id="linkBorderRadius" v-model:value="localPrefs.linkBorderRadius" label="Radius" :options="RADIUS_SIZES" />
      <Selector id="linkPadding" v-model:value="localPrefs.linkPadding" label="Padding" :options="LINK_PADDING_SIZES" />
      <Checkbox id="showLinkCopyButton" v-model:value="localPrefs.showLinkCopyButton" label="Show 'Copy Link' Button" />
    </div>

    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Shadows
      </h6>
      <ColorPicker id="linkHoverBackgroundColor" v-model:value="localPrefs.linkHoverBackgroundColor" label="Hover Background Color" />
      <Checkbox id="isLinkShadow" v-model:value="localPrefs.isLinkShadow" label="Enable Shadow" />
      <ColorPicker id="linkShadowColor" v-model:value="localPrefs.linkShadowColor" label="Shadow Color" :disabled="isLinkShadowDisabled" />
      <Selector
        id="linkShadowWeight" v-model:value="localPrefs.linkShadowWeight"
        label="Shadow Weight" :options="SHADOW_WEIGHTS"
        :disabled="isLinkShadowDisabled"
      />
    </div>
  </div>

  <div v-if="props.activeTab === 'icons'" class="card grid grid-cols-1 gap-2 md:grid-cols-2">
    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Base Styles
      </h6>
      <ColorPicker id="iconBackgroundColor" v-model:value="localPrefs.iconBackgroundColor" label="Background Color" />
      <ColorPicker id="iconLogoColor" v-model:value="localPrefs.iconLogoColor" label="Icon Color" />
      <ColorPicker id="iconHoverBackgroundColor" v-model:value="localPrefs.iconHoverBackgroundColor" label="Hover Background Color" />
    </div>

    <div class="flex flex-col gap-2 p-2">
      <h6 class="py-2">
        Shadows
      </h6>
      <Checkbox id="isIconShadow" v-model:value="localPrefs.isIconShadow" label="Enable Shadow" />
      <ColorPicker id="iconShadowColor" v-model:value="localPrefs.iconShadowColor" label="Shadow Color" :disabled="isIconShadowDisabled" />
      <Selector
        id="iconShadowWeight" v-model:value="localPrefs.iconShadowWeight"
        label="Shadow Weight" :options="SHADOW_WEIGHTS"
        :disabled="isIconShadowDisabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  preferences: UserPreferences
  activeTab: string
}>()

const emit = defineEmits<{ "update:preferences": [value: UserPreferences], "update:activeTab": [value: string] }>()

const localPrefs = reactive({ ...props.preferences })
const isBackgroundFlat = computed(() => localPrefs.backgroundType === "FLAT")
const isBackgroundGradient = computed(() => localPrefs.backgroundType === "GRADIENT")
const isLinkShadowDisabled = computed(() => !localPrefs.isLinkShadow)
const isIconShadowDisabled = computed(() => !localPrefs.isIconShadow)

// Emit updated preferences whenever localPrefs changes
watch(localPrefs, v => emit("update:preferences", { ...v }), { deep: true })

// Update localPrefs if preferences prop changes
watch(() => props.preferences, newVal => Object.assign(localPrefs, newVal), { deep: true })
</script>
