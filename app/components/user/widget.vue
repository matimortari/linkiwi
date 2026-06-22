<template>
  <div v-if="type === 'SPOTIFY' && spotifyEmbedUrl" class="w-full overflow-hidden rounded-xl" :style="linkStyle()">
    <iframe
      :src="spotifyEmbedUrl" width="100%"
      height="152" loading="lazy"
      style="border-radius: 12px"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  </div>

  <div v-else-if="data" class="card flex w-full flex-col gap-2 overflow-hidden" :style="linkStyle()">
    <Loading v-if="loading" />

    <div class="navigation-group w-full">
      <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="ring-surface-foreground size-8 rounded-full ring-1">

      <div class="flex min-w-0 flex-col gap-1">
        <div class="flex flex-row items-start gap-1 text-start">
          <nuxt-link :to="data.profileUrl" target="_blank" class="truncate text-sm font-bold hover:underline" :style="linkInnerStyle">
            {{ data.name }}
          </nuxt-link>
          <span v-if="type === 'GITHUB'" class="text-caption" :style="widgetTextStyle">@{{ data.handle }}</span>
        </div>

        <p class="text-xs" :style="widgetTextStyle">
          <template v-if="type === 'GITHUB'">
            <span><span class="font-semibold">{{ data.followers.toLocaleString() }}</span> followers</span>
            <span class="ml-4"><span class="font-semibold">{{ data.publicRepos }}</span> repositories</span>
          </template>
          <template v-else-if="type === 'YOUTUBE'">
            {{ data.subscribers.toLocaleString() }} subscribers
          </template>
        </p>
      </div>

      <icon :name="type === 'GITHUB' ? 'simple-icons:github' : 'simple-icons:youtube'" size="25" class="ml-auto shrink-0!" :style="widgetTextStyle" />
    </div>

    <div v-if="type === 'GITHUB' && data.repos?.length" class="grid grid-cols-2 gap-2 text-start md:grid-cols-3">
      <nuxt-link
        v-for="repo in data.repos" :key="repo.name"
        :to="repo.url" target="_blank"
        class="flex items-center justify-between gap-2 rounded-lg bg-white/20 p-2 text-start transition hover:bg-white/30"
      >
        <p class="flex min-w-0 flex-col gap-1 text-start">
          <span class="truncate font-mono text-sm font-semibold" :style="linkInnerStyle">{{ repo.name }}</span>
          <span v-if="repo.description" class="truncate text-xs" :style="widgetTextStyle">{{ repo.description }}</span>
        </p>
        <p class="flex items-center gap-0.5" :style="widgetTextStyle">
          <icon name="mdi:star-outline" size="15" />
          <span>{{ repo.stars }}</span>
        </p>
      </nuxt-link>
    </div>

    <div v-else-if="type === 'YOUTUBE' && data.videos?.length" class="flex flex-col gap-2 text-start">
      <nuxt-link :to="data.videos[0].url" target="_blank" class="group relative block w-full overflow-hidden rounded-xl">
        <img v-if="data.videos[0].thumbnail" :src="data.videos[0].thumbnail" :alt="data.videos[0].title" class="aspect-video w-full rounded-xl object-cover transition-all group-hover:brightness-75">
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-black/50 transition-transform group-hover:scale-110">
            <icon name="mdi:play" size="35" class="text-[#f9fafb]" />
          </div>
        </div>
        <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-2">
          <p class="line-clamp-2 text-sm font-medium text-[#f9fafb]">
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
            <img v-if="video.thumbnail" :src="video.thumbnail" :alt="video.title" class="aspect-video w-full rounded-lg object-cover transition-all group-hover:brightness-75">
            <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/50">
              <p class="absolute inset-x-0 bottom-0 line-clamp-2 w-full p-1 text-xs font-medium text-[#f9fafb] opacity-0 transition-opacity group-hover:opacity-100">
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
  type: "GITHUB" | "YOUTUBE" | "SPOTIFY"
  handle: string
  preferences: UserPreferences
}>()

const profileItemStore = useProfileItemsStore()
const { widgetLoading } = storeToRefs(profileItemStore)
const { linkStyle, linkInnerStyle, widgetTextStyle } = useDynamicStyles(toRef(props, "preferences"))
const data = ref<any>(null)
const loading = computed(() => widgetLoading.value[props.type] || false)

const spotifyEmbedUrl = computed(() => {
  if (props.type !== "SPOTIFY") {
    return null
  }
  const urlMatch = props.handle.trim().match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(?:[a-z]{2}(?:-[a-z]{2,4})?\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
  if (urlMatch) {
    return `https://open.spotify.com/embed/${urlMatch[1]}/${urlMatch[2]}?utm_source=generator`
  }

  const uriMatch = props.handle.trim().match(/spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/)
  if (uriMatch) {
    return `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}?utm_source=generator`
  }

  return null
})

// Only query remote data hooks if the widget requires external resolution state maps
onMounted(async () => {
  if (props.type === "GITHUB" || props.type === "YOUTUBE") {
    const res = await profileItemStore.getWidgetData(props.type, props.handle)
    data.value = res?.data || null
  }
})
</script>
