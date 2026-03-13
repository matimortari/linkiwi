<template>
  <div class="card flex flex-col gap-3">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <template v-else-if="data">
      <!-- Header -->
      <div class="navigation-group">
        <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="size-10 rounded-full border object-cover">
        <div v-else class="flex size-10 items-center justify-center rounded-full border bg-muted">
          <icon name="simple-icons:spotify" size="18" />
        </div>
        <div class="flex min-w-0 flex-col">
          <nuxt-link :to="data.profileUrl" target="_blank" class="text-sm font-semibold hover:underline">
            {{ data.name }}
          </nuxt-link>
          <span class="text-caption">{{ data.followers.toLocaleString() }} followers</span>
        </div>
        <icon name="simple-icons:spotify" size="20" class="ml-auto shrink-0 text-muted-foreground" />
      </div>

      <!-- Public playlists -->
      <div v-if="data.playlists.length" class="flex flex-col gap-1">
        <nuxt-link
          v-for="playlist in data.playlists" :key="playlist.id"
          :to="playlist.url" target="_blank"
          class="card flex items-center gap-2 p-2! hover:bg-muted!"
        >
          <img v-if="playlist.cover" :src="playlist.cover" :alt="playlist.name" class="size-8 shrink-0 rounded-sm object-cover">
          <div v-else class="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted">
            <icon name="mdi:music-note" size="14" />
          </div>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-sm font-medium">{{ playlist.name }}</span>
            <span class="text-caption text-xs">{{ playlist.tracks }} tracks</span>
          </div>
        </nuxt-link>
      </div>
    </template>

    <p v-else-if="error" class="text-caption-danger">
      Could not load Spotify data.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ handle: string }>()

const data = ref<any>(null)
const loading = ref(false)
const error = ref(false)

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    data.value = await $fetch(`/api/widgets/fetch/spotify`, { query: { handle: props.handle } })
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
