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

async function handleCopy() {
  await navigator.clipboard.writeText(pageUrl.value)
  isDropdownOpen.value = false
  copySuccess.value = "Copied to clipboard!"
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
  link.remove()
  URL.revokeObjectURL(url)
  isDropdownOpen.value = false
  copySuccess.value = "QR code downloaded!"
}

function shareToSocial(platform: "twitter" | "facebook" | "linkedin" | "whatsapp") {
  const url = pageUrl.value
  const shareUrls: Record<string, string> = {
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(`🚀 Check out my #AllLinks profile! 🌟\n\n🔗 ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out my AllLinks profile: ${url}`)}`,
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

  const isCenterArea = (row: number, col: number) => {
    const radius = (moduleCount * 0.25) / 2
    return Math.abs(row - (moduleCount / 2)) < radius && Math.abs(col - (moduleCount / 2)) < radius
  }

  const padding = 2
  const viewBoxSize = moduleCount + 2 * padding
  const svgParts: string[] = [
    "<svg xmlns=\"http://www.w3.org/2000/svg\" ",
    "width=\"200\" ",
    "height=\"200\" ",
    `viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">`,
    "<rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/>",
  ]

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col) && !isCenterArea(row, col)) {
        const cx = col + padding + 0.5
        const cy = row + padding + 0.5
        const radius = 0.5
        svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#000000"/>`)
      }
    }
  }

  // Add logo image using base64 data URL
  const logoImgSize = (moduleCount * 0.2) * 0.85
  const logoImgPos = (moduleCount / 2 + padding) - (logoImgSize / 2)
  svgParts.push(`<image href="${logoBase64.value}" x="${logoImgPos}" y="${logoImgPos}" width="${logoImgSize}" height="${logoImgSize}"/>`, "</svg>")
  qrContainer.value.innerHTML = svgParts.join("")
})

// Convert logo to base64 on mount
onMounted(async () => {
  const response = await fetch(logoImage)
  const blob = await response.blob()
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
