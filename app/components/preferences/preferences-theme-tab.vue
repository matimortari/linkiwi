<template>
  <div class="scroll-area grid h-72 grid-cols-1 gap-2 overflow-auto pr-1 md:grid-cols-2 2xl:grid-cols-3">
    <div v-for="theme in THEMES" :key="theme.title" class="flex flex-col items-center gap-2">
      <button
        :title="theme.title" aria-label="Select Theme"
        tabindex="0" class="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border p-8 hover:border-dashed hover:opacity-80"
        :class="{ 'opacity-80': selectedTheme !== theme.title }" :style="getThemeBackgroundStyle(theme.preferences)"
        @click="handleThemeSelection(theme.title)"
      >
        <div class="flex flex-row items-center gap-2">
          <span v-for="i in 3" :key="i" class="size-8 rounded-full" :style="getThemeIconStyle(theme.preferences)">{{ '' }}</span>
        </div>

        <div class="flex w-full flex-col items-center gap-4">
          <span v-for="i in 2" :key="i" class="min-h-8 w-full truncate p-2 text-center text-sm select-none" :style="getThemeLinkStyle(theme.preferences)">{{ '' }}</span>
        </div>
      </button>

      <p class="text-caption">
        {{ theme.title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useUserStore())
const selectedTheme = ref("")

function handleApplyTheme(newPreferences: UserPreferences) {
  if (!user.value) {
    return
  }

  user.value.preferences = newPreferences
}

function handleThemeSelection(title: string) {
  const themeExists = THEMES.some(theme => theme.title === title)
  if (!themeExists) {
    return
  }

  selectedTheme.value = title
  const theme = THEMES.find(theme => theme.title === title)
  if (theme?.preferences) {
    handleApplyTheme(theme.preferences)
  }
}

function getThemeBackgroundStyle(preferences: any) {
  const { backgroundStyle } = useDynamicStyles(ref(preferences))
  return backgroundStyle.value
}

function getThemeIconStyle(preferences: any) {
  const { iconStyle } = useDynamicStyles(ref(preferences))
  return iconStyle(false)
}

function getThemeLinkStyle(preferences: any) {
  const { linkStyle } = useDynamicStyles(ref(preferences))
  return linkStyle(false)
}
</script>
