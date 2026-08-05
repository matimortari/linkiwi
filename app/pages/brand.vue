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

    <div class="grid gap-2 md:grid-cols-3">
      <div v-for="(asset, index) in SYMBOLS" :key="asset.name" class="flex flex-col gap-2 p-2">
        <div class="group relative flex h-40 items-center justify-center overflow-hidden rounded-lg border" :class="asset.bgClass">
          <img :src="asset.image" :alt="asset.name" class="h-24 w-auto object-contain">
          <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Download ${asset.name}`" @click="handleDownloadImage(asset, index, symbolActions)">
            <span class="brand-chip">
              <span>Download</span>
              <icon :name="symbolActions[index]!.icon.value" size="20" />
            </span>
          </button>
        </div>
        <span class="text-caption">{{ asset.name }}</span>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <h2 id="wordmarks">
      Wordmarks
    </h2>

    <div class="grid gap-2 md:grid-cols-2">
      <div v-for="(asset, index) in WORDMARKS" :key="asset.name" class="flex flex-col gap-2 p-2">
        <div class="group relative flex h-40 items-center justify-center overflow-hidden rounded-lg border" :class="asset.bgClass">
          <img :src="asset.image" :alt="asset.name" class="h-12 w-auto object-contain">
          <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Download ${asset.name}`" @click="handleDownloadImage(asset, index, wordmarkActions)">
            <span class="brand-chip">
              <span>Download</span>
              <icon :name="wordmarkActions[index]!.icon.value" size="20" />
            </span>
          </button>
        </div>
        <span class="text-caption">{{ asset.name }}</span>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <h2 id="colors">
      Colors
    </h2>

    <div class="space-y-2">
      <h3 id="brand-colors">
        Brand Colors
      </h3>

      <div class="grid gap-2 md:grid-cols-2">
        <div v-for="(color, index) in BRAND_COLORS" :key="color.name" class="flex flex-col gap-2 p-2">
          <div class="group relative h-40 overflow-hidden rounded-lg border md:h-48" :style="{ backgroundColor: `var(${color.var})` }">
            <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Copy ${color.value}`" @click="handleCopyColor(color.value, index, brandActions)">
              <span class="brand-chip font-mono">
                <span>{{ color.value }}</span>
                <icon :name="brandActions[index]!.icon.value" size="15" />
              </span>
            </button>
          </div>
          <span class="text-caption">{{ color.name }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <h3 id="neutral-colors">
        Neutral Colors
      </h3>

      <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="(color, index) in NEUTRAL_SCALE" :key="color.name" class="flex flex-col gap-2 p-2">
          <div class="group relative h-28 overflow-hidden rounded-lg border md:h-32" :style="{ backgroundColor: `var(${color.var})` }">
            <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Copy ${color.value}`" @click="handleCopyColor(color.value, index, neutralActions)">
              <span class="brand-chip font-mono">
                <span>{{ color.value }}</span>
                <icon :name="neutralActions[index]!.icon.value" size="15" />
              </span>
            </button>
          </div>
          <span class="text-caption">{{ color.name }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <h3 id="status-colors">
        Status Colors
      </h3>

      <div class="grid gap-2 md:grid-cols-2">
        <div v-for="(status, statusIndex) in STATUS_COLORS" :key="status.name" class="flex flex-col gap-2 p-2">
          <div class="flex h-28 overflow-hidden rounded-lg border md:h-32">
            <div class="group relative h-full w-1/2" :style="{ backgroundColor: `var(${status.darkVar})` }">
              <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Copy ${status.darkVal}`" @click="handleCopyColor(status.darkVal, statusIndex * 2, statusActions)">
                <span class="brand-chip font-mono">
                  <span>{{ status.darkVal }}</span>
                  <icon :name="statusActions[statusIndex * 2]!.icon.value" size="15" />
                </span>
              </button>
            </div>
            <div class="group relative h-full w-1/2" :style="{ backgroundColor: `var(${status.lightVar})` }">
              <button type="button" class="brand-action bg-black/0 group-hover:bg-black/50 focus-visible:bg-black/50" :aria-label="`Copy ${status.lightVal}`" @click="handleCopyColor(status.lightVal, (statusIndex * 2) + 1, statusActions)">
                <span class="brand-chip font-mono">
                  <span>{{ status.lightVal }}</span>
                  <icon :name="statusActions[(statusIndex * 2) + 1]!.icon.value" size="15" />
                </span>
              </button>
            </div>
          </div>
          <span class="text-caption">{{ status.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const symbolActions = SYMBOLS.map(() => useActionIcon("mdi:download"))
const wordmarkActions = WORDMARKS.map(() => useActionIcon("mdi:download"))
const neutralActions = NEUTRAL_SCALE.map(() => useActionIcon("mdi:content-copy"))
const brandActions = BRAND_COLORS.map(() => useActionIcon("mdi:content-copy"))
const statusActions = Array.from({ length: STATUS_COLORS.length * 2 }, () => useActionIcon("mdi:content-copy"))

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

<style scoped>
.brand-action {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition);
}

.brand-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 0.375rem;
  background-color: color-mix(in srgb, var(--background) 90%, transparent);
  padding: 0.375rem 0.625rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--muted-foreground);
  opacity: 0;
  transition: opacity var(--transition);
}

.group:hover > .brand-action > .brand-chip,
.brand-action:focus-visible > .brand-chip {
  opacity: 1;
}
</style>
