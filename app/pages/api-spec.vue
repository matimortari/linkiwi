<template>
  <Navbar />

  <Loading v-if="isLoading" />

  <div v-show="!isLoading" class="flex flex-col gap-8 p-12 px-4 md:flex-row">
    <main class="flex-1">
      <div
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="markdown w-full p-4 md:px-8"
      >
        <article v-if="apiSpec">
          <ContentRenderer :value="apiSpec" />
        </article>
      </div>
    </main>

    <aside id="table-of-contents" class="bg-card scroll-area sticky top-20 hidden h-[calc(100vh-6rem)] shrink-0 overflow-auto rounded-xl p-4! md:block">
      <nav class="space-y-2">
        <h4 class="text-end">
          On This Page
        </h4>

        <ul class="space-y-1 border-t py-2">
          <li v-for="header in headers" :key="header.id">
            <a :href="`#${header.id}`" :class="`${headerClasses(header)} flex items-center justify-end gap-2`">
              {{ header.text }}
              <span v-if="header.method" :class="`px-2 py-1 rounded-full font-mono text-xs ${REST_METHOD_COLORS[header.method as keyof typeof REST_METHOD_COLORS]}`">
                {{ header.method }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const apiSpec = await queryCollection("content").path("/api").first()

const isLoading = ref(true)

const { headers, headerClasses } = useActiveHeading({
  selector: ".markdown article",
  parseMethod: true,
})

onMounted(async () => {
  await nextTick()
  isLoading.value = false
})

useHead({
  title: "API Specification",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/api-spec" }],
  meta: [{ name: "description", content: "LinkNest API Specification." }],
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
