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
        </div>

        <p class="text-xs" :style="widgetTextStyle">
          {{ data.subscribers.toLocaleString() }} subscribers
        </p>
      </div>

      <icon name="simple-icons:youtube" size="25" class="ml-auto shrink-0" :style="widgetTextStyle" />
    </div>

    <div v-if="data.videos?.length" class="flex flex-col gap-2 text-start">
      <nuxt-link :to="data.videos[0].url" target="_blank" class="group relative block w-full overflow-hidden rounded-xl">
        <img v-if="data.videos[0].thumbnail" :src="data.videos[0].thumbnail" :alt="data.videos[0].title" class="aspect-video w-full rounded-xl object-cover transition-all group-hover:brightness-75">

        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-black/70 transition-transform group-hover:scale-110">
            <icon name="mdi:play" size="35" class="text-[#eeeeee]" />
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2">
          <p class="line-clamp-2 text-sm font-medium text-[#eeeeee]">
            {{ data.videos[0].title }}
          </p>
          <p class="mt-0.5 text-[10px]" :style="widgetTextStyle">
            {{ formatDate(new Date(data.videos[0].publishedAt)) }}
          </p>
        </div>
      </nuxt-link>

      <div v-if="data.videos?.length > 1" class="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div v-for="video in data.videos.slice(1)" :key="video.id" class="group relative overflow-hidden rounded-xl bg-white/20">
          <nuxt-link :to="video.url" target="_blank" class="group relative block w-full overflow-hidden rounded-xl">
            <img
              v-if="video.thumbnail" :src="video.thumbnail"
              :alt="video.title" class="aspect-video w-full rounded-lg object-cover transition-all group-hover:brightness-75"
            >
            <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30">
              <p class="absolute inset-x-0 bottom-0 line-clamp-2 w-full p-1 text-xs font-medium text-[#eeeeee] opacity-0 transition-opacity group-hover:opacity-100">
                {{ video.title }}
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
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
const widgetType = "YOUTUBE" as const
const data = ref<any>(null)
const loading = computed(() => widgetLoading.value[widgetType])

onMounted(async () => {
  const res = await widgetsStore.getWidgetData(widgetType, props.handle)
  data.value = res?.data || null
})
</script>
