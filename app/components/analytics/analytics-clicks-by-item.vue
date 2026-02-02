<template>
  <div class="card flex flex-col gap-4">
    <h3>
      Clicks by Item
    </h3>

    <Spinner v-if="linksLoading || iconsLoading || analyticsLoading" />
    <Empty v-if="!items.length" message="No links or social icons yet." icon-name="mdi:octagram-minus-outline" />

    <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-3">
      <li v-for="item in items" :key="item.id" class="card flex flex-col gap-2">
        <div class="flex flex-row items-center justify-between font-semibold">
          <icon v-if="item.type === 'icon'" :name="item.logo" :size="30" />
          <span v-else>{{ item.title }}</span>

          <span class="text-sm font-medium text-primary">{{ clicksMap[item.id] ?? 0 }} clicks</span>
        </div>

        <nuxt-link v-if="item.url" :to="item.url" class="text-caption truncate hover:underline">
          {{ item.url }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const linksStore = useLinksStore()
const iconsStore = useIconsStore()
const analyticsStore = useAnalyticsStore()
const { loading: linksLoading } = storeToRefs(linksStore)
const { loading: iconsLoading } = storeToRefs(iconsStore)
const { loading: analyticsLoading } = storeToRefs(analyticsStore)

// Merge links and social icons into a single items array
const items = computed(() => [
  ...linksStore.links.map(l => ({
    id: l.id!,
    type: "link" as const,
    title: l.title,
    url: l.url,
  })),
  ...iconsStore.icons.map(i => ({
    id: i.id!,
    type: "icon" as const,
    logo: i.logo,
    platform: i.platform,
    url: i.url,
  })),
])

// Create a map of item ID to click counts
const clicksMap = computed(() => {
  const counts: Record<string, number> = {}

  for (const click of analyticsStore.analytics?.linkClicks ?? []) {
    const id = click.userLinkId
    if (id) {
      counts[id] = (counts[id] ?? 0) + 1
    }
  }

  for (const click of analyticsStore.analytics?.iconClicks ?? []) {
    const id = click.userIconId
    if (id) {
      counts[id] = (counts[id] ?? 0) + 1
    }
  }

  return counts
})

onMounted(async () => {
  await Promise.all([
    linksStore.getLinks(),
    iconsStore.getIcons(),
    analyticsStore.getAnalytics(),
  ])
})
</script>
