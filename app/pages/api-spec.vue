<template>
  <nav class="flex w-full items-center justify-between border-b px-4 py-2 md:px-8">
    <nuxt-link to="/" class="flex flex-row items-center gap-2">
      <img src="/assets/logo.png" alt="Logo" width="30">
      <img :src="themeTitle" alt="Wordmark" width="100">
    </nuxt-link>
    <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
      <icon :name="themeIcon" size="25" />
    </button>
  </nav>

  <Loading v-if="isLoading" />

  <div v-show="!isLoading" class="flex flex-col gap-8 p-4 md:flex-row">
    <main class="flex-1">
      <div
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="markdown bg-background w-full p-4 md:px-8"
      >
        <article v-if="apiSpec">
          <ContentRenderer :value="apiSpec" />
        </article>
      </div>
    </main>

    <aside class="scroll-area sticky top-12 hidden h-[calc(100vh-6rem)] flex-shrink-0 overflow-auto pr-4 md:block md:w-64">
      <nav class="space-y-2">
        <h3>On This Page</h3>
        <ul class="space-y-1">
          <li
            v-for="header in headers" :key="header.id"
            :class="[header.level === 3 ? 'ml-2' : header.level === 4 ? 'ml-4' : '', activeSection === header.id ? 'text-primary font-semibold' : '']"
          >
            <a :href="`#${header.id}`" class="flex items-center gap-2">
              {{ header.text }}
              <span v-if="header.method" :class="`px-2 py-1 rounded-full font-mono text-xs ${methodColors[header.method as keyof typeof methodColors]}`">
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

const headers = ref<{ id: string, text: string, level: number, method?: string }[]>([])
const isLoading = ref(true)

const { activeSection } = useActiveHeading()
const { toggleTheme, themeIcon, themeTitle } = useTheme()

const methodColors = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
}

onMounted(async () => {
  await nextTick()

  const container = document.querySelector(".markdown article")
  if (container) {
    const hElements = container.querySelectorAll("h2, h3, h4")
    headers.value = Array.from(hElements).map((el) => {
      let text = el.textContent?.trim() || ""
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      el.id = id

      let method: string | undefined
      const headerMatch = text.match(/^\s*(GET|POST|PUT|DELETE)\b/i)
      if (headerMatch && headerMatch[1]) {
        method = headerMatch[1].toUpperCase()
        text = text.replace(headerMatch[0], "").trim()
        if (el.childNodes[0])
          el.childNodes[0].textContent = text
      }

      return {
        id,
        text,
        level: Number.parseInt(el.tagName.replace("H", "")),
        method,
      }
    })
  }

  isLoading.value = false
})

useHead({
  title: "API Specification",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/api-spec" }],
  meta: [{ name: "description", content: "LinkNest API Specification." }],
})
</script>

<style scoped>
::v-deep(.markdown) * {
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
