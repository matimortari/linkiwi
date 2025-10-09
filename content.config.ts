import { defineCollection, defineContentConfig } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        cwd: "./app/assets/doc",
        include: "**",
      },
    }),
  },
})
