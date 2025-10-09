<template>
  <nav class="flex w-full items-center justify-between border-b px-4 py-2 md:px-8">
    <nuxt-link to="/" class="flex flex-row items-center gap-2">
      <img src="/assets/logo.png" alt="Logo" width="30">
      <img :src="themeTitle" alt="Wordmark" width="100">
    </nuxt-link>
    <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
      <icon :name="themeIcon" size="25" />
    </button>
  </nav>

  <div class="container mx-auto max-w-7xl p-4 md:p-8">
    <div class="flex flex-col items-center gap-2 border-b p-4 md:items-start">
      <h2>
        Branding Assets
      </h2>
      <p class="text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
      <div v-for="logo in logos" :key="logo.name" class="card flex flex-col items-center">
        <div class="my-4 flex h-16 w-36 items-center justify-center">
          <img :src="logo.image" :alt="logo.name" class="size-full object-contain">
        </div>

        <div class="flex w-full flex-row items-center justify-between">
          <span class="text-sm font-semibold">{{ logo.name }}</span>
          <nuxt-link :href="logo.image" download>
            <icon name="mdi:download" size="35" class="hover:bg-muted hover:scale-md rounded-full p-1 transition-all" />
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-col items-center gap-8 p-4">
      <h3>
        Brand Colors
      </h3>

      <div class="my-4 grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <div v-for="color in brandColors" :key="color.name" class="flex flex-col items-center p-2">
          <div class="h-20 w-full rounded-t-lg border-2" :class="color.class" />
          <div class="flex w-full flex-col items-center p-2 text-center">
            <span class="text-sm font-semibold">{{ color.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImage from "~/assets/logo.png"
import logoDark from "~/assets/wordmark-dark.png"
import logoLight from "~/assets/wordmark-light.png"

const { toggleTheme, themeIcon, themeTitle } = useTheme()

const logos = [
  { name: "Logo", image: logoImage },
  { name: "Wordmark (light)", image: logoLight },
  { name: "Wordmark (dark)", image: logoDark },
]

const brandColors = [
  { name: "Background", class: "bg-[var(--background)]" },
  { name: "Foreground", class: "bg-[var(--foreground)]" },
  { name: "Card", class: "bg-[var(--card)]" },
  { name: "Card Foreground", class: "bg-[var(--card-foreground)]" },
  { name: "Popover", class: "bg-[var(--popover)]" },
  { name: "Popover Foreground", class: "bg-[var(--popover-foreground)]" },
  { name: "Primary", class: "bg-[var(--primary)]" },
  { name: "Primary Foreground", class: "bg-[var(--primary-foreground)]" },
  { name: "Secondary", class: "bg-[var(--secondary)]" },
  { name: "Secondary Foreground", class: "bg-[var(--secondary-foreground)]" },
  { name: "Muted", class: "bg-[var(--muted)]" },
  { name: "Muted Foreground", class: "bg-[var(--muted-foreground)]" },
  { name: "Danger", class: "bg-[var(--danger)]" },
  { name: "Danger Foreground", class: "bg-[var(--danger-foreground)]" },
  { name: "Success", class: "bg-[var(--success)]" },
  { name: "Success Foreground", class: "bg-[var(--success-foreground)]" },
  { name: "Accent", class: "bg-[var(--accent)]" },
  { name: "Border", class: "bg-[var(--border)]" },
]

useHead({
  title: "Brand Assets",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/branding" }],
  meta: [{ name: "description", content: "LinkNest Brand Assets." }],
})
</script>
