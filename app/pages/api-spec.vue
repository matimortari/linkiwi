<template>
  <div class="flex-1 px-4 py-12">
    <article
      v-if="pageContent" v-motion
      :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
      :duration="600" class="markdown w-full p-4 md:px-8"
    >
      <ContentRenderer :value="pageContent" />
    </article>

    <aside id="table-of-contents" class="bg-card scroll-area sticky top-20 hidden h-[calc(100vh-6rem)] shrink-0 overflow-auto rounded-xl p-4! md:block">
      <nav class="space-y-2">
        <h4 class="text-end">
          On This Page
        </h4>

        <ul class="space-y-1 border-t py-2">
          <li v-for="header in headers" :key="header.id">
            <a :href="`#${header.id}`" :class="`${headerClasses(header)} flex items-center justify-end gap-2`">
              {{ header.text }}
              <span v-if="header.method" :class="`px-1.5 py-0.5 rounded-full text-xs border font-semibold ${REST_METHOD_COLORS[header.method as keyof typeof REST_METHOD_COLORS]}`">
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
const pageContent = await queryCollection("content").path("/api-spec").first()
const { headers, headerClasses } = useContent({ selector: ".markdown", parseMethod: true })

useHead({
  title: "API Specification",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/api-spec" }],
  meta: [{ name: "description", content: "LinkNest API Specification." }],
})

definePageMeta({
  layout: "fullscreen",
})
</script>
