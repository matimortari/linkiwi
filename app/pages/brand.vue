<template>
  <h1>
    Brand Resources
  </h1>
  <p class="text-caption max-w-xl">
    Official LinKiwi logos, symbols, and color palette.
  </p>

  <div class="space-y-2">
    <h2 id="symbols">
      Symbols
    </h2>

    <div class="grid gap-2 sm:grid-cols-3">
      <div v-for="(asset, index) in SYMBOLS" :key="asset.name" class="card space-y-2 p-2!">
        <div class="flex h-40 items-center justify-center rounded-lg border" :class="asset.bgClass">
          <img :src="asset.image" :alt="asset.name" class="h-24 w-auto object-contain">
        </div>

        <div class="flex items-center justify-between border-t p-2">
          <span class="text-caption">{{ asset.name }}</span>
          <button type="button" :aria-label="`Download ${asset.name}`" class="text-muted-foreground transition-colors" @click="handleDownloadImage(asset, index, symbolActions)">
            <icon :name="symbolActions[index]!.icon.value" size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <h2 id="wordmarks">
      Wordmarks
    </h2>

    <div class="grid gap-2 sm:grid-cols-2">
      <div v-for="(asset, index) in WORDMARKS" :key="asset.name" class="card space-y-2 p-2!">
        <div class="flex h-40 items-center justify-center rounded-lg border" :class="asset.bgClass">
          <img :src="asset.image" :alt="asset.name" class="h-12 w-auto object-contain">
        </div>

        <div class="flex items-center justify-between border-t p-2">
          <span class="text-caption">{{ asset.name }}</span>
          <button type="button" :aria-label="`Download ${asset.name}`" class="text-muted-foreground transition-colors" @click="handleDownloadImage(asset, index, wordmarkActions)">
            <icon :name="wordmarkActions[index]!.icon.value" size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <h2 id="neutral-colors">
      Neutral Colors
    </h2>

    <div class="grid grid-cols-3 gap-2 md:grid-cols-3 xl:grid-cols-9">
      <div v-for="(color, index) in NEUTRAL_SCALE" :key="color.name" class="flex flex-col gap-2">
        <button
          type="button" class="aspect-square w-full rounded-lg border"
          :style="{ backgroundColor: `var(${color.var})` }" :aria-label="`Copy ${color.value}`"
          @click="handleCopyColor(color.value, index, neutralActions)"
        />
        <div class="flex flex-col px-1">
          <span class="truncate text-sm font-medium">{{ color.name }}</span>
          <button type="button" class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(color.value, index, neutralActions)">
            <span>{{ color.value }}</span>
            <icon :name="neutralActions[index]!.icon.value" size="15" class="shrink-0" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <div class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-4">
      <h2 id="brand-colors">
        Brand Colors
      </h2>
      <h2 id="status-colors" class="col-span-2">
        Status Colors
      </h2>

      <template v-for="(brand, rowIndex) in BRAND_COLORS" :key="brand.name">
        <div class="space-y-2">
          <button
            type="button" class="h-24 w-full rounded-lg border"
            :style="{ backgroundColor: `var(${brand.var})` }" :aria-label="`Copy ${brand.value}`"
            @click="handleCopyColor(brand.value, rowIndex, brandActions)"
          />
          <div class="flex flex-col px-1">
            <span class="truncate text-sm font-medium">{{ brand.name }}</span>
            <button type="button" class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(brand.value, rowIndex, brandActions)">
              <span>{{ brand.value }}</span>
              <icon :name="brandActions[rowIndex]!.icon.value" size="15" />
            </button>
          </div>
        </div>

        <div v-for="statusIndex in [rowIndex * 2, (rowIndex * 2) + 1]" :key="statusIndex" class="space-y-2">
          <div class="flex gap-2">
            <button
              type="button" class="size-24 rounded-lg border"
              :style="{ backgroundColor: `var(${STATUS_COLORS[statusIndex]!.darkVar})` }" :aria-label="`Copy ${STATUS_COLORS[statusIndex]!.darkVal}`"
              @click="handleCopyColor(STATUS_COLORS[statusIndex]!.darkVal, statusIndex * 2, statusActions)"
            />
            <button
              type="button" class="size-24 rounded-lg border"
              :style="{ backgroundColor: `var(${STATUS_COLORS[statusIndex]!.lightVar})` }" :aria-label="`Copy ${STATUS_COLORS[statusIndex]!.lightVal}`"
              @click="handleCopyColor(STATUS_COLORS[statusIndex]!.lightVal, (statusIndex * 2) + 1, statusActions)"
            />
          </div>
          <div class="flex flex-col px-1">
            <span class="truncate text-sm font-medium">{{ STATUS_COLORS[statusIndex]!.name }}</span>
            <div class="flex items-center gap-4">
              <button type="button" class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(STATUS_COLORS[statusIndex]!.darkVal, statusIndex * 2, statusActions)">
                <span>{{ STATUS_COLORS[statusIndex]!.darkVal }}</span>
                <icon :name="statusActions[statusIndex * 2]!.icon.value" size="15" />
              </button>
              <button type="button" class="text-caption flex items-center gap-1 font-mono" @click="handleCopyColor(STATUS_COLORS[statusIndex]!.lightVal, (statusIndex * 2) + 1, statusActions)">
                <span>{{ STATUS_COLORS[statusIndex]!.lightVal }}</span>
                <icon :name="statusActions[(statusIndex * 2) + 1]!.icon.value" size="15" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const symbolActions = SYMBOLS.map(() => useActionIcon("ph:download-bold"))
const wordmarkActions = WORDMARKS.map(() => useActionIcon("ph:download-bold"))
const neutralActions = NEUTRAL_SCALE.map(() => useActionIcon("ph:copy-bold"))
const brandActions = BRAND_COLORS.map(() => useActionIcon("ph:copy-bold"))
const statusActions = Array.from({ length: STATUS_COLORS.length * 2 }, () => useActionIcon("ph:copy-bold"))

function handleDownloadImage(logo: { name: string, image: string }, index: number, actions: any[]) {
  if (!actions[index]) {
    return
  }

  const a = document.createElement("a")
  a.href = logo.image
  a.download = logo.name.replace(/\s+/g, "-").toLowerCase()
  a.click()
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

definePageMeta({ layout: "content" })
</script>
