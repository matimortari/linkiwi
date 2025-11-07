<template>
  <Navbar />

  <div class="mt-8 flex min-h-screen border-b">
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden" @click="sidebarOpen = false" />

    <div class="flex flex-1 flex-col xl:flex-row">
      <button class="btn fixed bottom-4 left-4 z-50 xl:hidden!" @click="sidebarOpen = !sidebarOpen">
        <icon :name="sidebarOpen ? 'ph:x-bold' : 'ph:list-bold'" size="30" />
      </button>

      <article
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="markdown mx-auto w-full overflow-x-auto p-8 md:px-24"
      >
        <slot />
      </article>

      <aside
        id="table-of-contents"
        class="scroll-area bg-card fixed top-0 right-0 z-40 h-full w-3/4 transform border-l px-4! py-12! transition-transform duration-300 md:w-1/4 xl:relative xl:z-auto xl:translate-x-0 xl:border-l"
        :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <p class="text-muted-foreground border-b py-2 font-semibold uppercase">
            On this page
          </p>

          <nav class="space-y-2">
            <nuxt-link
              v-for="header in headers" :key="header.id"
              :to="`#${header.id}`" :class="headerClasses(header)"
              class="hover:text-primary block transition-colors" @click="sidebarOpen = false"
            >
              <div class="flex flex-row items-center gap-2">
                <span v-if="header.method" :class="[REST_METHOD_LABELS[header.method as keyof typeof REST_METHOD_LABELS]]">
                  {{ header.method }}
                </span>
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

const sidebarOpen = ref(false)
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
