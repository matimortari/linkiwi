<template>
  <div class="section-container flex flex-col gap-2">
    <header class="my-2 flex flex-col gap-2">
      <h3>
        Clicks by Item
      </h3>
      <p class="text-caption">
        View the number of clicks for each link and social icon.
      </p>
    </header>

    <Spinner v-if="loading" />
    <p v-else-if="!items.length" class="text-lead m-8 text-center">
      No links or social icons yet.
    </p>

    <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
      <li v-for="item in items" :key="item.id" class="card flex flex-col gap-2 p-2">
        <div class="flex items-center justify-between">
          <div class="flex max-w-[70%] items-center gap-2 truncate font-semibold">
            <!-- Icon display -->
            <icon v-if="item.type === 'icon' && item.logo" :name="item.logo" :size="30" />
            <span v-if="item.type === 'icon'">{{ item.platform }}</span>

            <!-- Link display -->
            <span v-else>{{ item.title }}</span>
          </div>

          <span class="text-primary text-sm font-medium">
            {{ clicksMap[item.id] ?? 0 }} clicks
          </span>
        </div>

        <nuxt-link v-if="item.url" :to="item.url" class="text-caption truncate">
          {{ item.url }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsRecordSchema } from "~~/shared/schemas/analytics-schema"

const items = ref<Array<any>>([])
const clicksMap = ref<Record<string, number>>({})
const loading = ref(true)

onMounted(async () => {
  const { fetchLinks, links } = useLinkActions()
  const { fetchIcons, icons } = useIconActions()

  loading.value = true

  await fetchLinks()
  await fetchIcons()

  // Merge links and icons with a type marker
  items.value = [
    ...links.value.map(l => ({
      id: l.id!,
      type: "link",
      title: l.title,
      url: l.url,
    })),
    ...icons.value.map(i => ({
      id: i.id!,
      type: "icon",
      logo: i.logo,
      platform: i.platform,
      url: i.url,
    })),
  ]

  // Fetch analytics and aggregate clicks
  const res = await analyticsService.getAnalytics()
  const raw: Array<any> = [
    ...(res.linkClicks ?? []).map(r => ({ ...r, type: "link" })),
    ...(res.iconClicks ?? []).map(r => ({ ...r, type: "icon" })),
  ]

  const analytics: AnalyticsRecordSchema[] = raw as AnalyticsRecordSchema[]
  const counts: Record<string, number> = {}
  analytics.forEach((a) => {
    if (!a.id)
      return
    counts[a.id] = (counts[a.id] ?? 0) + 1
  })
  clicksMap.value = counts

  loading.value = false
})
</script>
