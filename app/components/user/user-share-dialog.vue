<template>
  <Dialog :is-open="isOpen" title="Share Profile" @update:is-open="emit('close')">
    <div class="flex flex-col items-center gap-4 p-2">
      <div ref="qrContainer" class="overflow-hidden rounded-2xl border" />

      <button class="text-caption navigation-group hover:underline" @click="copyPageUrl()">
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
            <icon name="mdi:dots-vertical" size="20" />
          </button>

          <transition name="dropdown-fade">
            <div
              v-if="isDropdownOpen" role="menu"
              class="overlay absolute right-0 z-50 flex flex-col gap-1" :class="[dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2']"
            >
              <button class="text-caption navigation-group w-full rounded-[5rem] p-2 hover:bg-muted" role="menuitem" @click="copyPageUrl()">
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
                <span>Share on X</span>
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

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits<(e: "close" | "update:isOpen") => void>()

const { user } = storeToRefs(useUserStore())
const dropdownRef = ref<HTMLElement | null>(null)
const qrContainer = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)
const dropdownPosition = ref<"top" | "bottom">("bottom")
const copySuccess = ref<string | null>(null)
const logoBase64 = ref<string>("")
const pageUrl = computed(() => `${BASE_URL}/${user?.value?.slug}`)

useClickOutside(dropdownRef, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
}, { escapeKey: true })

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value && dropdownRef.value) {
    nextTick(() => {
      const button = dropdownRef.value?.querySelector("button")
      if (!button) {
        return
      }

      const spaceBelow = window.innerHeight - button.getBoundingClientRect().bottom
      dropdownPosition.value = spaceBelow < 400 ? "top" : "bottom"
    })
  }
}

async function copyPageUrl() {
  await navigator.clipboard.writeText(pageUrl.value)
  isDropdownOpen.value = false
  copySuccess.value = "Copied to clipboard!"
  setTimeout(() => (copySuccess.value = null), 2000)
}

function downloadQRCode() {
  if (!qrContainer.value) {
    return
  }

  const svgElement = qrContainer.value.querySelector("svg")
  if (!svgElement) {
    return
  }

  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(svgBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${user.value?.slug}-qr-code.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  isDropdownOpen.value = false
  copySuccess.value = "QR code downloaded!"
  setTimeout(() => (copySuccess.value = null), 2000)
}

function shareToSocial(platform: "twitter" | "facebook" | "linkedin" | "whatsapp") {
  const url = pageUrl.value
  const shareUrls: Record<string, string> = {
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(`🚀 Check out my #Linkstashr profile! 🌟\n\n🔗 ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out my Linkstashr profile: ${url}`)}`,
  }

  const shareUrl = shareUrls[platform]
  window.open(shareUrl, "_blank")
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

  // Helper function to check if position is in center (for logo area)
  const isCenterArea = (row: number, col: number) => {
    const radius = (moduleCount * 0.2) / 2
    return Math.abs(row - (moduleCount / 2)) < radius && Math.abs(col - (moduleCount / 2)) < radius
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="200" 
    height="200" 
    viewBox="0 0 ${moduleCount + 2 * 2} ${moduleCount + 2 * 2}">`

  svg += `<rect width="100%" height="100%" fill="#ffffff"/>`

  // Draw QR code modules as circles instead of squares
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col) && !isCenterArea(row, col)) {
        const cx = col + 2 + 0.5
        const cy = row + 2 + 0.5
        const radius = 0.5
        svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#000000"/>`
      }
    }
  }

  // Add logo image using base64 data URL (no white background circle)
  const logoImgSize = (moduleCount * 0.2) * 0.85
  const logoImgPos = (moduleCount / 2 + 2) - (logoImgSize / 2)
  svg += `<image href="${logoBase64.value}" x="${logoImgPos}" y="${logoImgPos}" width="${logoImgSize}" height="${logoImgSize}"/>`
  svg += "</svg>"
  qrContainer.value.innerHTML = svg
})

// Convert logo to base64 on mount
onMounted(async () => {
  try {
    const response = await fetch(logoImage)
    const blob = await response.blob()
    const reader = new FileReader()
    reader.onloadend = () => {
      logoBase64.value = reader.result as string
    }
    reader.readAsDataURL(blob)
  }
  catch (error) {
    console.error("Failed to load logo:", error)
  }
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
