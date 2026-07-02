<template>
  <!-- Mobile toggle -->
  <button class="btn fixed top-4 right-4 z-40 md:hidden!" :aria-label="isOpen ? 'Close menu' : 'Open menu'" @click="isOpen ? closeSidebar() : openSidebar()">
    <icon :name="isOpen ? 'mdi:close' : 'mdi:menu'" size="25" :class="isOpen ? 'text-muted-foreground' : ''" />
  </button>

  <!-- Mobile overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-20 bg-black/70 md:hidden" @click="closeSidebar()" />

  <aside
    class="fixed top-0 left-0 z-30 size-full bg-card px-4 py-8 transition-transform ease-in-out md:static md:block md:w-56 md:translate-x-0 md:bg-transparent 2xl:w-64 2xl:py-12"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']"
  >
    <div class="flex h-full flex-col gap-8 px-12 md:px-0">
      <div class="navigation-group w-full gap-4!">
        <div v-if="user" class="flex w-full items-center gap-4">
          <div ref="avatarDropdownRef" class="relative size-12 shrink-0">
            <img :src="user.image" alt="Avatar" class="size-full cursor-pointer rounded-full border object-cover select-none" @click="dropdownOpen = !dropdownOpen">
            <button class="btn-primary absolute -right-2 -bottom-2 p-1!" aria-label="Profile options" @click.stop="dropdownOpen = !dropdownOpen">
              <icon name="mdi:chevron-down" size="15" />
            </button>

            <div v-if="dropdownOpen" class="absolute top-14 left-0 z-50 flex min-w-40 flex-col gap-1 rounded-xl border bg-card p-1 shadow-lg">
              <label class="text-caption navigation-group cursor-pointer rounded-lg p-2 whitespace-nowrap hover:bg-muted">
                <icon name="mdi:camera" size="15" />
                <span>Change Picture</span>
                <input type="file" accept="image/*" class="hidden" @change="handleUpdateImage">
              </label>
              <button class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap text-danger-foreground hover:bg-muted" @click="signOut">
                <icon name="mdi:logout" size="15" />
                <span>Sign Out</span>
              </button>
              <button class="text-caption navigation-group rounded-lg p-2 whitespace-nowrap text-danger-foreground hover:bg-danger/20" @click="handleDeleteUser">
                <icon name="mdi:user-remove" size="15" class="text-caption-danger" />
                <span>Delete Account</span>
              </button>
            </div>
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
        <nuxt-link
          v-for="link in SIDEBAR_NAV_LINKS" :key="link.url"
          :to="link.url" class="text-caption navigation-group justify-start rounded-lg rounded-l-none p-2 transition-all hover:bg-muted/30"
          :class="{ 'border-l-2 border-l-secondary!': route.path === link.url }"
        >
          <icon :name="link.icon" :class="{ 'text-secondary!': route.path === link.url }" size="25" @click="closeSidebar()" />
          <span>{{ link.label }}</span>
        </nuxt-link>
      </nav>

      <div class="border-t md:flex-1" />

      <nav class="flex flex-col gap-2" aria-label="Mobile Navigation Actions">
        <button class="text-caption navigation-group justify-start rounded-lg rounded-l-none p-2 transition-all hover:bg-muted/30" @click="openDialog('share')">
          <icon name="mdi:share-variant-outline" size="25" />
          <span>Share</span>
        </button>
        <button class="text-caption navigation-group justify-start rounded-lg rounded-l-none p-2 transition-all hover:bg-muted/30" @click="toggleTheme">
          <icon :name="themeIcon" size="25" />
          <span>Toggle Theme</span>
        </button>
      </nav>
    </div>

    <div class="absolute bottom-16 left-1/2 -translate-x-1/2 select-none md:hidden">
      <Logo />
    </div>
  </aside>

  <UserShareDialog :is-open="isShareDialogOpen" @close="closeDialog('share')" />
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const route = useRoute()
const { toggleTheme, themeIcon } = useTheme()
const { isShareDialogOpen, openDialog, closeDialog, closeSidebar, openSidebar } = useUIState()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { clear } = useUserSession()
const dropdownOpen = ref(false)
const avatarDropdownRef = ref<HTMLElement | null>(null)

useClickOutside(avatarDropdownRef, () => {
  dropdownOpen.value = false
}, { escapeKey: true })

async function handleUpdateImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }

  dropdownOpen.value = false
  const res = await userStore.updateUserImage(file)
  if (res?.imageUrl && user.value) {
    user.value.image = res.imageUrl
  }
}

async function handleDeleteUser() {
  dropdownOpen.value = false
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  await userStore.deleteUser()
  await clear()
  await navigateTo("/", { replace: true })
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
