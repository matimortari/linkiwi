import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxt/fonts", "@nuxt/icon", "@nuxtjs/color-mode", "@nuxtjs/seo", "@pinia/nuxt", "@vueuse/motion/nuxt", "nuxt-auth-utils"],
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_BASE_URL,
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      password: process.env.NUXT_SESSION_PASSWORD!,
      cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" },
    },
  },
  routeRules: {
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
  },
  devServer: { host: "0.0.0.0" },
  vite: {
    server: process.env.NUXT_PUBLIC_BASE_URL
      ? {
          allowedHosts: [new URL(process.env.NUXT_PUBLIC_BASE_URL).hostname],
          hmr: { protocol: "wss", host: new URL(process.env.NUXT_PUBLIC_BASE_URL).hostname, port: Number(new URL(process.env.NUXT_PUBLIC_BASE_URL).port) || 3000 },
        }
      : {},
    plugins: [tailwindcss() as any],
  },
  app: {
    head: {
      script: process.env.NODE_ENV === "production" ? [{ "src": "https://static.cloudflareinsights.com/beacon.min.js", "defer": true, "data-cf-beacon": `{"token": "${process.env.NUXT_CF_BEACON_TOKEN}"}` }] : [],
    },
  },
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
      { name: "Poppins", provider: "google", weights: ["300 800"] },
      { name: "Suez One", provider: "google", weights: ["400"] },
      { name: "JetBrains Mono", provider: "google", weights: ["400"] },
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
  icon: { mode: "svg", clientBundle: { scan: true } },
  ogImage: { enabled: false },
  robots: { disallow: ["/admin"] },
  site: { url: process.env.NUXT_PUBLIC_BASE_URL, name: "LinKiosk" },
})
