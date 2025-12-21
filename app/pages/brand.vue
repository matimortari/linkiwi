<template>
  <div class="container mx-auto max-w-7xl px-4 py-20">
    <h2 class="border-b p-4 text-center">
      Brand Assets
    </h2>

    <div class="grid grid-cols-1 gap-4 border-b py-4 md:grid-cols-3">
      <div v-for="logo in LOGOS" :key="logo.name" class="card flex flex-col items-center p-0!" :class="logo.bgClass">
        <div class="my-4 flex h-16 w-36 items-center justify-center">
          <img :src="logo.image" :alt="logo.name" class="size-full object-contain">
        </div>

        <div class="flex w-full flex-row items-center justify-between border-t bg-card px-2 py-1">
          <span class="text-sm font-medium">{{ logo.name }}</span>
          <button :title="`Download ${logo.name}`" class="transition-transform hover:scale-110" @click="handleDownloadImage(logo)">
            <icon name="mdi:download" size="30" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-col items-center gap-4 p-8">
      <div class="flex w-full flex-col items-center gap-2 text-center">
        <h3>
          Colors
        </h3>
        <p class="text-caption">
          Tip: Switch between light and dark themes to explore the full palette.
        </p>
      </div>

      <div class="m-4 grid w-full grid-cols-2 gap-4 md:grid-cols-6">
        <div v-for="color in BASE_COLORS" :key="color.name" class="flex flex-col items-center">
          <button class="group card relative h-24 w-full" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var)">
            <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <span class="text-sm font-semibold text-surface-foreground">{{ copiedColor === color.var ? "Copied!" : "Copy color" }}</span>
            </div>
          </button>

          <p class="flex w-full flex-row items-start justify-between p-1 text-start">
            <span class="text-sm font-medium">{{ color.name }}</span>
            <span class="text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
          </p>
        </div>
      </div>

      <div class="m-4 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        <div v-for="color in BRAND_COLORS" :key="color.name" class="flex flex-col items-center">
          <button class="group card relative h-24 w-full" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var)">
            <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <span class="text-sm font-semibold text-surface-foreground">{{ copiedColor === color.var ? "Copied!" : "Copy color" }}</span>
            </div>
          </button>

          <p class="flex w-full flex-row items-start justify-between p-1 text-start">
            <span class="text-sm font-medium">{{ color.name }}</span>
            <span class="text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Symbol from "~/assets/symbol.png"
import WordmarkDark from "~/assets/wordmark-dark.png"
import WordmarkLight from "~/assets/wordmark-light.png"

const { colorMode } = useTheme()
const colorValues = ref<Record<string, string>>({})
const copiedColor = ref<string | null>(null)

const LOGOS = [
  { name: "Logo", image: Symbol, bgClass: "bg-background!" },
  { name: "Wordmark (dark)", image: WordmarkDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Wordmark (light)", image: WordmarkLight, bgClass: "bg-[#030712]!" },
]

const BASE_COLORS = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Overlay", var: "--overlay" },
  { name: "Muted", var: "--muted" },
  { name: "Muted Foreground", var: "--muted-foreground" },
]

const BRAND_COLORS = [
  { name: "Primary", var: "--primary" },
  { name: "Secondary", var: "--secondary" },
  { name: "Danger", var: "--danger" },
  { name: "Success", var: "--success" },
]

function handleDownloadImage(logo: { name: string, image: string }) {
  const link = document.createElement("a")
  link.href = logo.image
  link.download = logo.name.replace(/\s+/g, "-").toLowerCase()
  link.click()
}

async function handleCopyColor(colorVar: string) {
  const value = colorValues.value[colorVar]
  if (!value || value === "—") {
    return
  }

  await navigator.clipboard.writeText(value)
  copiedColor.value = colorVar
  setTimeout(() => copiedColor.value = null, 1000)
}

function updateColors() {
  const styles = getComputedStyle(document.documentElement)
  for (const color of [...BASE_COLORS, ...BRAND_COLORS]) {
    const value = styles.getPropertyValue(color.var).trim()
    colorValues.value[color.var] = value || "—"
  }
}

onMounted(() => updateColors())

watch(colorMode, () => {
  updateColors()
}, { flush: "post" })

useHead({
  title: "Brand",
  link: [{ rel: "canonical", href: "https://linkstashr.vercel.app/brand" }],
  meta: [{ name: "description", content: "Linkstashr Brand Assets." }],
})
</script>
