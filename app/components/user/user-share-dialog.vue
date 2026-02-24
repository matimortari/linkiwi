<template>
  <Dialog :is-open="isOpen" title="Share Profile" @update:is-open="emit('close')">
    <div class="flex flex-col items-center gap-2 p-4">
      <p class="text-caption">
        Scan the QR code below or share your profile link:
      </p>

      <div ref="qrContainer" class="overflow-hidden rounded-2xl border" />

      <button class="text-caption hover:underline" @click="handleCopy()">
        <span>@{{ user?.slug }}</span>
      </button>
    </div>

    <footer class="flex flex-row items-center justify-between">
      <p class="text-success">
        {{ copySuccess || '' }}
      </p>

      <div class="navigation-group">
        <div ref="dropdownRef" class="relative">
          <button class="btn" title="More sharing options" @click="toggleDropdown()">
            <span>More Options</span>
            <icon name="mdi:dots-vertical" size="20" />
          </button>

          <transition name="dropdown-fade">
            <div
              v-if="isDropdownOpen" role="menu"
              class="overlay absolute right-0 z-50 flex flex-col gap-1"
              :class="[dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2']"
            >
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="handleCopy()">
                <icon name="mdi:link-variant" size="20" />
                <span>Copy Link</span>
              </button>
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="downloadQRCode()">
                <icon name="mdi:download" size="20" />
                <span>Download QR Code</span>
              </button>

              <div class="h-px w-full bg-muted" />

              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="shareToSocial('twitter')">
                <icon name="simple-icons:x" size="20" />
                <span>Share on X/Twitter</span>
              </button>
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="shareToSocial('facebook')">
                <icon name="simple-icons:facebook" size="20" />
                <span>Share on Facebook</span>
              </button>
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="shareToSocial('linkedin')">
                <icon name="simple-icons:linkedin" size="20" />
                <span>Share on LinkedIn</span>
              </button>
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 whitespace-nowrap hover:bg-muted" role="menuitem" @click="shareToSocial('whatsapp')">
                <icon name="simple-icons:whatsapp" size="20" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </footer>
  </Dialog>
</template>

<script setup lang="ts">
import qrcode from "qrcode-generator"
import logoImage from "~/assets/symbol.png"

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{ "close": [], "update:isOpen": [] }>()

const { user } = storeToRefs(useUserStore())
const dropdownRef = ref<HTMLElement | null>(null)
const qrContainer = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)
const dropdownPosition = ref<"top" | "bottom">("bottom")
const copySuccess = ref<string | null>(null)
const logoBase64 = ref("")
const pageUrl = computed(() => `${BASE_URL}/${user.value?.slug}`)

useClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
}, { escapeKey: true })

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (!isDropdownOpen.value || !dropdownRef.value) {
    return
  }

  nextTick(() => {
    const button = dropdownRef.value?.querySelector("button")
    if (!button) {
      return
    }
    const spaceBelow = window.innerHeight - button.getBoundingClientRect().bottom
    dropdownPosition.value = spaceBelow < 400 ? "top" : "bottom"
  })
}

async function handleCopy() {
  await navigator.clipboard.writeText(pageUrl.value)
  isDropdownOpen.value = false
  copySuccess.value = "Copied to clipboard!"
}

function downloadQRCode() {
  const svg = qrContainer.value?.querySelector("svg")
  if (!svg) {
    return
  }

  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml;charset=utf-8" }))
  const link = Object.assign(document.createElement("a"), { href: url, download: `${user.value?.slug}-qr-code.svg` })
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  isDropdownOpen.value = false
  copySuccess.value = "QR code downloaded!"
}

function shareToSocial(platform: "twitter" | "facebook" | "linkedin" | "whatsapp") {
  const url = encodeURIComponent(pageUrl.value)

  const shareUrls = {
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(`🚀 Check out my #linkiosk profile! 🌟\n\n🔗 ${pageUrl.value}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out my LinKiosk profile: ${pageUrl.value}`)}`,
  }

  window.open(shareUrls[platform], "_blank")
  isDropdownOpen.value = false
}

watchEffect(() => {
  if (!qrContainer.value || !logoBase64.value) {
    return
  }

  const qr = qrcode(0, "H")
  qr.addData(pageUrl.value)
  qr.make()
  const moduleCount = qr.getModuleCount()
  const padding = 2
  const viewBoxSize = moduleCount + 2 * padding
  const radius = (moduleCount * 0.25) / 2

  const circles = Array.from({ length: moduleCount }, (_, row) =>
    Array.from({ length: moduleCount }, (_, col) => {
      if (!qr.isDark(row, col) || (Math.abs(row - moduleCount / 2) < radius && Math.abs(col - moduleCount / 2) < radius)) {
        return ""
      }

      return `<circle cx="${col + padding + 0.5}" cy="${row + padding + 0.5}" r="0.5" fill="#000000"/>`
    }).join("")).join("")

  const logoSize = moduleCount * 0.2 * 0.85
  const logoPos = moduleCount / 2 + padding - logoSize / 2
  qrContainer.value.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"><rect width="100%" height="100%" fill="#ffffff"/>${circles}<image href="${logoBase64.value}" x="${logoPos}" y="${logoPos}" width="${logoSize}" height="${logoSize}"/></svg>`
})

onMounted(async () => {
  const blob = await fetch(logoImage).then(r => r.blob())
  const reader = new FileReader()
  reader.onloadend = () => logoBase64.value = reader.result as string
  reader.readAsDataURL(blob)
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
