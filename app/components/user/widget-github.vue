<template>
  <div v-if="data" class="card flex flex-col gap-2 overflow-hidden" :style="linkStyle()">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <div class="navigation-group">
      <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="ring-surface-foreground size-8 rounded-full ring-1">

      <div class="flex min-w-0 flex-col gap-1">
        <div class="flex flex-row items-start gap-1 text-start">
          <nuxt-link :to="data.profileUrl" target="_blank" class="truncate text-sm font-bold hover:underline" :style="linkInnerStyle">
            {{ data.name }}
          </nuxt-link>

          <span class="text-caption" :style="widgetTextStyle">@{{ data.handle }}</span>
        </div>

        <p class="flex gap-4 text-xs" :style="widgetTextStyle">
          <span><span class="font-semibold">{{ data.followers.toLocaleString() }}</span> followers</span>
          <span><span class="font-semibold">{{ data.publicRepos }}</span> repositories</span>
        </p>
      </div>

      <icon name="simple-icons:github" size="25" class="ml-auto shrink-0!" :style="widgetTextStyle" />
    </div>

    <div v-if="data.repos.length" class="grid grid-cols-2 gap-2 text-start md:grid-cols-3">
      <nuxt-link
        v-for="repo in data.repos" :key="repo.name"
        :to="repo.url" target="_blank"
        class="flex items-center justify-between gap-2 rounded-lg bg-white/20 p-2 text-start transition hover:bg-white/30"
      >
        <p class="flex min-w-0 flex-col gap-1 text-start">
          <span class="truncate font-mono text-sm font-semibold" :style="linkInnerStyle">{{ repo.name }}</span>
          <span v-if="repo.description" class="truncate text-xs" :style="widgetTextStyle">{{ repo.description }}</span>
        </p>

        <p class="flex items-center" :style="widgetTextStyle">
          <icon name="mdi:star-outline" size="15" />
          <span>{{ repo.stars }}</span>
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  handle: string
  preferences: UserPreferences
}>()

const widgetsStore = useWidgetsStore()
const { widgetLoading } = storeToRefs(widgetsStore)
const { linkStyle, linkInnerStyle, widgetTextStyle } = useDynamicStyles(toRef(props, "preferences"))
const widgetType = "GITHUB" as const
const data = ref<any>(null)
const loading = computed(() => widgetLoading.value[widgetType])

onMounted(async () => {
  const res = await widgetsStore.getWidgetData(widgetType, props.handle)
  data.value = res?.data || null
})
</script>
