<template>
  <nav v-if="headers.length" aria-label="Table of contents" class="flex h-full flex-col">
    <div class="flex shrink-0 items-center gap-1 pb-2">
      <icon name="mdi:table-of-contents" size="20" class="text-primary" />
      <p class="text-caption tracking-wide uppercase">
        On this page
      </p>
    </div>

    <ul class="scroll-area flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <li v-for="header in headers" :key="header.id">
        <nuxt-link
          :to="`#${header.id}`" class="navigation-group text-start transition-colors"
          :class="[headerClasses(header), activeId === header.id ? '-ml-0.5 border-l-2 border-primary pl-2 text-primary' : 'text-muted-foreground hover:text-foreground']"
        >
          <span v-if="header.method" :class="REST_METHOD_LABELS[header.method]">{{ header.method }}</span>
          <span>{{ header.text }}</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  headers: TocHeader[]
  isOpen: boolean
  headerClasses: (header: TocHeader) => string
}>()

const activeId = ref<string | null>(null)
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }
  if (!props.headers || props.headers.length === 0) {
    return
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    }
  }, { rootMargin: "0px 0px -80% 0px", threshold: 0 })

  for (const header of props.headers) {
    const el = document.getElementById(header.id)
    if (el) {
      observer.observe(el)
    }
  }
}

watch(() => props.headers, setupObserver, { immediate: true, deep: true })

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
