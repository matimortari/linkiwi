<template>
  <Loading v-if="isLoading" />

  <div v-show="!isLoading" class="min-h-screen">
    <div class="flex flex-col items-center gap-4 p-4 md:flex-row md:items-start">
      <Sidebar />

      <main class="relative min-h-[200px] flex-1 overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const linksStore = useLinksStore()
const iconsStore = useIconsStore()
const isLoading = ref(true)

async function getUserData() {
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
}

onMounted(getUserData)
</script>
