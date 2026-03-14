<template>
  <!-- Mobile toggle -->
  <button class="btn fixed top-4 right-4 z-40 md:hidden!" :aria-label="isOpen ? 'Close menu' : 'Open menu'" @click="emit('update:isOpen', !isOpen)">
    <icon :name="isOpen ? 'mdi:close' : 'mdi:menu'" size="25" :class="isOpen ? 'text-muted-foreground' : ''" />
  </button>

  <!-- Mobile overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-20 bg-black/50 md:hidden" @click="emit('update:isOpen', false)" />

  <aside
    class="fixed top-0 left-0 z-30 size-full bg-card px-4 py-8 transition-transform ease-in-out md:static md:block md:w-56 md:translate-x-0 md:bg-transparent 2xl:w-64 2xl:py-12"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']"
  >
    <div class="flex h-full flex-col gap-8 px-12 md:px-0">
      <div class="navigation-group w-full gap-4!">
        <div v-if="user" class="flex w-full items-center gap-4">
          <div class="relative size-12 shrink-0">
            <img :src="user.image" alt="Avatar" class="size-full rounded-full border object-cover select-none">
            <button class="btn-primary absolute -right-2 -bottom-2 p-1!" aria-label="Edit Profile Information" @click="isUserDialogOpen = true">
              <icon name="mdi:square-edit-outline" size="20" />
            </button>
          </div>

          <div class="flex w-full min-w-0 flex-col overflow-hidden">
            <span class="text-sm font-semibold wrap-break-word">{{ user.name }}</span>
            <nuxt-link :to="`/${user.slug}`" class="text-caption truncate hover:underline">
              @{{ user.slug }}
            </nuxt-link>
          </div>
        </div>

        <div v-else class="flex w-full items-center gap-4">
          <div class="size-12 shrink-0 animate-pulse rounded-full bg-muted" />
          <div class="flex w-full flex-col gap-2">
            <div class="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div class="h-3 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>

      <nav class="flex flex-col gap-2" aria-label="Main Navigation">
        <p class="text-caption uppercase">
          My Account
        </p>

        <nuxt-link
          v-for="link in SIDEBAR_NAV_LINKS" :key="link.url"
          :to="link.url" class="btn-ghost justify-start! text-base!"
          :class="{ 'bg-muted': route.path === link.url }" @click="emit('update:isOpen', false)"
        >
          <icon :name="link.icon" size="25" />
          <span>{{ link.label }}</span>
        </nuxt-link>
      </nav>

      <div class="border-t md:flex-1" />

      <nav class="flex flex-col gap-2" aria-label="Mobile Navigation Actions">
        <p class="text-caption uppercase">
          Actions
        </p>

        <button class="btn-ghost justify-start! text-base!" @click="isShareDialogOpen = true">
          <icon name="mdi:share-variant-outline" size="25" />
          <span>Share</span>
        </button>
        <button class="btn-ghost justify-start! text-base!" @click="toggleTheme">
          <icon :name="themeIcon" size="25" />
          <span>Toggle Theme</span>
        </button>
        <button class="btn-ghost justify-start! text-base!" @click="signOut">
          <icon name="mdi:logout" size="25" class="text-caption-danger" />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 select-none md:hidden">
      <Logo />
    </div>
  </aside>

  <UserDialog :is-open="isUserDialogOpen" @close=" isUserDialogOpen = false" />
  <UserShareDialog :is-open="isShareDialogOpen" @close="isShareDialogOpen = false" />
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{ "update:isOpen": [value: boolean] }>()

const { toggleTheme, themeIcon } = useTheme()
const route = useRoute()
const { user } = storeToRefs(useUserStore())
const isUserDialogOpen = ref(false)
const isShareDialogOpen = ref(false)
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
