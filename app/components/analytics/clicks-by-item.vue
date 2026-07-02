<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h4>
      Clicks by Item
    </h4>

    <Loading v-if="loading" />
    <Empty v-else-if="!items.length" message="Not enough data yet." icon-name="mdi:octagram-minus-outline" />

    <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
      <li v-for="item in items" :key="item.id" class="card flex flex-col gap-1">
        <div class="flex flex-row items-center justify-between font-semibold">
          <icon v-if="item.type === 'icon' && item.logo" :name="item.logo" :size="30" />
          <span v-else>{{ item.title }}</span>

          <span class="text-caption-info text-sm font-medium">{{ clicksMap[item.id] ?? 0 }} clicks</span>
        </div>

        <nuxt-link v-if="item.url" :to="item.url" class="text-caption truncate hover:underline">
          {{ item.url }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const profileItemsStore = useProfileItemsStore()
const analyticsStore = useAnalyticsStore()
const loading = computed(() => profileItemsStore.loading || analyticsStore.loading)

// Map the unified items array down into the local structural variants
const items = computed(() => {
  return (profileItemsStore.items || []).filter((item: ProfileItem) => item.type === "LINK" || item.type === "ICON").map((item: ProfileItem) => {
    if (item.type === "LINK" && item.link) {
      return {
        id: item.id,
        type: "link" as const,
        title: item.link.label,
        url: item.link.url,
        logo: null as string | null,
      }
    }
    if (item.type === "ICON" && item.icon) {
      return {
        id: item.id,
        type: "icon" as const,
        title: item.icon.platform ?? null,
        url: item.icon.url,
        logo: item.icon.logo ?? null,
      }
    }
    return null
  }).filter((item): item is Exclude<typeof item, null> => item !== null)
})

const clicksMap = computed(() => {
  const counts: Record<string, number> = {}
  for (const click of analyticsStore.itemClicks || []) {
    if (click.itemId) {
      counts[click.itemId] = (counts[click.itemId] ?? 0) + 1
    }
  }
  return counts
})

onMounted(async () => await profileItemsStore.getItems())
</script>
