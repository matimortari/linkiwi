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
          :class="activeId === heading.id ? 'font-semibold text-primary' : 'text-muted-foreground'" @click="handleTocClick(heading.id)"
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

function extractHeadings() {
  const domHeadings = document.querySelectorAll<HTMLElement>(".prose h2[id]")
  headings.value = Array.from(domHeadings).map(el => ({ id: el.id, text: el.textContent || "" }))
  updateActiveHeading()
}

function updateActiveHeading() {
  const headingEls = Array.from(document.querySelectorAll<HTMLElement>(".prose h2[id]"))
  if (!headingEls.length) {
    return
  }

  let current = headingEls[0]!.id
  for (const el of headingEls) {
    if (el.getBoundingClientRect().top <= 104) {
      current = el.id
    }
  }

  activeId.value = current
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function handleTocClick(headingId: string) {
  activeId.value = headingId
  isTocOpen.value = false
}

onMounted(() => {
  nextTick(extractHeadings)
  window.addEventListener("scroll", updateActiveHeading, { passive: true })
})

watch(() => route.path, () => nextTick(extractHeadings))

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveHeading)
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

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 1rem 0;
}

.prose :deep(h1) {
  font-size: clamp(1.875rem, 5vw, 2.25rem);
  line-height: 1.2;
}
.prose :deep(h2) {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  line-height: 1.25;
  scroll-margin-top: 6rem;
}
.prose :deep(h3) {
  font-size: clamp(1.125rem, 3vw, 1.25rem);
  line-height: 1.5;
}
.prose :deep(h4) {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.25;
}

.prose :deep(p),
.prose :deep(li) {
  margin: 0.5rem 0;
}

.prose :deep(p a),
.prose :deep(li a) {
  color: var(--primary);
  font-weight: 600;
}
.prose :deep(a:hover) {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 0.5rem 0 1.4rem 0;
  padding-left: 1.35rem;
  line-height: 1.75;
}
.prose :deep(ul) {
  list-style-type: disc;
}
.prose :deep(ol) {
  list-style-type: decimal;
}
.prose :deep(li:has(.code-block)) {
  list-style: none;
  margin-left: -1.35rem;
}

.prose :deep(li::marker) {
  color: var(--muted-foreground);
  font-weight: 600;
}
.prose :deep(li ul),
.prose :deep(li ol) {
  margin-block: 0.25rem;
  padding-left: 1rem;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--primary);
  background-color: #1b1e28;
  padding: 0.9rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  font-style: italic;
  color: var(--foreground);
}
.prose :deep(blockquote p) {
  margin: 0;
}
.prose :deep(blockquote code) {
  font-size: 0.75rem;
}

.prose :deep(code) {
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
.prose :deep(code *) {
  font-family: var(--font-mono);
}

.prose :deep(pre) {
  background-color: #1b1e28;
  border: 1px solid var(--muted);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 0.5rem 0;
  overflow-x: auto;
  line-height: 1.6;
  white-space: pre;
}
</style>
