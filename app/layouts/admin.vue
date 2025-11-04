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
const { fetchUser } = useUserActions()
const { fetchLinks } = useLinkActions()
const { fetchIcons } = useIconActions()

const isLoading = ref(true)

async function getUserData() {
  try {
    await Promise.all([
      await fetchUser(),
      await fetchLinks(),
      await fetchIcons(),
    ])
  }
  catch {
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
