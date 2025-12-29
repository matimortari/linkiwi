<template>
  <Masthead />

  <div class="flex flex-col items-center gap-4 md:flex-row md:items-start">
    <Sidebar :is-open="isSidebarOpen" @update:is-open="isSidebarOpen = $event" />

    <main class="flex-1 overflow-x-hidden">
      <Loading v-if="isLoading" />
      <slot v-else />
    </main>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const linksStore = useLinksStore()
const iconsStore = useIconsStore()
const isSidebarOpen = ref(false)
const isLoading = ref(true)

onMounted (async () => {
  try {
    await Promise.all([
      await userStore.getUser(),
      await linksStore.getLinks(),
      await iconsStore.getIcons(),
    ])
  }
  catch {
    await navigateTo("/sign-in")
  }
  finally {
    isLoading.value = false
  }
})
</script>
