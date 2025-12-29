<template>
  <Navbar />

  <div class="mt-8 flex min-h-screen border-b">
    <div v-if="isSidebarOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden" @click="isSidebarOpen = false" />

    <div class="flex flex-1 flex-col xl:flex-row">
      <button class="btn fixed bottom-4 left-4 z-50 xl:hidden!" @click="isSidebarOpen = !isSidebarOpen">
        <icon :name="isSidebarOpen ? 'mdi:close' : 'mdi:menu'" size="30" />
      </button>

      <article
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="markdown mx-auto w-full overflow-x-auto p-8 md:px-24"
      >
        <slot />
      </article>

      <aside
        id="table-of-contents" class="fixed top-0 right-0 z-40 h-full w-4/5 transform border-l bg-card px-4! py-12! transition-transform duration-300 md:w-2/5 xl:relative xl:z-auto xl:translate-x-0 xl:border-l"
        :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="scroll-area sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <p class="border-b py-2 font-semibold text-muted-foreground uppercase">
            On this page
          </p>

          <nav class="space-y-2">
            <nuxt-link
              v-for="header in headers" :key="header.id"
              :to="`#${header.id}`" :class="headerClasses(header)"
              class="block transition-colors hover:text-primary" @click="isSidebarOpen = false"
            >
              <div class="flex flex-row items-center gap-2">
                <span v-if="header.method" :class="[REST_METHOD_LABELS[header.method as keyof typeof REST_METHOD_LABELS]]">{{ header.method }}</span>
                <span>{{ header.text }}</span>
              </div>
            </nuxt-link>
          </nav>
        </div>
      </aside>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const props = useRoute().meta.layoutProps ?? {}
const { headers, headerClasses } = useContent({ selector: ".markdown", ...props })
const isSidebarOpen = ref(false)
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
  font-weight: 700 !important;
  margin: 0.5em 0em !important;
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
  color: var(--muted-foreground) !important;
}

::v-deep(.markdown) p,
::v-deep(.markdown) ul,
::v-deep(.markdown) ol {
  margin: 0.75em 0 !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
}

::v-deep(.markdown) a:hover {
  text-decoration: underline !important;
}

::v-deep(.markdown) blockquote {
  border-left: 4px solid var(--primary);
  font-family: var(--font-mono);
  margin: 1rem 0 !important;
  padding: 0 0.5rem !important;
}

::v-deep(.markdown) pre,
::v-deep(.markdown) code {
  background-color: var(--card) !important;
  font-family: var(--font-mono) !important;
  border-radius: 0.25rem !important;
  padding: 0.25rem !important;
  font-size: 0.75rem !important;
  margin: 1em 0 !important;
  overflow-x: auto !important;
}

::v-deep(.markdown) code * {
  font-family: var(--font-mono) !important;
}
</style>
