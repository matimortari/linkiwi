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

<style scoped>
::v-deep(.markdown) *,
#table-of-contents a span {
  font-family: "Roboto", sans-serif !important;
}

::v-deep(.markdown) h1,
::v-deep(.markdown) h2,
::v-deep(.markdown) h3,
::v-deep(.markdown) h4 {
  font-weight: 600 !important;
  margin: 0.5em 0 0.5em 0 !important;
}

::v-deep(.markdown) h1 {
  font-size: 2em !important;
}
::v-deep(.markdown) h2 {
  font-size: 1.75em !important;
}
::v-deep(.markdown) h3 {
  font-size: 1.5em !important;
}
::v-deep(.markdown) h4 {
  font-size: 1.25em !important;
}

::v-deep(.markdown) p,
::v-deep(.markdown) ul,
::v-deep(.markdown) ol {
  margin: 0.75em 0 !important;
}

::v-deep(.markdown) a:hover {
  text-decoration: underline !important;
}

::v-deep(.markdown) pre,
::v-deep(.markdown) code * {
  background-color: var(--color-card) !important;
  font-family: var(--font-mono) !important;
  font-size: 0.875rem !important;
  border-radius: 0.25rem !important;
}

::v-deep(.markdown) pre {
  padding: 0.5rem !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
  margin: 1em 0 !important;
}

::v-deep(.markdown) hr {
  border: none !important;
  border-top: 1px solid var(--color-border) !important;
  margin: 2em 0 !important;
}
</style>
