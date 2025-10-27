<template>
  <div class="section-container bg-muted! my-2 flex max-w-lg flex-row! justify-between shadow-lg">
    <header class="flex max-w-[80%] flex-col gap-2 whitespace-nowrap">
      <div class="flex flex-row items-center justify-between gap-4">
        <h4>
          Share your Page:
        </h4>
        <p class="text-success">
          {{ copySuccess || '' }}
        </p>
      </div>

      <nuxt-link :to="`/${user?.slug}`" :title="pageUrl" class="text-muted-foreground truncate text-sm hover:underline">
        @{{ user?.slug }}
      </nuxt-link>
    </header>

    <div ref="dropdownRef" class="navigation-group relative">
      <button title="See sharing options" class="btn" aria-label="Share Profile" @click="isDropdownOpen = !isDropdownOpen">
        <icon name="mdi:share-variant" size="20" />
        <span>Share Now</span>
      </button>

      <transition name="dropdown-fade">
        <div v-if="isDropdownOpen" class="popover absolute top-full right-0 z-20" role="menu">
          <div class="flex flex-col items-start gap-2 text-xs font-semibold">
            <button
              class="hover:bg-muted flex flex-row items-center gap-2 rounded-2xl p-2 whitespace-nowrap" role="menuitem"
              aria-label="Copy Profile Link" @click="copyPageUrl()"
            >
              <icon name="mdi:clipboard-multiple-outline" size="20" />
              <span>Copy Link</span>
            </button>

            <button
              class="hover:bg-muted flex flex-row items-center gap-2 rounded-2xl p-2 whitespace-nowrap" role="menuitem"
              aria-label="Share on X" @click="handleShareTwitter()"
            >
              <icon name="simple-icons:x" size="20" />
              <span>Share on X</span>
            </button>

            <button
              class="hover:bg-muted flex flex-row items-center gap-2 rounded-2xl p-2 whitespace-nowrap" role="menuitem"
              aria-label="Get QR Code" @click="() => { isDialogOpen = true; isDropdownOpen = false }"
            >
              <icon name="mdi:qrcode" size="20" />
              <span>Get QR Code</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <ProfileQrCodeDialog :is-open="isDialogOpen" :slug="user?.slug ?? ''" @close=" isDialogOpen = false" />
</template>

<script setup lang="ts">
const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const isDialogOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const copySuccess = ref<string | null>(null)
const pageUrl = `${BASE_URL}/${user.value?.slug}`

function handleClickOutside(e: MouseEvent) {
  const clickedOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(e.target as Node)
  const clickedInsideQrDialog = isDialogOpen.value
  if (isDropdownOpen.value && clickedOutsideDropdown && !clickedInsideQrDialog) {
    isDropdownOpen.value = false
  }
}

async function copyPageUrl() {
  await navigator.clipboard.writeText(pageUrl)
  isDropdownOpen.value = false
  copySuccess.value = "Copied to clipboard!"
  setTimeout(() => {
    copySuccess.value = null
  }, 2000)
}

function handleShareTwitter() {
  const tweet = `🚀 Check out my LinkNest profile! 🌟\n\n🔗 ${pageUrl}`
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`
  window.open(twitterUrl, "_blank")
  isDropdownOpen.value = false
}

watch(isDropdownOpen, (open) => {
  if (open) {
    document.addEventListener("click", handleClickOutside)
  }
  else {
    document.removeEventListener("click", handleClickOutside)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}
.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
