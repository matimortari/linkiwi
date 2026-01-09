<template>
  <div class="mx-auto w-full max-w-5xl space-y-8 px-4 py-32">
    <header class="flex flex-col items-center gap-2 text-center">
      <h2>
        Brand Assets
      </h2>
      <p class="text-caption">
        Visual language and assets for Linkstashr, including logos and color palette.
      </p>
    </header>

    <div class="flex flex-col items-center gap-4">
      <section class="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
        <div v-for="(symbol, index) in SYMBOLS" :key="symbol.name" class="card flex flex-col items-center overflow-hidden p-0!" :class="symbol.bgClass">
          <div class="m-4 flex size-20 items-center justify-center rounded-t-2xl">
            <img :src="symbol.image" :alt="symbol.name" class="size-full object-contain">
          </div>

          <div class="flex w-full flex-row items-center justify-between border-t bg-card p-2">
            <span class="text-sm font-medium">{{ symbol.name }}</span>
            <button :title="`Download ${symbol.name}`" class="transition-transform hover:scale-110" @click="handleDownloadImage(symbol, index, symbolActions)">
              <icon :name="symbolActions[index]!.icon.value" size="25" />
            </button>
          </div>
        </div>
      </section>

      <section class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <div v-for="(wordmark, index) in WORDMARKS" :key="wordmark.name" class="card flex flex-col items-center overflow-hidden p-0!" :class="wordmark.bgClass">
          <div class="m-4 flex h-20 w-36 items-center justify-center rounded-t-2xl">
            <img :src="wordmark.image" :alt="wordmark.name" class="size-full object-contain">
          </div>

          <div class="flex w-full flex-row items-center justify-between border-t bg-card p-2">
            <span class="text-sm font-medium">{{ wordmark.name }}</span>
            <button :title="`Download ${wordmark.name}`" class="transition-transform hover:scale-110" @click="handleDownloadImage(wordmark, index, wordmarkActions)">
              <icon :name="wordmarkActions[index]!.icon.value" size="25" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <div class="flex flex-col items-center gap-4">
      <div class="flex flex-col items-center gap-2 text-center">
        <h3>
          Colors
        </h3>
        <p class="text-caption">
          Tip: Switch between light and dark themes to explore the full palette.
        </p>
      </div>

      <section class="grid w-full grid-cols-2 gap-2 md:grid-cols-5">
        <div v-for="(color, index) in COLORS" :key="color.name" class="card flex flex-col items-center p-0!">
          <div class="h-24 w-full rounded-t-2xl border-b" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var, index)" />

          <div class="flex w-full flex-col p-2">
            <div class="flex w-full items-center justify-between">
              <span class="text-sm font-medium">{{ color.name }}</span>
              <button :title="`Copy ${color.name}`" class="transition-transform hover:scale-110" @click="handleCopyColor(color.var, index)">
                <icon :name="colorActions[index]!.icon.value" size="20" />
              </button>
            </div>

            <span class="text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import SymbolMonoDark from "~/assets/symbol-mono-dark.png"
import SymbolMonoLight from "~/assets/symbol-mono-light.png"
import Symbol from "~/assets/symbol.png"
import WordmarkDark from "~/assets/wordmark-dark.png"
import WordmarkLight from "~/assets/wordmark-light.png"

const { createActionHandler } = useActionIcon()
const { colorMode } = useTheme()
const colorValues = ref<Record<string, string>>({})

const SYMBOLS = [
  { name: "Symbol", image: Symbol, bgClass: "bg-background!" },
  { name: "Symbol Mono (dark)", image: SymbolMonoDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Symbol Mono (light)", image: SymbolMonoLight, bgClass: "bg-[#030712]!" },
]

const WORDMARKS = [
  { name: "Wordmark (dark)", image: WordmarkDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Wordmark (light)", image: WordmarkLight, bgClass: "bg-[#030712]!" },
]

const COLORS = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Input", var: "--input" },
  { name: "Muted", var: "--muted" },
  { name: "Muted Foreground", var: "--muted-foreground" },
  { name: "Danger", var: "--danger" },
  { name: "Success", var: "--success" },
  { name: "Primary", var: "--primary" },
  { name: "Secondary", var: "--secondary" },
]

const symbolActions = SYMBOLS.map(() => createActionHandler("mdi:download"))
const wordmarkActions = WORDMARKS.map(() => createActionHandler("mdi:download"))
const colorActions = COLORS.map(() => createActionHandler("mdi:content-copy"))

function handleDownloadImage(logo: { name: string, image: string }, index: number, actions: ReturnType<typeof createActionHandler>[]) {
  const action = actions[index]
  if (!action) {
    return
  }

  const link = document.createElement("a")
  link.href = logo.image
  link.download = logo.name.replace(/\s+/g, "-").toLowerCase()
  link.click()
  action.triggerSuccess()
}

async function handleCopyColor(colorVar: string, index: number) {
  const action = colorActions[index]
  if (!action) {
    return
  }

  const value = colorValues.value[colorVar]
  if (!value || value === "—") {
    return
  }

  await action.triggerCopy(value)
}

function updateColors() {
  const styles = getComputedStyle(document.documentElement)
  for (const color of [...COLORS]) {
    const value = styles.getPropertyValue(color.var).trim()
    colorValues.value[color.var] = value || "—"
  }
}

onMounted(() => updateColors())

watch(colorMode, () => updateColors(), { flush: "post" })

useHead({
  title: "Brand",
  link: [{ rel: "canonical", href: "https://linkstashr.vercel.app/brand" }],
  meta: [{ name: "description", content: "Linkstashr Brand Assets." }],
})
</script>
