<template>
  <div class="mx-auto flex w-full max-w-7xl gap-8 px-4 py-20">
    <aside class="sticky top-24 hidden h-fit min-w-48 space-y-2 md:block">
      <nuxt-link
        v-for="section in SECTIONS" :key="section.id"
        :to="`#${section.id}`" class="btn-ghost justify-start!"
        :class="activeSection === section.id ? 'text-caption bg-muted' : ''" @click.prevent="scrollToSection(section.id)"
      >
        {{ section.label }}
      </nuxt-link>
    </aside>

    <div class="mx-auto w-full max-w-4xl flex-1 space-y-8">
      <h1>
        Brand Resources
      </h1>

      <section v-for="category in ASSET_CATEGORIES" :id="category.id" :key="category.id" class="space-y-2">
        <h2>
          {{ category.name }}
        </h2>

        <div class="grid w-full grid-cols-1 gap-2" :class="category.gridClass">
          <div v-for="(asset, index) in category.assets" :key="asset.name" class="flex flex-col items-center">
            <div class="flex w-full items-center justify-center" :class="[category.containerClass, asset.bgClass]">
              <img :src="asset.image" :alt="asset.name" :class="category.imageClass">
            </div>

            <div class="flex w-full items-center justify-between p-2">
              <span class="text-sm font-medium">{{ asset.name }}</span>
              <button :title="`Download ${asset.name}`" class="transition-transform hover:scale-110" @click="handleDownloadImage(asset, index, category.actions)">
                <icon :name="category.actions[index]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-for="category in COLOR_CATEGORIES" :id="category.id" :key="category.name" class="space-y-2">
        <h3>
          {{ category.name }}
        </h3>

        <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
          <div v-for="(color, index) in category.colors" :key="color.name" class="flex flex-col items-center">
            <div class="h-24 w-full cursor-pointer" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var, index, category.actions)" />

            <div class="flex w-full flex-col p-2">
              <div class="flex w-full items-center justify-between">
                <span class="text-sm font-medium">{{ color.name }}</span>
                <button :title="`Copy ${color.name}`" class="transition-transform hover:scale-110" @click="handleCopyColor(color.var, index, category.actions)">
                  <icon :name="category.actions[index]!.icon.value" size="20" />
                </button>
              </div>

              <span class="text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
            </div>
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

const { public: { baseURL } } = useRuntimeConfig()
const { createActionHandler } = useActionIcon()
const { colorMode } = useTheme()
const colorValues = ref<Record<string, string>>({})
const activeSection = ref("symbols")

const SECTIONS = [
  { id: "symbols", label: "Symbols" },
  { id: "wordmarks", label: "Wordmarks" },
  { id: "colors", label: "Colors" },
]

const SYMBOLS = [
  { name: "Symbol", image: Symbol, bgClass: "bg-background!" },
  { name: "Symbol Mono (dark)", image: SymbolMonoDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Symbol Mono (light)", image: SymbolMonoLight, bgClass: "bg-[#030712]!" },
]

const WORDMARKS = [
  { name: "Wordmark (dark)", image: WordmarkDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Wordmark (light)", image: WordmarkLight, bgClass: "bg-[#030712]!" },
]

const BRAND_COLORS = [
  { name: "Primary", var: "--primary" },
  { name: "Secondary", var: "--secondary" },
]

const BASE_COLORS = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Input", var: "--input" },
  { name: "Muted", var: "--muted" },
  { name: "Muted Foreground", var: "--muted-foreground" },
]

const ACCENT_COLORS = [
  { name: "Danger", var: "--danger" },
  { name: "Success", var: "--success" },
]

const ASSET_CATEGORIES = [
  {
    id: "symbols",
    name: "Symbols",
    assets: SYMBOLS,
    actions: SYMBOLS.map(() => createActionHandler("mdi:download")),
    gridClass: "md:grid-cols-3",
    containerClass: "size-32",
    imageClass: "size-20 object-contain",
  },
  {
    id: "wordmarks",
    name: "Wordmarks",
    assets: WORDMARKS,
    actions: WORDMARKS.map(() => createActionHandler("mdi:download")),
    gridClass: "md:grid-cols-2",
    containerClass: "h-32",
    imageClass: "h-20 w-36 object-contain",
  },
]

const COLOR_CATEGORIES = [
  {
    id: "brand",
    name: "Brand Colors",
    colors: BRAND_COLORS,
    actions: BRAND_COLORS.map(() => createActionHandler("mdi:content-copy")),
  },
  {
    id: "base",
    name: "Base Colors",
    colors: BASE_COLORS,
    actions: BASE_COLORS.map(() => createActionHandler("mdi:content-copy")),
  },
  {
    id: "accent",
    name: "Accent Colors",
    colors: ACCENT_COLORS,
    actions: ACCENT_COLORS.map(() => createActionHandler("mdi:content-copy")),
  },
]

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

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

function updateColors() {
  for (const color of COLOR_CATEGORIES.flatMap(category => category.colors)) {
    colorValues.value[color.var] = getComputedStyle(document.documentElement).getPropertyValue(color.var).trim() || "—"
  }
}

function observeSections() {
  const observer = new IntersectionObserver((entries) => {
    const intersecting = entries.filter(entry => entry.isIntersecting)
    if (intersecting.length > 0) {
      const mostVisible = intersecting.reduce((prev, current) => {
        return current.intersectionRatio > prev.intersectionRatio ? current : prev
      })
      activeSection.value = mostVisible.target.id
    }
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], rootMargin: "-100px 0px -60% 0px" })

  SECTIONS.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })
}

onMounted(() => {
  updateColors()
  observeSections()
})

watch(colorMode, () => updateColors(), { flush: "post" })

useHead({
  title: "Brand Resources",
  link: [{ rel: "canonical", href: `${baseURL}/brand` }],
  meta: [{ name: "description", content: "LinKiosk Brand Resources." }],
})
</script>
