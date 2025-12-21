<template>
  <Masthead />

  <div class="flex flex-col items-center gap-4 md:flex-row md:items-start">
    <Sidebar />

    <main class="flex-1 overflow-x-hidden">
      <Loading v-if="isLoading" />
      <slot :class="{ hidden: isLoading }" />
    </main>
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
