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

onMounted(async () => {
  try {
    await userStore.getUser()
    await profileItemsStore.getItems()
  }
  catch (error) {
    console.error("Layout initialization failed:", error)
    await navigateTo("/sign-in")
  }
  finally {
    isLoading.value = false
  }
})
</script>
