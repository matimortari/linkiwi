<template>
  <div class="max-w-8xl fixed top-2 left-1/2 z-40 w-[95%] -translate-x-1/2">
    <div
      v-motion :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0 }" :duration="1000"
      class="flex flex-row items-center justify-between"
    >
      <div class="rounded-full p-2">
        <Logo />
      </div>

      <nav class="navigation-group" aria-label="User Actions">
        <button type="button" class="btn" aria-label="Toggle Theme" @click="toggleTheme">
          <icon :name="themeIcon" size="20" />
        </button>
        <button v-if="loggedIn" type="button" class="btn" @click="signOut">
          <icon name="mdi:logout" size="20" />
          <span class="hidden md:inline">Sign Out</span>
        </button>
        <nuxt-link v-else to="/sign-in" class="btn">
          <icon name="mdi:login" size="20" />
          <span class="hidden md:inline">Sign In</span>
        </nuxt-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
const { loggedIn } = useUserSession()
const { signOut } = useSession()
</script>
