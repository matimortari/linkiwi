<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h4>
        Themes
      </h4>

      <button type="button" class="btn-primary self-end" :disabled="!hasPendingChanges" @click="handleSaveTheme">
        <icon :name="saveAction.icon.value" size="20" />
        <span>Apply</span>
      </button>
    </div>

    <div class="scroll-area grid max-h-128 grid-cols-2 gap-4 overflow-auto pr-1 sm:grid-cols-3 md:mx-4 md:grid-cols-4">
      <div v-for="(theme, index) in THEMES" :key="theme.title" class="flex flex-col items-center gap-2">
        <button
          type="button" tabindex="0"
          :aria-label="`Select ${theme.title} theme`" :aria-pressed="selectedTheme === theme.title"
          class="relative flex aspect-3/4 w-full flex-col items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all"
          :class="selectedTheme === theme.title ? 'border-secondary ring-2 ring-secondary/50' : 'opacity-80 hover:border-secondary/50 hover:opacity-100'"
          :style="themeStyles[index]?.backgroundStyle.value ?? {}"
          @click="selectedTheme = theme.title"
        >
          <span
            class="mt-1 size-10 shrink-0 border-2"
            :style="{ backgroundColor: theme.preferences.iconBackgroundColor, borderColor: theme.preferences.profilePictureBorderColor, borderRadius: theme.preferences.profilePictureRadius }"
          />

          <span class="h-1.5 w-14 shrink-0 rounded-full" :style="{ backgroundColor: theme.preferences.slugTextColor }" />

          <div class="navigation-group">
            <span v-for="i in 3" :key="i" class="size-8 rounded-full" :style="themeStyles[index]?.iconStyle(false) ?? {}" />
          </div>

          <div class="flex w-full flex-col gap-2">
            <span v-for="i in 4" :key="i" class="h-7 w-full" :style="themeStyles[index]?.linkStyle(false) ?? {}" />
          </div>

          <span v-if="selectedTheme === theme.title" class="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-success shadow-lg">
            <icon name="mdi:check-bold" size="15" />
          </span>
        </button>

        <span class="w-full truncate text-center text-xs font-medium" :class="selectedTheme === theme.title ? 'text-foreground' : 'text-muted-foreground'">{{ theme.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const preferences = computed(() => user.value?.preferences ?? DEFAULT_PREFERENCES)
const saveAction = useActionIcon("mdi:content-save-check")
const pendingThemeTitle = useState<string | null>("pendingThemeTitle", () => null)
const savedThemeTitle = computed(() => THEMES.find(theme => Object.entries(theme.preferences).every(([key, value]) => preferences.value[key as keyof UserPreferences] === value))?.title ?? "")
const selectedTheme = ref(savedThemeTitle.value)
const hasPendingChanges = computed(() => selectedTheme.value !== savedThemeTitle.value)
const themeStyles = THEMES.map(theme => useDynamicStyles(ref(theme.preferences)))

async function handleSaveTheme() {
  const theme = THEMES.find(t => t.title === selectedTheme.value)
  if (!theme) {
    return
  }

  await userStore.updatePreferences({ ...preferences.value, ...theme.preferences })
  saveAction.triggerSuccess()
}

// Select the theme that matches current preferences
watch(savedThemeTitle, title => selectedTheme.value = title)

// Track an unsaved theme selection as pending
watch([selectedTheme, savedThemeTitle], ([selected, saved]) => pendingThemeTitle.value = selected !== saved ? selected : null, { immediate: true })

onBeforeUnmount(() => pendingThemeTitle.value = null)
</script>
