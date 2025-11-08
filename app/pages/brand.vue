<template>
  <div class="container mx-auto max-w-7xl px-4 py-16">
    <header class="flex flex-col items-center gap-2 border-b p-4 text-center md:items-start md:text-start">
      <h2>
        Brand & Assets
      </h2>
      <p class="text-caption">
        Download LinkNest logos and explore our design colors.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 border-b py-4 md:grid-cols-3">
      <div v-for="logo in logos" :key="logo.name" class="flex flex-col items-center rounded-xl border-2" :class="logo.bgClass">
        <div class="my-4 flex h-16 w-36 items-center justify-center">
          <img :src="logo.image" :alt="logo.name" class="size-full object-contain">
        </div>

        <div class="bg-card flex w-full flex-row items-center justify-between rounded-b-lg px-2 py-1">
          <span class="text-sm font-semibold">{{ logo.name }}</span>
          <nuxt-link :href="logo.image" download :title="`Download ${logo.name}`">
            <icon name="mdi:download" size="35" class="rounded-full p-1" />
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-col items-center gap-4 p-8">
      <div class="flex w-full flex-col items-center gap-1 text-center">
        <h3>
          Brand Colors
        </h3>
        <p class="text-caption">
          Tip: Switch between light and dark themes to explore the full palette.
        </p>
      </div>

      <div class="my-4 grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <div v-for="color in brandColors" :key="color.name" class="flex flex-col items-center">
          <div class="relative h-20 w-full cursor-pointer rounded-lg border-2 transition" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var)">
            <div class="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 opacity-0 transition-opacity">
              <span class="text-sm font-semibold"> {{ copiedColor === color.var ? 'Copied!' : 'Copy color' }} </span>
            </div>
          </div>

          <p class="flex w-full flex-col items-start p-1 text-start">
            <span class="text-sm font-semibold">{{ color.name }}</span>
            <span class="text-xs">{{ colorValues[color.var] }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImage from "~/assets/logo.png"
import logoDark from "~/assets/wordmark-dark.png"
import logoLight from "~/assets/wordmark-light.png"

const { themeIcon } = useTheme()

const logos = [
  { name: "Logo", image: logoImage, bgClass: "bg-background" },
  { name: "Wordmark (light)", image: logoLight, bgClass: "bg-[#040308]" },
  { name: "Wordmark (dark)", image: logoDark, bgClass: "bg-[#e0dddd]" },
]

const brandColors = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Card Foreground", var: "--card-foreground" },
  { name: "Overlay", var: "--overlay" },
  { name: "Overlay Foreground", var: "--overlay-foreground" },
  { name: "Primary", var: "--primary" },
  { name: "Primary Foreground", var: "--primary-foreground" },
  { name: "Secondary", var: "--secondary" },
  { name: "Secondary Foreground", var: "--secondary-foreground" },
  { name: "Muted", var: "--muted" },
  { name: "Muted Foreground", var: "--muted-foreground" },
  { name: "Danger", var: "--danger" },
  { name: "Danger Foreground", var: "--danger-foreground" },
  { name: "Success", var: "--success" },
  { name: "Success Foreground", var: "--success-foreground" },
  { name: "Accent", var: "--accent" },
  { name: "Border", var: "--border" },
]

const colorValues = ref<Record<string, string>>({})
const copiedColor = ref<string | null>(null)

async function handleCopyColor(colorVar: string) {
  const value = colorValues.value[colorVar]
  if (!value || value === "—")
    return

  await navigator.clipboard.writeText(value)
  copiedColor.value = colorVar

  setTimeout(() => {
    copiedColor.value = null
  }, 1000)
}

function updateColors() {
  const styles = getComputedStyle(document.documentElement)
  for (const color of brandColors) {
    const value = styles.getPropertyValue(color.var).trim()
    colorValues.value[color.var] = value || "—"
  }
}

onMounted(() => {
  updateColors()
  watchEffect(() => {
    void themeIcon.value
    nextTick(() => updateColors())
  })
})

useHead({
  title: "Brand Assets",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/brand" }],
  meta: [{ name: "description", content: "LinkNest Brand Assets." }],
})
</script>
