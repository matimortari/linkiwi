<template>
  <div class="card flex flex-col gap-3">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Loading />
    </div>

    <template v-else-if="data">
      <!-- Header -->
      <div class="navigation-group">
        <img :src="data.avatar" :alt="data.name" class="size-10 rounded-full border object-cover">
        <div class="flex min-w-0 flex-col">
          <nuxt-link :to="data.profileUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold hover:underline">
            {{ data.name }}
          </nuxt-link>
          <span class="text-caption truncate">@{{ data.handle }}</span>
        </div>
        <icon name="simple-icons:github" size="20" class="ml-auto shrink-0 text-muted-foreground" />
      </div>

      <p v-if="data.bio" class="text-caption line-clamp-2">
        {{ data.bio }}
      </p>

      <!-- Stats -->
      <div class="flex gap-4">
        <span class="text-caption"><span class="font-semibold text-foreground">{{ data.followers.toLocaleString() }}</span> followers</span>
        <span class="text-caption"><span class="font-semibold text-foreground">{{ data.publicRepos }}</span> repos</span>
      </div>

      <!-- Repos -->
      <div v-if="data.repos.length" class="flex flex-col gap-1">
        <nuxt-link
          v-for="repo in data.repos" :key="repo.name"
          :to="repo.url" target="_blank"
          class="card flex items-center justify-between gap-2 p-2! text-sm hover:bg-muted!"
        >
          <div class="flex min-w-0 flex-col gap-0.5">
            <span class="truncate font-medium">{{ repo.name }}</span>
            <span v-if="repo.description" class="text-caption truncate">{{ repo.description }}</span>
          </div>
          <div class="navigation-group shrink-0 text-muted-foreground">
            <span v-if="repo.language" class="text-xs">{{ repo.language }}</span>
            <span class="flex items-center gap-0.5 text-xs">
              <icon name="mdi:star-outline" size="14" />
              {{ repo.stars }}
            </span>
          </div>
        </nuxt-link>
      </div>
    </template>

    <p v-else-if="error" class="text-caption-danger">
      Could not load GitHub data.
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
    data.value = await $fetch(`/api/widgets/fetch/github/${props.handle}`)
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
