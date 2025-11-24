<template>
  <div class="fixed top-0 left-0 z-50 navigation-group w-full justify-between border-b-2 bg-card p-2">
    <Logo />

    <nav class="navigation-group" aria-label="User Actions">
      <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
        <icon :name="themeIcon" size="20" />
      </button>

      <nuxt-link v-if="!loggedIn" to="/sign-in" class="btn" aria-label="Sign In">
        <icon name="mdi:sign-in" size="20" />
      </nuxt-link>

      <button v-if="loggedIn" class="btn" aria-label="Sign Out" @click="signOut">
        <icon name="mdi:sign-out" size="20" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
const { clear, loggedIn } = useUserSession()

async function signOut() {
  await clear()
  return navigateTo("/")
}
</script>
