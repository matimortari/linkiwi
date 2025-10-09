<template>
  <Loading v-if="isLoading" />

  <div v-show="!isLoading" class="min-h-screen">
    <div class="flex flex-col !items-start gap-4 p-4 md:flex-row">
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
const linkStore = useLinksStore()
const iconStore = useIconsStore()

const isLoading = ref(true)

async function getUserData() {
  try {
    await Promise.all([
      userStore.getUser(),
      linkStore.getLinks(),
      iconStore.getIcons(),
    ])
  }
  catch (err: any) {
    console.error("Failed to load user data:", err)
    await navigateTo("/sign-in")
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (document.readyState === "complete") {
    getUserData()
  }
  else {
    window.addEventListener("load", getUserData)
  }
})
</script>
