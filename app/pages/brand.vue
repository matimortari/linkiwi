<template>
  <div class="mx-auto w-full max-w-5xl space-y-8 px-4 py-24">
    <header class="space-y-2 border-b pb-4 text-center md:text-start">
      <h1>
        Brand Resources
      </h1>
      <p class="max-w-xl font-medium text-muted-foreground">
        Official LinKiwi logos, symbols, and color palette.
      </p>
    </header>

    <div class="grid gap-2 md:grid-cols-2">
      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Symbols
        </h3>

        <div class="card space-y-2 p-2!">
          <div class="flex h-56 items-center justify-center rounded-lg border p-10" :class="selectedSymbol.bgClass">
            <img :src="selectedSymbol.image" :alt="selectedSymbol.name" class="h-16 w-auto object-contain">
          </div>

          <div class="flex items-center justify-between border-t p-2">
            <div class="navigation-group">
              <button
                v-for="(asset, index) in SYMBOLS" :key="asset.name"
                class="size-2.5 rounded-full transition-all" :class="index === selectedSymbolIndex ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/30'"
                :aria-label="`Show ${asset.name}`" @click="selectedSymbolIndex = index"
              />
            </div>
            <div class="navigation-group">
              <span class="text-caption">{{ selectedSymbol.name }}</span>
              <button :aria-label="`Download ${selectedSymbol.name}`" class="text-muted-foreground transition-colors" @click="handleDownloadImage(selectedSymbol, selectedSymbolIndex, symbolActions)">
                <icon :name="symbolActions[selectedSymbolIndex]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Wordmarks
        </h3>

        <div class="card space-y-2 p-2!">
          <div class="flex h-56 items-center justify-center rounded-lg border p-10" :class="selectedWordmark.bgClass">
            <img :src="selectedWordmark.image" :alt="selectedWordmark.name" class="h-16 w-auto object-contain">
          </div>

          <div class="flex items-center justify-between border-t px-1 pt-2">
            <div class="navigation-group">
              <button
                v-for="(asset, index) in WORDMARKS" :key="asset.name"
                class="size-2.5 rounded-full transition-all" :class="index === selectedWordmarkIndex ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/30'"
                :aria-label="`Show ${asset.name}`" @click="selectedWordmarkIndex = index"
              />
            </div>
            <div class="navigation-group">
              <span class="text-caption">{{ selectedWordmark.name }}</span>
              <button :aria-label="`Download ${selectedWordmark.name}`" class="text-muted-foreground transition-colors" @click="handleDownloadImage(selectedWordmark, selectedWordmarkIndex, wordmarkActions)">
                <icon :name="wordmarkActions[selectedWordmarkIndex]!.icon.value" size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
        Neutral Colors
      </h3>

      <div class="grid grid-cols-3 gap-2 md:grid-cols-3 xl:grid-cols-9">
        <div v-for="(color, index) in NEUTRAL_SCALE" :key="color.name" class="flex flex-col gap-2">
          <button class="aspect-square w-full rounded-lg border" :style="{ backgroundColor: `var(${color.var})` }" :aria-label="`Copy ${color.value}`" @click="handleCopyColor(color.value, index, neutralActions)" />
          <div class="flex flex-col px-1">
            <span class="truncate text-sm font-medium">{{ color.name }}</span>
            <button class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(color.value, index, neutralActions)">
              <span>{{ color.value }}</span>
              <icon :name="neutralActions[index]!.icon.value" size="15" class="shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Brand Colors
        </h3>

        <div class="flex flex-col gap-2">
          <div v-for="(color, index) in BRAND_COLORS" :key="color.name" class="flex flex-col gap-2">
            <button class="aspect-video w-full rounded-lg border" :style="{ backgroundColor: `var(${color.var})` }" :aria-label="`Copy ${color.value}`" @click="handleCopyColor(color.value, index, brandActions)" />
            <div class="flex flex-col px-1">
              <span class="truncate text-sm font-medium">{{ color.name }}</span>
              <button class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(color.value, index, brandActions)">
                <span>{{ color.value }}</span>
                <icon :name="brandActions[index]!.icon.value" size="15" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-base! tracking-widest text-muted-foreground uppercase">
          Status Colors
        </h3>

        <div class="grid grid-cols-2 gap-2">
          <div v-for="(group, index) in STATUS_COLORS" :key="group.name" class="card space-y-2">
            <span class="block font-semibold text-muted-foreground">{{ group.name }}</span>
            <div class="flex flex-col gap-2">
              <div class="navigation-group">
                <button class="size-10 shrink-0 rounded-md border" :style="{ backgroundColor: `var(${group.darkVar})` }" @click="handleCopyColor(group.darkVal, index * 2, statusActions)" />
                <button class="text-caption flex min-w-0 items-center gap-1 truncate font-mono" @click="handleCopyColor(group.darkVal, index * 2, statusActions)">
                  <span class="truncate">{{ group.darkVal }}</span>
                  <icon :name="statusActions[index * 2]!.icon.value" size="15" class="shrink-0" />
                </button>
              </div>
              <div class="navigation-group">
                <button class="size-10 shrink-0 rounded-md border" :style="{ backgroundColor: `var(${group.lightVar})` }" @click="handleCopyColor(group.lightVal, (index * 2) + 1, statusActions)" />
                <button class="text-caption flex min-w-0 items-center gap-1 truncate font-mono" @click="handleCopyColor(group.lightVal, (index * 2) + 1, statusActions)">
                  <span class="truncate">{{ group.lightVal }}</span>
                  <icon :name="statusActions[(index * 2) + 1]!.icon.value" size="15" class="shrink-0" />
                </button>
              </div>
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
const selectedWordmarkIndex = ref(0)
const selectedSymbolIndex = ref(0)
const symbolActions = SYMBOLS.map(() => createActionHandler("mdi:download"))
const wordmarkActions = WORDMARKS.map(() => createActionHandler("mdi:download"))
const neutralActions = NEUTRAL_SCALE.map(() => createActionHandler("mdi:content-copy"))
const brandActions = BRAND_COLORS.map(() => createActionHandler("mdi:content-copy"))
const statusActions = Array.from({ length: STATUS_COLORS.length * 2 }, () => createActionHandler("mdi:content-copy"))
const selectedWordmark = computed(() => WORDMARKS[selectedWordmarkIndex.value] ?? WORDMARKS[0]!)
const selectedSymbol = computed(() => SYMBOLS[selectedSymbolIndex.value] ?? SYMBOLS[0]!)

function handleDownloadImage(logo: { name: string, image: string }, index: number, actions: any[]) {
  if (!actions[index]) {
    return
  }

  const link = document.createElement("a")
  link.href = logo.image
  link.download = logo.name.replace(/\s+/g, "-").toLowerCase()
  link.click()
  actions[index].triggerSuccess()
}

async function handleCopyColor(hex: string, index: number, actions: any[]) {
  if (!actions[index]) {
    return
  }
  await actions[index].triggerCopy(hex)
}

useHead({
  title: "Brand Resources",
  link: [{ rel: "canonical", href: `${baseURL}/brand` }],
  meta: [{ name: "description", content: "LinKiwi brand assets, resources and color specifications." }],
})
</script>
