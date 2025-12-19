<template>
  <nav class="flex flex-row items-center justify-between p-4">
    <div class="flex flex-row items-center gap-8">
      <Logo />

      <div v-if="user" class="hidden md:navigation-group">
        <nuxt-link :to="`/${user?.slug}`" class="btn bg-muted! p-1! text-xs! text-muted-foreground!" title="Go to your profile page">
          <icon name="mdi:arrow-top-right" size="20" class="text-secondary" />
          <span class="truncate">{{ pageUrl }}</span>
        </nuxt-link>

        <div ref="dropdownRef" class="relative">
          <button class="btn flex items-center gap-2 whitespace-nowrap" title="See sharing options" aria-label="Share Profile" @click="isDropdownOpen = !isDropdownOpen">
            <icon name="mdi:share-variant" size="20" />
            <span>Share</span>
          </button>

          <transition name="dropdown-fade">
            <div v-if="isDropdownOpen" class="overlay absolute top-full right-4 flex flex-col gap-2" role="menu">
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 whitespace-nowrap hover:bg-muted" role="menuitem" @click="copyPageUrl()">
                <icon name="mdi:clipboard-multiple-outline" size="20" />
                <span>Copy Link</span>
              </button>

              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 whitespace-nowrap hover:bg-muted" role="menuitem" @click="handleShareTwitter()">
                <icon name="simple-icons:x" size="20" />
                <span>Share on X</span>
              </button>

              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 whitespace-nowrap hover:bg-muted" role="menuitem" @click="() => { isDialogOpen = true; isDropdownOpen = false }">
                <icon name="mdi:qrcode" size="20" />
                <span>Get QR Code</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <p v-if="shouldShowPreview" class="text-caption ml-auto hidden md:block">
      Live Preview
    </p>

    <QrCodeDialog :is-open="isDialogOpen" @close="isDialogOpen = false" />
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = storeToRefs(useUserStore())
const isDialogOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const copySuccess = ref<string | null>(null)
const shouldShowPreview = computed(() => route.path !== "/admin/analytics")

const pageUrl = computed(() => {
  if (!user.value) {
    return ""
  }

  return `${BASE_URL.replace(/^https?:\/\//, "")}/${user.value.slug}`
})

function handleClickOutside(e: MouseEvent) {
  if (!dropdownRef.value) {
    return
  }
  const clickedOutside = !dropdownRef.value.contains(e.target as Node)
  if (isDropdownOpen.value && clickedOutside) {
    isDropdownOpen.value = false
  }
}

async function copyPageUrl() {
  await navigator.clipboard.writeText(pageUrl.value)
  isDropdownOpen.value = false
  copySuccess.value = "Copied to clipboard!"
  setTimeout(() => (copySuccess.value = null), 2000)
}

function handleShareTwitter() {
  const tweet = `🚀 Check out my #Linkstashr profile! 🌟\n\n🔗 ${pageUrl.value}`
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`
  window.open(twitterUrl, "_blank")
  isDropdownOpen.value = false
}

watch(isDropdownOpen, (state) => {
  if (state) {
    document.addEventListener("click", handleClickOutside)
  }
  else { document.removeEventListener("click", handleClickOutside) }
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
