<template>
  <div class="max-w-8xl fixed top-2 left-1/2 z-50 w-[95%] -translate-x-1/2">
    <div class="flex flex-row items-center justify-between">
      <div class="rounded-full p-2 backdrop-blur-xl">
        <Logo />
      </div>

      <nav class="navigation-group" aria-label="User Actions">
        <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
          <icon :name="themeIcon" size="20" />
        </button>

        <button v-if="loggedIn" class="btn" aria-label="Sign Out" @click="signOut">
          <icon name="ph:sign-out" size="20" />
          <span>Sign Out</span>
        </button>

        <nuxt-link v-if="!loggedIn" to="/sign-in" class="btn" aria-label="Sign In">
          <icon name="ph:sign-in" size="20" />
          <span>Sign In</span>
        </nuxt-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
const { loggedIn } = useUserSession()
</script>
