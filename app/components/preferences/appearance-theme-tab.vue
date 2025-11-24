<template>
  <div class="scroll-area grid h-64 grid-cols-1 gap-2 overflow-auto py-2 md:grid-cols-2 2xl:grid-cols-4">
    <div v-for="theme in THEMES" :key="theme.title" class="flex flex-col items-center gap-2">
      <button
        :title="theme.title" aria-label="Select Theme"
        tabindex="0" class="flex size-full flex-col items-center justify-center gap-4 rounded-lg border p-8 hover:border-dashed hover:opacity-80"
        :class="{ 'opacity-60': selectedTheme !== theme.title }" :style="getThemeBackgroundStyle(theme.preferences)"
        @click="handleThemeSelection(theme.title)"
      >
        <p v-for="i in 3" :key="i" class="line-clamp-1 min-h-8 w-full truncate p-2 text-center text-sm select-none" :style="getThemeLinkStyle(theme.preferences)">
          {{ '' }}
        </p>
      </button>
      <span class="text-caption">{{ theme.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useUserStore())
const preferences = ref(user.value?.preferences ?? null)
const selectedTheme = ref("")

function handleApplyTheme(newPreferences: UserPreferences) {
  preferences.value = newPreferences
}

function handleThemeSelection(title: string) {
  const themeExists = THEMES.some(theme => theme.title === title)
  if (!themeExists)
    return

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

function getThemeLinkStyle(preferences: any) {
  const { linkStyle } = useDynamicStyles(ref(preferences))
  return linkStyle(false)
}
</script>
