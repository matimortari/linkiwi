<template>
  <Masthead :is-toc-open="isTocOpen" @toggle-toc="isTocOpen = !isTocOpen" />

  <div class="relative flex min-h-screen w-full pt-24 md:px-12">
    <div v-if="isTocOpen" aria-hidden="true" class="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs xl:hidden" @click="isTocOpen = false" />

    <aside
      id="table-of-contents" class="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 overflow-y-auto bg-background p-8 transition-transform md:z-20 xl:sticky xl:top-24 xl:h-[calc(100vh-6rem)] xl:translate-x-0"
      :class="isTocOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <p class="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
        On this page
      </p>
      <nav class="flex flex-col gap-2">
        <nuxt-link
          v-for="heading in headings" :key="heading.id"
          :to="`#${heading.id}`" class="text-sm transition-colors hover:text-primary"
          :class="activeId === heading.id ? 'font-semibold text-primary' : 'text-muted-foreground'" @click="isTocOpen = false"
        >
          {{ heading.text }}
        </nuxt-link>
      </nav>
    </aside>

    <main
      v-motion :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0 }" :duration="600"
      class="prose"
    >
      <slot />
    </main>

    <button class="btn fixed bottom-6 left-6 z-30" aria-label="Scroll to top" @click="scrollToTop">
      <icon name="mdi:arrow-up" size="25" />
    </button>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const route = useRoute()
const isTocOpen = ref(false)
const headings = ref<{ id: string, text: string }[]>([])
const activeId = ref("")
let observer: IntersectionObserver | null = null

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function extractHeadings() {
  const domHeadings = document.querySelectorAll(".prose h2")
  headings.value = Array.from(domHeadings).map(el => ({ id: el.id, text: el.textContent || "" }))
  initObserver()
}

function initObserver() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { rootMargin: "-20% 0px -80% 0px" })

  document.querySelectorAll(".prose h2").forEach(el => observer!.observe(el))
}

onMounted(() => nextTick(() => extractHeadings()))

watch(() => route.path, () => nextTick(() => extractHeadings()))

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.prose {
  margin-bottom: 3rem;
  width: 100%;
  padding: clamp(1.2rem, 2vw, 2rem);
  padding-inline: 1rem;
  padding-bottom: 2.5rem;
}
@media (min-width: 768px) {
  .prose {
    border: 1px solid color-mix(in srgb, var(--muted) 65%, transparent);
    border-radius: var(--border-radius);
    padding-inline: 1.5rem;
    padding-bottom: 3.5rem;
  }
}
@media (min-width: 1280px) {
  .prose {
    max-width: 100ch;
  }
}

.prose :deep(> :first-child) {
  margin-top: 0;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 1rem 0;
}

:deep(.prose h1) {
  font-size: clamp(1.875rem, 5vw, 2.25rem);
  line-height: 1.2;
}
:deep(.prose h2) {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  line-height: 1.25;
}
:deep(.prose h3) {
  font-size: clamp(1.125rem, 3vw, 1.25rem);
  line-height: 1.5;
}
:deep(.prose h4) {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.25;
}

:deep(.prose) p,
:deep(.prose) li {
  margin: 0.5rem 0;
}

:deep(.prose) p a,
:deep(.prose) li a {
  color: var(--primary);
  font-weight: 600;
}
:deep(.prose) p a:hover,
:deep(.prose) a:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

:deep(.prose) ul,
:deep(.prose) ol {
  margin: 0.5rem 0 1.4rem 0;
  padding-left: 1.35rem;
  font-size: 0.95rem;
  line-height: 1.75;
}
:deep(.prose) ul {
  list-style-type: disc;
}
:deep(.prose) ol {
  list-style-type: decimal;
}

:deep(.prose) li::marker {
  color: var(--muted-foreground);
  font-weight: 600;
}
:deep(.prose) li ul,
:deep(.prose) li ol {
  margin-block: 0.25rem;
  padding-left: 1rem;
}

:deep(.prose) blockquote {
  border-left: 4px solid var(--primary);
  background-color: #1b1e28;
  padding: 0.9rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  font-style: italic;
  color: var(--foreground);
}
:deep(.prose) blockquote p {
  margin: 0;
}
:deep(.prose) blockquote code {
  font-size: 0.75rem;
}

:deep(.prose) code {
  background-color: #1b1e28;
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  border-radius: calc(var(--border-radius) * 0.5);
  padding: 0.18rem 0.42rem;
  border: 1px solid var(--muted);
}
:deep(.prose) code * {
  font-family: var(--font-mono);
}

:deep(.prose) pre {
  background-color: #1b1e28;
  border: 1px solid var(--muted);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 0.5rem 0;
  overflow-x: auto;
  line-height: 1.6;
  white-space: pre;
}
:deep(.prose) pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
}
</style>
