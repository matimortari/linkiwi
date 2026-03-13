<template>
  <div class="card flex flex-col gap-3">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <template v-else-if="data">
      <!-- Header -->
      <div class="navigation-group">
        <div class="relative shrink-0">
          <img :src="data.avatar" :alt="data.name" class="size-10 rounded-full border object-cover">
          <span v-if="data.isLive" class="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card bg-red-500" title="Live" />
        </div>
        <div class="flex min-w-0 flex-col">
          <a :href="data.profileUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold hover:underline">
            {{ data.name }}
          </a>
          <span v-if="data.isLive" class="text-caption-danger text-xs font-semibold tracking-wide uppercase">
            🔴 Live
          </span>
          <span v-else class="text-caption text-xs">Offline</span>
        </div>
        <icon name="simple-icons:twitch" size="20" class="ml-auto shrink-0 text-muted-foreground" />
      </div>

      <p v-if="data.description && !data.isLive" class="text-caption line-clamp-2">
        {{ data.description }}
      </p>

      <!-- Live stream info -->
      <nuxt-link v-if="data.isLive && data.stream" :to="data.profileUrl" target="_blank" class="card flex flex-col gap-2 p-2! hover:bg-muted!">
        <img v-if="data.stream.thumbnail" :src="data.stream.thumbnail" :alt="data.stream.title" class="w-full rounded-lg object-cover">
        <div class="flex flex-col gap-0.5">
          <span class="line-clamp-2 text-sm font-medium">{{ data.stream.title }}</span>
          <div class="navigation-group text-muted-foreground">
            <span v-if="data.stream.game" class="text-caption text-xs">{{ data.stream.game }}</span>
            <span class="text-caption text-xs">· {{ data.stream.viewers.toLocaleString() }} viewers</span>
          </div>
        </div>
      </nuxt-link>
    </template>

    <p v-else-if="error" class="text-caption-danger">
      Could not load Twitch data.
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
    data.value = await $fetch(`/api/widgets/fetch/twitch`, { query: { handle: props.handle } })
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
