<template>
  <div class="card flex flex-col gap-3">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <template v-else-if="data">
      <!-- Header -->
      <div class="navigation-group">
        <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="size-10 rounded-full border object-cover">
        <div class="flex min-w-0 flex-col">
          <nuxt-link :to="data.profileUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold hover:underline">
            {{ data.name }}
          </nuxt-link>
          <span class="text-caption">{{ data.subscribers.toLocaleString() }} subscribers</span>
        </div>
        <icon name="simple-icons:youtube" size="20" class="ml-auto shrink-0 text-muted-foreground" />
      </div>

      <!-- Latest video -->
      <nuxt-link v-if="data.latestVideo" :to="data.latestVideo.url" target="_blank" class="card flex flex-col gap-2 p-2! hover:bg-muted!">
        <img v-if="data.latestVideo.thumbnail" :src="data.latestVideo.thumbnail" :alt="data.latestVideo.title" class="w-full rounded-lg object-cover">
        <div class="flex flex-col gap-0.5">
          <span class="line-clamp-2 text-sm font-medium">{{ data.latestVideo.title }}</span>
          <span class="text-caption text-xs">{{ formatDate(new Date(data.latestVideo.publishedAt)) }}</span>
        </div>
      </nuxt-link>
    </template>

    <p v-else-if="error" class="text-caption-danger">
      Could not load YouTube data.
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
    data.value = await $fetch(`/api/widgets/fetch/youtube/${props.handle}`)
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
