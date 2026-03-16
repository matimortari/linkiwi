<template>
  <div class="mx-auto flex w-full max-w-7xl gap-8 px-4 py-32">
    <aside class="sticky top-24 hidden h-fit min-w-48 space-y-2 md:block">
      <h3>
        Brand Resources
      </h3>

      <nav class="flex flex-col space-y-1 py-4">
        <nuxt-link
          v-for="section in BRAND_SECTIONS" :key="section.id"
          :to="`#${section.id}`" class="btn-ghost justify-start!"
          :class="activeSection === section.id ? 'text-caption bg-muted' : ''" @click.prevent="scrollToSection(section.id)"
        >
          {{ section.label }}
        </nuxt-link>
      </nav>
    </aside>

    <div class="mx-auto w-full max-w-4xl flex-1 space-y-8">
      <section id="wordmarks" class="space-y-2">
        <h4>
          Wordmarks
        </h4>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div v-for="(asset, index) in WORDMARKS" :key="asset.name" class="flex flex-col items-center">
            <div class="flex h-32 w-full items-center justify-center border" :class="asset.bgClass">
              <img :src="asset.image" :alt="asset.name" class="h-20 w-36 object-contain">
            </div>

            <div class="flex w-full items-center justify-between p-2">
              <span class="text-sm font-medium">{{ asset.name }}</span>
              <button :aria-label="`Download ${asset.name}`" class="transition-transform hover:scale-110" @click="handleDownloadImage(asset, index, wordmarkActions)">
                <icon :name="wordmarkActions[index]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="symbols" class="space-y-2">
        <h4>
          Symbols
        </h4>

        <div class="grid grid-cols-3 gap-4">
          <div v-for="(asset, index) in SYMBOLS" :key="asset.name" class="flex flex-col items-center">
            <div class="flex h-40 w-full items-center justify-center border" :class="asset.bgClass">
              <img :src="asset.image" :alt="asset.name" class="size-16 object-contain">
            </div>

            <div class="flex w-full items-center justify-between p-2">
              <span class="truncate text-sm font-medium">{{ asset.name }}</span>
              <button :aria-label="`Download ${asset.name}`" class="shrink-0 transition-transform hover:scale-110" @click="handleDownloadImage(asset, index, symbolActions)">
                <icon :name="symbolActions[index]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="colors" class="space-y-6">
        <h4>
          Colors
        </h4>

        <div v-for="category in colorCategories" :id="category.id" :key="category.name" class="space-y-2 pl-4">
          <h3>
            {{ category.name }}
          </h3>

          <div class="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
            <div v-for="(color, index) in category.colors" :key="color.name" class="flex flex-col items-center">
              <div class="aspect-square h-32 w-full cursor-pointer border" :style="{ backgroundColor: `var(${color.var})` }" @click="handleCopyColor(color.var, index, category.actions)" />

              <div class="flex w-full flex-col p-2">
                <div class="flex w-full items-center justify-between">
                  <span class="text-sm font-medium">{{ color.name }}</span>
                  <button :aria-label="`Copy ${color.name}`" class="transition-transform hover:scale-110" @click="handleCopyColor(color.var, index, category.actions)">
                    <icon :name="category.actions[index]!.icon.value" size="20" />
                  </button>
                </div>

                <span class="text-xs text-muted-foreground">{{ colorValues[color.var] }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const { createActionHandler } = useActionIcon()
const { colorMode } = useTheme()
const colorValues = ref<Record<string, string>>({})
const activeSection = ref("wordmarks")
const symbolActions = SYMBOLS.map(() => createActionHandler("mdi:download"))
const wordmarkActions = WORDMARKS.map(() => createActionHandler("mdi:download"))

const colorCategories = [
  { id: "brand", name: "Brand Colors", colors: BRAND_COLORS, actions: BRAND_COLORS.map(() => createActionHandler("mdi:content-copy")) },
  { id: "base", name: "Base Colors", colors: BASE_COLORS, actions: BASE_COLORS.map(() => createActionHandler("mdi:content-copy")) },
  { id: "accent", name: "Accent Colors", colors: ACCENT_COLORS, actions: ACCENT_COLORS.map(() => createActionHandler("mdi:content-copy")) },
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

onMounted(() => {
  for (const color of colorCategories.flatMap(category => category.colors)) {
    colorValues.value[color.var] = getComputedStyle(document.documentElement).getPropertyValue(color.var).trim() || "—"
  }

  const observer = new IntersectionObserver((entries) => {
    const intersecting = entries.filter(entry => entry.isIntersecting)
    if (intersecting.length > 0) {
      const mostVisible = intersecting.reduce((prev, current) => {
        return current.intersectionRatio > prev.intersectionRatio ? current : prev
      })
      activeSection.value = mostVisible.target.id
    }
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], rootMargin: "-100px 0px -60% 0px" })

  BRAND_SECTIONS.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })
})

watch(colorMode, () => {
  for (const color of colorCategories.flatMap(category => category.colors)) {
    colorValues.value[color.var] = getComputedStyle(document.documentElement).getPropertyValue(color.var).trim() || "—"
  }
}, { flush: "post" })

useHead({
  title: "Brand Resources",
  link: [{ rel: "canonical", href: `${baseURL}/brand` }],
  meta: [{ name: "description", content: "LinKiosk Brand Resources and Guidelines." }],
})
</script>
