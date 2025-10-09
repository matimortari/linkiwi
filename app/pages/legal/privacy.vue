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
        <article v-if="pageContent">
          <ContentRenderer :value="pageContent" />
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
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const pageContent = await queryCollection("content").path("/privacy-policy").first()

const { activeSection } = useActiveHeading()
const { toggleTheme, themeIcon, themeTitle } = useTheme()

const headers = ref<{ id: string, text: string, level: number }[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await nextTick()

  const container = document.querySelector(".markdown article")
  if (container) {
    const hElements = container.querySelectorAll("h2, h3, h4")
    headers.value = Array.from(hElements).map((el) => {
      const text = el.textContent?.trim() || ""
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      el.id = id
      return {
        id,
        text,
        level: Number.parseInt(el.tagName.replace("H", "")),
      }
    })
  }
  else {
    console.warn("Markdown container not found")
  }

  isLoading.value = false
})

useHead({
  title: "Privacy Policy",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/legal/privacy" }],
  meta: [{ name: "description", content: "LinkNest Privacy Policy." }],
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
