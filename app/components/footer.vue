<template>
  <footer class="bg-card w-full">
    <div class="container mx-auto flex flex-col-reverse px-8 py-4 md:flex-row md:justify-between">
      <div class="flex flex-col justify-end gap-2 border-t py-8 md:border-0">
        <img :src="themeTitle" alt="Wordmark" width="100">

        <div class="flex flex-row items-center justify-between gap-4">
          <p class="text-muted-foreground text-sm whitespace-nowrap">
            © {{ new Date().getFullYear() }} LinkNest. All rights reserved.
          </p>

          <nuxt-link to="https://github.com/matimortari/linknest" target="_blank" aria-label="GitHub Repository">
            <icon name="simple-icons:github" size="25" class="text-muted-foreground hover:scale-md hover:text-accent transition-all" />
          </nuxt-link>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8 py-8">
        <div v-for="(section, index) in footerSections" :key="index">
          <p class="mb-4 font-semibold">
            {{ section.title }}
          </p>

          <ul class="text-muted-foreground space-y-2 text-sm">
            <li v-for="(link, linkIndex) in section.links" :key="linkIndex">
              <button v-if="link.action" class="hover:text-foreground w-full text-left transition-colors" @click="link.action">
                {{ link.label }}
              </button>
              <nuxt-link v-else :to="link.href" class="hover:text-foreground transition-colors">
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
const { clear, loggedIn } = useUserSession()

const footerSections = [
  {
    title: "Product",
    links: [
      ...(!loggedIn.value
        ? [
            { label: "Home", href: "/" },
            { label: "Features", href: "/#features" },
            { label: "API", href: "/api-spec" },
            { label: "Sign in", href: "/sign-in" },
          ]
        : [
            { label: "Profile", href: "/admin/profile" },
            { label: "Preferences", href: "/admin/preferences" },
            { label: "Analytics", href: "/admin/analytics" },
            { label: "API", href: "/api-spec" },
            { label: "Sign out", action: signOut },
          ]
      ),
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Brand & Assets", href: "/brand" },
    ],
  },
]

function signOut() {
  clear()
  navigateTo("/")
}
</script>
