<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4">
    <h4>
      Themes
    </h4>

    <div class="scroll-area grid h-72 grid-cols-2 gap-2 overflow-auto pr-1 md:grid-cols-3 2xl:grid-cols-4 2xl:gap-4">
      <div v-for="(theme, index) in THEMES" :key="theme.title" class="flex flex-col items-center gap-2">
        <button
          :aria-label="`Select ${theme.title} theme`" :aria-pressed="selectedTheme === theme.title"
          tabindex="0" class="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 p-8 transition-all hover:border-dashed"
          :class="selectedTheme !== theme.title && 'opacity-80 hover:opacity-100'" :style="themeStyles[index]?.backgroundStyle.value ?? {}"
          @click="selectedTheme = theme.title"
        >
          <div class="navigation-group">
            <span v-for="i in 3" :key="i" class="size-8 rounded-full" :style="themeStyles[index]?.iconStyle(false) ?? {}">{{ '' }}</span>
          </div>

          <div class="flex w-full flex-col items-center gap-4">
            <span v-for="i in 2" :key="i" class="min-h-8 w-full truncate p-2 text-center text-sm select-none" :style="themeStyles[index]?.linkStyle(false) ?? {}"> {{ '' }}</span>
          </div>

          <div v-if="selectedTheme === theme.title" class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border-secondary! bg-muted/30 ring-2 ring-secondary backdrop-blur-xs">
            <span class="flex size-8 items-center justify-center rounded-full bg-success shadow-lg">
              <icon name="mdi:check-bold" size="20" />
            </span>
          </div>
        </button>

        <span class="text-caption text-sm">{{ theme.title }}</span>
      </div>
    </div>

    <button class="btn-primary self-end" :disabled="!hasPendingChanges" @click="handleSaveTheme">
      <icon :name="saveAction.icon.value" size="20" />
      <span>Apply</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  preferences: UserPreferences
}>()
const emit = defineEmits<{ save: [value: UserPreferences] }>()
const { createActionHandler } = useActionIcon()
const saveAction = createActionHandler("mdi:content-save-check")

function findActiveThemeTitle(prefs: UserPreferences): string {
  return THEMES.find(theme => Object.entries(theme.preferences).every(([key, value]) => prefs[key as keyof UserPreferences] === value))?.title ?? ""
}

const pendingThemeTitle = useState<string | null>("pendingThemeTitle", () => null)
const selectedTheme = ref(findActiveThemeTitle(props.preferences))
const savedThemeTitle = computed(() => findActiveThemeTitle(props.preferences))
const hasPendingChanges = computed(() => selectedTheme.value !== savedThemeTitle.value)

const themeStyles = THEMES.map((theme) => {
  const { backgroundStyle, iconStyle, linkStyle } = useDynamicStyles(ref(theme.preferences))
  return { backgroundStyle, iconStyle, linkStyle }
})

function handleSaveTheme() {
  const theme = THEMES.find(t => t.title === selectedTheme.value)
  if (!theme) {
    return
  }

  emit("save", { ...props.preferences, ...theme.preferences })
  saveAction.triggerSuccess()
}

watch(() => props.preferences, prefs => selectedTheme.value = findActiveThemeTitle(prefs), { deep: true })
watch([selectedTheme, savedThemeTitle], ([selected, saved]) => pendingThemeTitle.value = selected !== saved ? selected : null, { immediate: true })

onBeforeUnmount(() => pendingThemeTitle.value = null)
</script>
