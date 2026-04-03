<template>
  <aside
    id="table-of-contents" :class="isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'"
    class="fixed inset-x-0 bottom-0 z-40 flex h-[80vh] w-full flex-col border-t shadow-xl transition-transform md:inset-y-0 md:right-0 md:left-auto md:z-20 md:h-screen md:w-80 md:translate-y-0 md:border-t-0 xl:w-1/4 xl:translate-x-0"
  >
    <div class="flex h-full flex-col p-4 md:pt-24">
      <div class="flex items-center gap-1 border-b py-2 font-semibold text-muted-foreground uppercase">
        <icon name="mdi:table-of-contents" size="20" class="text-primary" />
        <p class="font-semibold tracking-wide text-muted-foreground uppercase">
          On this page
        </p>
      </div>

      <nav class="scroll-area flex-1 space-y-0.5 overflow-y-auto pr-2">
        <nuxt-link
          v-for="header in headers" :key="header.id"
          :to="`#${header.id}`" :class="headerClasses(header)"
          class="block transition-all hover:bg-muted/50 hover:text-primary" @click.prevent="emit('select', header.id)"
        >
          <div class="navigation-group">
            <span v-if="header.method" :class="REST_METHOD_LABELS[header.method as keyof typeof REST_METHOD_LABELS]">{{ header.method }}</span>
            <span class="wrap-break-words leading-tight">{{ header.text }}</span>
          </div>
        </nuxt-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  headers: TocHeader[]
  isOpen: boolean
  headerClasses: (header: TocHeader) => string
}>()

const emit = defineEmits<{
  select: [id: string]
  close: []
}>()
</script>
