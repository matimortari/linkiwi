<template>
  <Navbar />

  <div class="flex min-h-screen overflow-x-hidden border-b">
    <div v-if="isOpen" aria-hidden="true" class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm xl:hidden" @click="isOpen = false" />

    <div class="flex flex-1 flex-col xl:flex-row">
      <div class="btn fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 shadow-lg md:hidden!">
        <button class="transition-transform hover:scale-110" :aria-label="isOpen ? 'Close menu' : 'Open menu'" @click="isOpen = !isOpen">
          <icon :name="isOpen ? 'mdi:close' : 'mdi:menu'" size="25" />
        </button>
        <div class="bg-border h-6 w-px" />
        <button class="transition-transform hover:scale-110" aria-label="Scroll to top" @click="scrollToTop">
          <icon name="mdi:arrow-up" size="25" />
        </button>
      </div>

      <button class="btn fixed bottom-6 left-6 z-30 hidden! transition-transform md:flex!" aria-label="Scroll to top" @click="scrollToTop">
        <icon name="mdi:arrow-up" size="25" />
      </button>

      <article
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="markdown mx-auto w-full px-4 py-20 md:px-20 xl:mr-[25%]"
      >
        <slot />
      </article>

      <aside
        id="table-of-contents" :class="isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'"
        class="fixed inset-x-0 bottom-0 z-40 flex h-[80vh] w-full flex-col border-t bg-card shadow-xl transition-transform md:inset-y-0 md:right-0 md:left-auto md:z-20 md:h-screen md:w-80 md:translate-y-0 md:border-t-0 md:border-l xl:w-1/4 xl:translate-x-0 xl:shadow-none"
      >
        <div class="flex h-full flex-col p-4 md:pt-24">
          <div class="flex items-center justify-between border-b py-2 font-semibold text-muted-foreground uppercase">
            <div class="flex items-center gap-1">
              <icon name="mdi:table-of-contents" size="25" class="text-primary" />
              <p class="font-semibold tracking-wide text-muted-foreground uppercase">
                On this page
              </p>
            </div>

            <button class="btn md:hidden!" aria-label="Close table of contents" @click="isOpen = false">
              <icon name="mdi:close" size="25" />
            </button>
          </div>

          <nav class="scroll-area flex-1 space-y-0.5 overflow-y-auto pr-2">
            <nuxt-link
              v-for="header in headers" :key="header.id"
              :to="`#${header.id}`" :class="headerClasses(header)"
              class="block transition-all hover:bg-muted/50 hover:text-primary" @click.prevent="scrollToHeader(header.id)"
            >
              <div class="navigation-group">
                <span v-if="header.method" :class="REST_METHOD_LABELS[header.method as keyof typeof REST_METHOD_LABELS]">{{ header.method }}</span>
                <span class="wrap-break-words leading-tight">{{ header.text }}</span>
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
const props = defineProps<{
  parseMethod?: boolean
}>()

const { headers, headerClasses, scrollToSection } = useContent({ selector: ".markdown", ...props })
const isOpen = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function scrollToHeader(id: string) {
  scrollToSection(id)
  isOpen.value = false
}
</script>

<style scoped>
:deep(.markdown) *,
#table-of-contents a span {
  font-family: "Roboto", sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

:deep(.markdown h1),
:deep(.markdown h2),
:deep(.markdown h3),
:deep(.markdown h4) {
  font-weight: 700;
  margin: 1rem 0 1rem 0;
}

:deep(.markdown h1) {
  font-size: clamp(1.875rem, 5vw, 2.25rem);
  line-height: 1.2;
}
:deep(.markdown h2) {
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  line-height: 1.25;
}
:deep(.markdown h3) {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  line-height: 1.5;
}
:deep(.markdown h4) {
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  line-height: 1.25;
}

:deep(.markdown) p,
:deep(.markdown) li {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}
:deep(.markdown) p a,
:deep(.markdown) li a {
  color: var(--primary);
  font-weight: 600;
}
:deep(.markdown) p a:hover,
:deep(.markdown) a:hover {
  border-bottom: 2px solid var(--muted);
  border-bottom-color: var(--primary);
}

:deep(.markdown) ul,
:deep(.markdown) ol {
  margin: 0.5rem 0 1.5rem 0;
  padding-left: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.75;
}
:deep(.markdown) ul {
  list-style-type: disc;
}
:deep(.markdown) ol {
  list-style-type: decimal;
}

:deep(.markdown) li {
  margin: 0.5rem 0;
}
:deep(.markdown) li::marker {
  color: var(--muted-foreground);
  font-weight: 600;
}
:deep(.markdown) li ul,
:deep(.markdown) li ol {
  margin-block: 0.25rem;
  padding-left: 1rem;
}

:deep(.markdown) blockquote {
  border-left: 4px solid var(--primary);
  background-color: var(--card);
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 0 0.375rem 0.375rem 0;
  font-style: italic;
  color: var(--foreground);
}
:deep(.markdown) blockquote p {
  margin: 0;
}
:deep(.markdown) blockquote code {
  font-size: 0.75rem;
}

:deep(.markdown) code {
  background-color: var(--card);
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  border-radius: 0.25rem;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--border);
}
:deep(.markdown) code * {
  font-family: var(--font-mono);
}

:deep(.markdown) pre {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  max-width: 100%;
  line-height: 1.5;
  white-space: pre-wrap;
}
:deep(.markdown) pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
}
</style>
