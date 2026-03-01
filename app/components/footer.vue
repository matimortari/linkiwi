<template>
  <footer class="relative z-50 w-full border-t bg-card">
    <div class="container mx-auto flex flex-col-reverse p-8 md:flex-row md:justify-between">
      <div class="flex flex-col justify-end gap-2 border-t py-4 md:border-0">
        <ClientOnly>
          <img :src="themeTitle" alt="Wordmark" width="100">
        </ClientOnly>

        <div class="flex flex-row items-center justify-between gap-4">
          <p class="text-caption whitespace-nowrap">
            © {{ new Date().getFullYear() }} LinKiosk. All rights reserved.
          </p>

          <nuxt-link to="https://github.com/matimortari/linkiosk" target="_blank" aria-label="GitHub Repository">
            <icon name="simple-icons:github" size="25" class="transition-transform hover:scale-110 hover:text-primary" />
          </nuxt-link>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8 py-4">
        <div v-for="(section, index) in FOOTER_SECTIONS" :key="index">
          <p class="mb-4 font-semibold">
            {{ section.title }}
          </p>

          <ul class="space-y-2 text-sm text-muted-foreground">
            <li v-for="(link, linkIndex) in section.links" :key="linkIndex">
              <button v-if="link.action" class="w-full text-left whitespace-nowrap transition-colors hover:text-foreground" @click="link.action">
                {{ link.label }}
              </button>
              <nuxt-link v-else :to="link.href" class="w-full text-left whitespace-nowrap transition-colors hover:text-foreground">
                {{ link.label }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { themeTitle } = useTheme()
const { loggedIn } = useUserSession()

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [...(!loggedIn.value
      ? [
          { label: "Home", href: "/" },
          { label: "Features", href: "/#features" },
          { label: "Sign in", href: "/sign-in" },
        ]
      : [
          { label: "Profile", href: "/admin/profile" },
          { label: "Preferences", href: "/admin/preferences" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "Sign out", action: signOut },
        ]
    )],
  },
  {
    title: "Resources",
    links: [
      { label: "API Reference", href: "/api-spec" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Brand", href: "/brand" },
    ],
  },
]
</script>
