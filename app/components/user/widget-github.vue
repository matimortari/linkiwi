<template>
  <div v-if="data" class="card flex flex-col gap-2 overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <div class="navigation-group">
      <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="size-12 rounded-full ring-2 ring-white/20">

      <div class="flex min-w-0 flex-col gap-1">
        <div class="flex flex-row items-start gap-1 text-start">
          <nuxt-link :to="data.profileUrl" target="_blank" class="truncate text-sm font-bold hover:underline">
            {{ data.name }}
          </nuxt-link>

          <span class="text-caption">@{{ data.handle }}</span>
        </div>

        <p class="flex gap-4 text-xs">
          <span><span class="font-semibold">{{ data.followers.toLocaleString() }}</span> followers</span>
          <span><span class="font-semibold">{{ data.publicRepos }}</span> repositories</span>
        </p>
      </div>

      <icon name="simple-icons:github" size="25" class="ml-auto shrink-0" />
    </div>

    <div v-if="data.repos.length" class="flex flex-col gap-4 border-t pt-2 text-start">
      <nuxt-link
        v-for="repo in data.repos" :key="repo.name"
        :to="repo.url" target="_blank"
        class="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2 text-start text-xs transition hover:bg-white/10"
      >
        <p class="flex min-w-0 flex-col gap-1 text-start">
          <span class="truncate font-mono font-semibold">{{ repo.name }}</span>
          <span v-if="repo.description" class="truncate text-muted-foreground">{{ repo.description }}</span>
        </p>

        <p class="flex items-center">
          <icon name="mdi:star-outline" size="15" />
          <span>{{ repo.stars }}</span>
        </p>
      </nuxt-link>
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
    data.value = await widgetsStore.getGitHubData(props.handle)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
