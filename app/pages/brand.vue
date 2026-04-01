<template>
  <div class="mx-auto w-full max-w-4xl space-y-8 px-4 py-24">
    <header class="space-y-2 border-b pb-4 text-center md:text-start">
      <h1>
        Brand Resources
      </h1>
      <p class="max-w-xl font-medium text-muted-foreground">
        Official LinKiosk logos, symbols, and color palette.
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Symbols
        </h3>

        <article class="card space-y-2 p-2!">
          <div class="flex items-center justify-center rounded-lg border p-10" :class="selectedSymbol.bgClass">
            <img :src="selectedSymbol.image" :alt="selectedSymbol.name" class="h-16 w-auto object-contain">
          </div>

          <div class="flex items-center justify-between">
            <div class="navigation-group">
              <button
                v-for="(asset, index) in SYMBOLS" :key="asset.name"
                :aria-label="`Show ${asset.name}`" class="size-2.5 rounded-full transition-all hover:ring-2 hover:ring-primary/50"
                :class="index === selectedSymbolIndex ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/30 ring-1 ring-muted'" @click="selectedSymbolIndex = index"
              />
            </div>

            <div class="navigation-group">
              <span class="text-caption">{{ selectedSymbol.name }}</span>
              <button :aria-label="`Download ${selectedSymbol.name}`" class="text-muted-foreground transition-colors hover:text-foreground" @click="handleDownloadImage(selectedSymbol, selectedSymbolIndex, symbolActions)">
                <icon :name="symbolActions[selectedSymbolIndex]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Wordmarks
        </h3>

        <article class="card space-y-2 p-2!">
          <div class="flex items-center justify-center rounded-lg border p-10" :class="selectedWordmark.bgClass">
            <img :src="selectedWordmark.image" :alt="selectedWordmark.name" class="h-16 w-auto object-contain">
          </div>

          <div class="flex items-center justify-between">
            <div class="navigation-group">
              <button
                v-for="(asset, index) in WORDMARKS" :key="asset.name"
                :aria-label="`Show ${asset.name}`" class="size-2.5 rounded-full transition-all hover:ring-2 hover:ring-primary/50"
                :class="index === selectedWordmarkIndex ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/30 ring-1 ring-muted'" @click="selectedWordmarkIndex = index"
              />
            </div>

            <div class="navigation-group">
              <span class="text-caption">{{ selectedWordmark.name }}</span>
              <button :aria-label="`Download ${selectedWordmark.name}`" class="text-muted-foreground transition-colors hover:text-foreground" @click="handleDownloadImage(selectedWordmark, selectedWordmarkIndex, wordmarkActions)">
                <icon :name="wordmarkActions[selectedWordmarkIndex]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="space-y-8">
      <div v-for="category in COLOR_CATEGORIES" :key="category.name" class="space-y-4">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          {{ category.name }}
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(color, index) in category.colors" :key="color.name" class="card group flex w-full flex-col items-start gap-2 p-2! md:flex-row md:items-center">
            <button
              class="size-24 shrink-0 rounded-lg border" :style="{ backgroundColor: `var(${color.var})` }"
              :aria-label="`Copy ${color.name}`" @click="handleCopyColor(color.var, index, category.actions)"
            />
            <div class="flex w-full flex-col items-start gap-1.5 px-0.5 md:min-w-0">
              <span class="w-full truncate text-sm font-semibold">{{ color.name }}</span>
              <span class="block font-mono text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
              <button :aria-label="`Copy ${color.name}`" class="text-muted-foreground transition-colors hover:text-foreground" @click="handleCopyColor(color.var, index, category.actions)">
                <icon :name="category.actions[index]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const { createActionHandler } = useActionIcon()
const { colorMode } = useTheme()
const colorValues = ref<Record<string, string>>({})
const selectedWordmarkIndex = ref(0)
const selectedSymbolIndex = ref(0)
const symbolActions = SYMBOLS.map(() => createActionHandler("mdi:download"))
const wordmarkActions = WORDMARKS.map(() => createActionHandler("mdi:download"))
const selectedWordmark = computed(() => WORDMARKS[selectedWordmarkIndex.value] ?? WORDMARKS[0]!)
const selectedSymbol = computed(() => SYMBOLS[selectedSymbolIndex.value] ?? SYMBOLS[0]!)

const COLOR_CATEGORIES = [
  { id: "brand", name: "Brand Colors", colors: BRAND_COLORS, actions: BRAND_COLORS.map(() => createActionHandler("mdi:content-copy")) },
  { id: "neutral", name: "Neutral Colors", colors: NEUTRAL_COLORS, actions: NEUTRAL_COLORS.map(() => createActionHandler("mdi:content-copy")) },
  { id: "status", name: "Status Colors", colors: STATUS_COLORS, actions: STATUS_COLORS.map(() => createActionHandler("mdi:content-copy")) },
]

function handleDownloadImage(logo: { name: string, image: string }, index: number, actions: ReturnType<typeof createActionHandler>[]) {
  if (!actions[index]) {
    return
  }

  const link = document.createElement("a")
  link.href = logo.image
  link.download = logo.name.replace(/\s+/g, "-").toLowerCase()
  link.click()
  actions[index].triggerSuccess()
}

async function handleCopyColor(colorVar: string, index: number, actions: ReturnType<typeof createActionHandler>[]) {
  if (!actions[index]) {
    return
  }

  const value = colorValues.value[colorVar]
  if (!value || value === "—") {
    return
  }

  await actions[index].triggerCopy(value)
}

function syncColorValues() {
  for (const color of COLOR_CATEGORIES.flatMap(c => c.colors)) {
    colorValues.value[color.var] = getComputedStyle(document.documentElement).getPropertyValue(color.var).trim() || "—"
  }
}

onMounted(syncColorValues)
watch(colorMode, syncColorValues, { flush: "post" })

useHead({
  title: "Brand Resources",
  link: [{ rel: "canonical", href: `${baseURL}/brand` }],
  meta: [{ name: "description", content: "LinKiosk brand resources and guidelines." }],
})
</script>
