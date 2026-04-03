<template>
  <div class="fixed inset-x-0 top-0 z-40 border-b bg-card/95 backdrop-blur-xl">
    <div class="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 md:px-4">
      <nav class="navigation-group gap-2!" aria-label="Content Navigation">
        <Logo />
      </nav>

      <nav class="navigation-group" aria-label="Content Actions">
        <button class="btn-ghost md:hidden!" :aria-label="isTocOpen ? 'Close table of contents' : 'Open table of contents'" @click="emit('toggleToc')">
          <icon :name="isTocOpen ? 'mdi:close' : 'mdi:menu'" size="20" />
        </button>
        <button class="btn-ghost" aria-label="Toggle Theme" @click="toggleTheme">
          <icon :name="themeIcon" size="20" />
        </button>
        <nuxt-link v-if="!loggedIn" to="/sign-in" class="btn-ghost" aria-label="Sign In">
          <icon name="mdi:account" size="20" />
        </nuxt-link>
        <button v-else class="btn-ghost" aria-label="Sign Out" @click="signOut">
          <icon name="mdi:logout" size="20" />
        </button>

        <nuxt-link to="https://github.com/matimortari/linkiosk" target="_blank" aria-label="GitHub Repository" class="btn-ghost">
          <icon name="simple-icons:github" size="20" />
        </nuxt-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isTocOpen: boolean
}>()

const emit = defineEmits<{ toggleToc: [] }>()

const { toggleTheme, themeIcon } = useTheme()
const { loggedIn } = useUserSession()
</script>
