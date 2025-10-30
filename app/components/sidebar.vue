<template>
  <!-- Mobile toggle -->
  <button class="btn fixed top-4 right-4 z-50 md:hidden!" :aria-label="isMobileNavOpen ? 'Close menu' : 'Open menu'" @click="isMobileNavOpen = !isMobileNavOpen">
    <icon :name="isMobileNavOpen ? 'mdi:close' : 'mdi:menu'" size="30" :class="isMobileNavOpen ? 'text-muted-foreground' : ''" />
  </button>

  <!-- Mobile overlay -->
  <div v-if="isMobileNavOpen" class="fixed inset-0 z-20 bg-black/50" @click="isMobileNavOpen = false" />

  <transition name="slide">
    <aside v-if="user" class="fixed top-0 left-0 z-40 size-full px-4 py-16 transition-transform md:static md:w-56 md:translate-x-0 md:py-4" :class="isMobileNavOpen ? 'translate-x-0 bg-card' : '-translate-x-full'">
      <div class="flex h-full flex-col gap-12 px-12 md:px-0">
        <Logo />

        <div class="navigation-group w-full gap-4!">
          <div class="relative size-12 shrink-0">
            <img v-if="user.image" :src="user.image" alt="Avatar" class="size-full rounded-full border object-cover select-none">

            <button title="Edit Profile Information" class="btn-primary absolute -right-2 -bottom-2 p-1!" aria-label="Edit Profile Information" @click="isDialogOpen = true">
              <icon name="mdi:square-edit-outline" size="20" class="transition-all hover:scale-110" />
            </button>
          </div>

          <div class="flex w-full min-w-0 flex-col overflow-x-hidden">
            <span class="text-sm font-semibold wrap-break-word">
              {{ user.name }}
            </span>
            <nuxt-link :to="`/${user.slug}`" :title="`${BASE_URL}/${user.slug}`" class="text-muted-foreground text-sm wrap-break-word hover:underline">
              @{{ user.slug }}
            </nuxt-link>
          </div>
        </div>

        <nav class="flex flex-col gap-4" aria-label="Main Navigation">
          <p class="text-caption uppercase">
            My Account
          </p>

          <nuxt-link
            v-for="link in SIDEBAR_NAV_LINKS" :key="link.url"
            :to="link.url" class="hover:scale-sm flex w-full flex-row items-center justify-start gap-4 font-semibold transition-all"
            aria-label="Navigate to {{ link.label }}" @click="isMobileNavOpen = false"
          >
            <icon :name="link.icon" size="25" />
            <span>{{ link.label }}</span>
          </nuxt-link>
        </nav>

        <div class="border-t md:flex-1" />

        <nav class="flex flex-col gap-4" aria-label="Mobile Navigation Actions">
          <p class="text-caption uppercase">
            Actions
          </p>

          <button class="hover:scale-sm flex w-full flex-row items-center justify-start gap-4 font-semibold transition-all" aria-label="Toggle Theme" @click="toggleTheme">
            <icon :name="themeIcon" size="25" />
            <span>Toggle Theme</span>
          </button>
          <button class="hover:scale-sm flex w-full flex-row items-center justify-start gap-4 font-semibold transition-all" aria-label="Sign Out" @click="signOut">
            <icon name="material-symbols:logout" size="25" class="text-danger-foreground" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      <div class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 transition-all select-none md:hidden">
        <Logo />
      </div>
    </aside>
  </transition>

  <UserDialog :is-open="isDialogOpen" @close=" isDialogOpen = false" />
</template>

<script setup lang="ts">
const { toggleTheme, themeIcon } = useTheme()
const { clear } = useUserSession()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const isMobileNavOpen = ref(false)
const isDialogOpen = ref(false)

function signOut() {
  clear()
  navigateTo("/")
}
</script>

<style scoped>
@media (max-width: 767px) {
  .slide-enter-from {
    transform: translateX(-100%);
  }
  .slide-enter-to {
    transform: translateX(0);
  }
  .slide-enter-active {
    transition: transform 0.3s ease-out;
  }

  .slide-leave-from {
    transform: translateX(0);
  }
  .slide-leave-to {
    transform: translateX(-100%);
  }
  .slide-leave-active {
    transition: transform 0.3s ease-in;
  }

  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-enter-active {
    transition: opacity 0.3s ease-out;
  }

  .fade-leave-from {
    opacity: 1;
  }
  .fade-leave-to {
    opacity: 0;
  }
  .fade-leave-active {
    transition: opacity 0.3s ease-in;
  }
}
</style>
