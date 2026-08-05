<template>
  <Toolbar />

  <div class="flex flex-col items-center gap-4 overflow-x-hidden md:flex-row md:items-start">
    <Sidebar :is-open="isSidebarOpen" />

    <main class="w-full flex-1 overflow-x-hidden">
      <Loading v-if="isLoading" class="flex min-h-screen items-center justify-center" />
      <slot v-else />
    </main>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const profileItemsStore = useProfileItemsStore()
const { isSidebarOpen } = useUIState()
const isLoading = ref(true)

async function goTo(path: string) {
  isLoading.value = false
  await navigateTo(path)
}

async function settled<T>(task: () => Promise<T>) {
  const [result] = await Promise.allSettled([task()])
  return result
}

onMounted(async () => {
  const userResult = await settled(() => userStore.getUser())
  if (userResult.status === "rejected") {
    await goTo("/sign-in")
    return
  }

  const itemsResult = await settled(() => profileItemsStore.getItems())
  if (itemsResult.status === "rejected") {
    await goTo("/sign-in")
    return
  }

  isLoading.value = false
})
</script>
