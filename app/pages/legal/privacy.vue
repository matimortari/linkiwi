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
          <li v-for="header in headers" :key="header.id" :class="headerClasses(header)">
            <a :href="`#${header.id}`" class="flex items-center justify-end gap-2 text-sm">
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
const { headers, headerClasses } = useContent({ selector: ".markdown", parseMethod: true })

useHead({
  title: "Privacy Policy",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/legal/privacy" }],
  meta: [{ name: "description", content: "LinkNest Privacy Policy." }],
})

definePageMeta({
  layout: "fullscreen",
})
</script>
