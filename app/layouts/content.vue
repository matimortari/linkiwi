<template>
  <ContentMasthead :is-toc-open="isTocOpen" @toggle-toc="isTocOpen = !isTocOpen" />

  <div class="content-shell flex min-h-screen overflow-x-hidden border-b">
    <div v-if="isTocOpen" aria-hidden="true" class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm xl:hidden" @click="isTocOpen = false" />

    <div class="flex flex-1 flex-col xl:flex-row">
      <button class="btn fixed bottom-6 left-6 z-30" aria-label="Scroll to top" @click="scrollToTop">
        <icon name="mdi:arrow-up" size="25" />
      </button>

      <article
        v-motion :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0 }" :duration="600"
        class="prose"
      >
        <slot />
      </article>

      <ContentTableOfContents
        :headers="headers" :is-open="isTocOpen"
        :header-classes="headerClasses" @select="scrollToHeader"
        @close="isTocOpen = false"
      />
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
const props = defineProps<{
  parseMethod?: boolean
}>()

const { headers, headerClasses, scrollToSection } = useContent({ selector: ".prose", parseMethod: props.parseMethod })
const isTocOpen = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function scrollToHeader(id: string) {
  scrollToSection(id)
  isTocOpen.value = false
}
</script>

<style scoped>
.prose {
  margin-top: 4.5rem;
  margin-bottom: 3rem;
  max-width: min(980px, 100%);
  border: 1px solid color-mix(in srgb, var(--muted) 65%, transparent);
  border-radius: 1.25rem;
  background-color: color-mix(in srgb, var(--background) 90%, transparent);
  box-shadow: 0 20px 50px -36px rgba(0, 0, 0, 0.85);
  padding: clamp(1.2rem, 2vw, 2rem);
  padding-inline: 1rem;
  padding-bottom: 2.5rem;
  margin-inline: auto;
}

.prose :deep(> :first-child) {
  margin-top: 0;
}

:deep(.prose) *,
#table-of-contents a span {
  font-family: "Roboto", sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 1.2rem 0 0.9rem 0;
}

:deep(.prose h1) {
  font-size: clamp(1.875rem, 5vw, 2.25rem);
  line-height: 1.2;
}
:deep(.prose h2) {
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  line-height: 1.25;
}
:deep(.prose h3) {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  line-height: 1.5;
}
:deep(.prose h4) {
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  line-height: 1.25;
}

:deep(.prose) p,
:deep(.prose) li {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.75;
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

:deep(.prose) li {
  margin: 0.5rem 0;
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
  background-color: color-mix(in srgb, var(--card) 80%, transparent);
  margin: 1.2rem 0;
  padding: 0.9rem;
  border-radius: 0 0.75rem 0.75rem 0;
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
  background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  border-radius: 0.35rem;
  padding: 0.18rem 0.42rem;
  border: 1px solid var(--muted);
}
:deep(.prose) code * {
  font-family: var(--font-mono);
}

:deep(.prose) pre {
  background-color: color-mix(in srgb, var(--card) 80%, transparent);
  border: 1px solid var(--muted);
  border-radius: 0.9rem;
  padding: 1rem;
  margin: 1.1rem 0;
  overflow-x: auto;
  max-width: 100%;
  line-height: 1.6;
  white-space: pre;
}
:deep(.prose) pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
}

.content-shell {
  position: relative;
  background:
    radial-gradient(700px circle at 10% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%),
    radial-gradient(550px circle at 90% 10%, color-mix(in srgb, var(--secondary) 15%, transparent), transparent 65%),
    var(--background);
}

@media (min-width: 768px) {
  .prose {
    padding-inline: 1.5rem;
    padding-bottom: 3.5rem;
    margin-top: 5.3rem;
  }
}

@media (min-width: 1280px) {
  .prose {
    margin-inline: 1.5rem;
    max-width: calc(100vw - 20rem - 3rem);
  }
}
</style>
