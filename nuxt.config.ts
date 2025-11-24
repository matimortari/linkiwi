import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vueuse/motion/nuxt",
    "nuxt-auth-utils",
  ],
  imports: {
    dirs: ["lib/**"],
  },
  alias: {
    "#server": fileURLToPath(new URL("./server", import.meta.url)),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/styles.css"],
  devtools: {
    enabled: true,
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "nuxt-color-mode",
  },
  content: {
    _localDatabase: {
      type: "sqlite",
      filename: ".nuxt/content/local.db",
    },
  },
  fonts: {
    processCSSVariables: true,
    families: [
      // Base fonts (default, display, mono)
      { name: "Poppins", provider: "google", weights: ["300 800"] },
      { name: "Spicy Rice", provider: "google", weights: ["400"] },
      { name: "JetBrains Mono", provider: "google", weights: ["400"] },

      // Dynamic fonts for user preferences
      { name: "Roboto", provider: "google", global: true, weights: ["300 800"] },
      { name: "Noto Sans", provider: "google", global: true, weights: ["300 800"] },
      { name: "Montserrat", provider: "google", global: true, weights: ["300 800"] },
      { name: "Playfair Display", provider: "google", global: true, weights: ["400 800"] },
      { name: "Lora", provider: "google", global: true, weights: ["400 700"] },
      { name: "Amarante", provider: "google", global: true, weights: ["400"] },
      { name: "Righteous", provider: "google", global: true, weights: ["400"] },
      { name: "Ribeye", provider: "google", global: true, weights: ["400"] },
      { name: "Ribeye Marrow", provider: "google", global: true, weights: ["400"] },
      { name: "Audiowide", provider: "google", global: true, weights: ["400"] },
      { name: "Ubuntu Mono", provider: "google", global: true, weights: ["400"] },
    ],
  },
  icon: {
    mode: "svg",
    clientBundle: {
      scan: true,
    },
  },
})
