<template>
  <div class="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-8">
    <h3>
      Clicks by Item
    </h3>

    <Loading v-if="loading" />
    <Empty v-else-if="!items.length" message="No links or social icons yet." icon-name="mdi:octagram-minus-outline" />

    <ul v-else class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <li v-for="item in items" :key="item.id" class="card flex flex-col gap-2">
        <div class="flex flex-row items-center justify-between font-semibold">
          <icon v-if="item.type === 'icon'" :name="item.logo" :size="30" />
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
const { loading } = storeToRefs(profileItemsStore)

// Map the unified items array down into the local structural variants
const items = computed(() => {
  return (profileItemsStore.items || []).filter((item: Record<string, any>) => item.type === "LINK" || item.type === "ICON").map((item: Record<string, any>) => {
    if (item.type === "LINK") {
      return {
        id: item.id!,
        type: "link" as const,
        title: item.title,
        url: item.url,
      }
    }

    return {
      id: item.id!,
      type: "icon" as const,
      logo: item.logo,
      platform: item.platform,
      url: item.url,
    }
  })
})

const clicksMap = computed(() => {
  const counts: Record<string, number> = {}
  for (const click of analyticsStore.itemClicks || []) {
    const id = click.itemId
    if (id) {
      counts[id] = (counts[id] ?? 0) + 1
    }
  }

  return counts
})

onMounted(async () => await Promise.all([analyticsStore.getAnalytics(), profileItemsStore.getItems()]))
</script>
