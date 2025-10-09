import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxtjs/color-mode", "@pinia/nuxt", "@vueuse/motion/nuxt", "nuxt-auth-utils"],
  imports: { dirs: ["lib/**"] },
  alias: {
    "#server": fileURLToPath(new URL("./server", import.meta.url)),
  },
  devtools: { enabled: true },
  vite: { plugins: [tailwindcss()] },
  css: ["~/assets/styles.css"],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "nuxt-color-mode",
  },
  fonts: {
    processCSSVariables: true,
    families: [
      { name: "Lato", provider: "google" },
      { name: "Caprasimo", provider: "google" },
      { name: "JetBrains Mono", provider: "google" },

      // Dynamic fonts for user preferences
      { name: "Roboto", provider: "google", global: true },
      { name: "Noto Sans", provider: "google", global: true },
      { name: "Montserrat", provider: "google", global: true },
      { name: "Playfair Display", provider: "google", global: true },
      { name: "Lora", provider: "google", global: true },
      { name: "Amarante", provider: "google", global: true },
      { name: "Righteous", provider: "google", global: true },
      { name: "Ribeye", provider: "google", global: true },
      { name: "Ribeye Marrow", provider: "google", global: true },
      { name: "Audiowide", provider: "google", global: true },
      { name: "Ubuntu Mono", provider: "google", global: true },
    ],
  },
  icon: {
    mode: "svg",
    clientBundle: { scan: true },
  },
})
