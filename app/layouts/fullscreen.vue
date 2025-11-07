<template>
  <Navbar />

  <Loading v-if="isLoading" />

  <main v-show="!isLoading" class="flex min-h-screen w-full overflow-x-hidden">
    <slot />
  </main>

  <Footer />
</template>

<script setup lang="ts">
const isLoading = ref(true)

onMounted(async () => {
  await nextTick()
  isLoading.value = false
})
</script>
