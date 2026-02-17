<template>
  <div class="scroll-area grid h-72 grid-cols-2 gap-2 overflow-auto pr-1 md:grid-cols-3">
    <div v-for="(theme, index) in THEMES" :key="theme.title" class="flex flex-col items-center gap-2">
      <button
        :title="theme.title" aria-label="Select Theme"
        tabindex="0" class="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border p-8 hover:border-dashed hover:opacity-80"
        :class="{ 'opacity-80': selectedTheme !== theme.title }" :style="themeStyles[index]?.backgroundStyle.value ?? {}"
        @click="handleThemeSelection(theme.title)"
      >
        <div class="flex flex-row items-center gap-2">
          <span v-for="i in 3" :key="i" class="size-8 rounded-full" :style="themeStyles[index]?.iconStyle(false) ?? {}">{{ '' }}</span>
        </div>

        <div class="flex w-full flex-col items-center gap-4">
          <span v-for="i in 2" :key="i" class="min-h-8 w-full truncate p-2 text-center text-sm select-none" :style="themeStyles[index]?.linkStyle(false) ?? {}"> {{ '' }}</span>
        </div>
      </button>

      <p class="text-caption">
        {{ theme.title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  preferences: UserPreferences
}>()

const { user } = storeToRefs(useUserStore())
const selectedTheme = ref("")

const themeStyles = THEMES.map((theme) => {
  const { backgroundStyle, iconStyle, linkStyle } = useDynamicStyles(ref(theme.preferences))
  return { backgroundStyle, iconStyle, linkStyle }
})

function handleApplyTheme(newPreferences: UserPreferences) {
  if (!user.value) {
    return
  }

  user.value.preferences = newPreferences
}

function handleThemeSelection(title: string) {
  const theme = THEMES.find(t => t.title === title)
  if (!theme) {
    return
  }

  selectedTheme.value = title
  if (theme.preferences) {
    handleApplyTheme(theme.preferences)
  }
}
</script>
