<template>
  <div v-if="data" class="card flex flex-col gap-2 overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <div class="navigation-group">
      <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="size-12 rounded-full ring-2 ring-red-500/40">

      <div class="flex min-w-0 flex-col items-start text-start">
        <nuxt-link :to="data.profileUrl" target="_blank" class="truncate text-sm font-bold hover:underline">
          {{ data.name }}
        </nuxt-link>

        <span class="text-caption">{{ data.subscribers.toLocaleString() }} subscribers</span>
      </div>

      <icon name="simple-icons:youtube" size="25" class="ml-auto shrink-0" />
    </div>

    <div v-if="data.videos?.length" class="flex flex-col gap-4 border-t pt-2 text-start">
      <span class="text-xs font-semibold text-muted-foreground">Latest Video</span>

      <nuxt-link :to="data.videos[0].url" target="_blank" class="group relative mx-auto w-full max-w-md overflow-hidden rounded-xl">
        <img v-if="data.videos[0].thumbnail" :src="data.videos[0].thumbnail" :alt="data.videos[0].title" class="size-full rounded-xl object-cover transition-all group-hover:brightness-75">

        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-red-600/90 transition-transform group-hover:scale-110">
            <icon name="mdi:play" size="25" />
          </div>
        </div>

        <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
          <div class="absolute inset-x-0 bottom-0 w-full p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <p class="line-clamp-2 text-sm font-medium">
              {{ data.videos[0].title }}
            </p>
            <p class="mt-0.5 text-[10px] text-muted-foreground">
              {{ formatDate(new Date(data.videos[0].publishedAt)) }}
            </p>
          </div>
        </div>
      </nuxt-link>

      <div v-if="data.videos?.length > 1" class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div v-for="video in data.videos.slice(1)" :key="video.id" class="group relative overflow-hidden rounded-xl">
          <nuxt-link :to="video.url" target="_blank">
            <img
              v-if="video.thumbnail" :src="video.thumbnail"
              :alt="video.title" class="aspect-video w-full rounded-lg object-cover transition-all group-hover:brightness-75"
            >
            <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30">
              <p class="absolute inset-x-0 bottom-0 line-clamp-2 w-full p-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
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
const props = defineProps<{ handle: string }>()
const widgetsStore = useWidgetsStore()
const data = ref<any>(null)
const loading = ref(false)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = false

  try {
    data.value = await widgetsStore.getYouTubeData(props.handle)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
