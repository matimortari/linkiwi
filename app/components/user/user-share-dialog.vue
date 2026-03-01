<template>
  <Dialog :is-open="isOpen" title="Share Profile" @update:is-open="emit('close')">
    <div class="flex flex-col gap-2">
      <div class="navigation-group flex-wrap justify-center">
        <button
          v-for="tab in shareTabs" :key="tab.value"
          class="btn-ghost justify-start! text-muted-foreground!" :class="{ 'bg-muted!': activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div v-if="activeTab === 'qr'" class="flex flex-col items-center gap-2">
        <div ref="qrContainer" class="overflow-hidden rounded-2xl border shadow-sm" />

        <button class="btn-ghost" @click="downloadQRCode()">
          <icon :name="downloadAction.icon.value" size="20" />
          <span>Download QR Code</span>
        </button>
      </div>

      <div v-if="activeTab === 'tracking'" class="flex flex-col gap-2">
        <p class="text-caption text-center">
          Copy your profile link with tracking parameters to see where your visitors are coming from.
        </p>

        <div class="card grid grid-cols-4 gap-2 md:grid-cols-3">
          <button v-for="source in trackingSources" :key="source.id" class="btn-ghost justify-start!" @click="handleCopyWithTracking(source.id)">
            <icon :name="source.icon" size="25" />
            <span>{{ source.label }}</span>
          </button>
        </div>

        <div class="flex gap-2">
          <input
            v-model="customTag" type="text"
            placeholder="Custom tag (e.g., newsletter)" class="flex-1"
            @keyup.enter="handleCopyWithTracking(customTag)"
          >
          <button class="btn" :disabled="!customTag.trim()" @click="handleCopyWithTracking(customTag)">
            <icon :name="copyAction.icon.value" size="20" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      <!-- Share to Socials Tab -->
      <div v-if="activeTab === 'social'" class="flex flex-col gap-2">
        <p class="text-caption text-center">
          Share your profile directly to social media platforms.
        </p>

        <div class="card grid grid-cols-2 gap-2">
          <button class="btn-ghost justify-start!" @click="shareToSocial('twitter')">
            <icon name="simple-icons:x" size="25" />
            <span>Share on X / Twitter</span>
          </button>
          <button class="btn-ghost justify-start!" @click="shareToSocial('facebook')">
            <icon name="simple-icons:facebook" size="25" />
            <span>Share on Facebook</span>
          </button>
          <button class="btn-ghost justify-start!" @click="shareToSocial('linkedin')">
            <icon name="simple-icons:linkedin" size="25" />
            <span>Share on LinkedIn</span>
          </button>
          <button class="btn-ghost justify-start!" @click="shareToSocial('whatsapp')">
            <icon name="simple-icons:whatsapp" size="25" />
            <span>Send via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>

    <footer v-if="copySuccess" class="text-caption-success py-2 text-center">
      {{ copySuccess }}
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

const { public: { baseURL } } = useRuntimeConfig()
const { user } = storeToRefs(useUserStore())
const { createActionHandler } = useActionIcon()
const qrContainer = ref<HTMLElement | null>(null)
const copySuccess = ref<string | null>(null)
const logoBase64 = ref("")
const customTag = ref("")
const activeTab = ref("qr")
const pageUrl = computed(() => `${baseURL}/${user.value?.slug}`)
const downloadAction = createActionHandler("mdi:download")
const copyAction = createActionHandler("mdi:content-copy")

const shareTabs = [
  { label: "QR Code", value: "qr" },
  { label: "Link Tracking", value: "tracking" },
  { label: "Share to Socials", value: "social" },
]

const trackingSources = [
  { id: "instagram", label: "Instagram", icon: "simple-icons:instagram" },
  { id: "twitter", label: "X / Twitter", icon: "simple-icons:x" },
  { id: "tiktok", label: "TikTok", icon: "simple-icons:tiktok" },
  { id: "youtube", label: "YouTube", icon: "simple-icons:youtube" },
  { id: "linkedin", label: "LinkedIn", icon: "simple-icons:linkedin" },
  { id: "facebook", label: "Facebook", icon: "simple-icons:facebook" },
  { id: "reddit", label: "Reddit", icon: "simple-icons:reddit" },
  { id: "discord", label: "Discord", icon: "simple-icons:discord" },
  { id: "email", label: "Email", icon: "mdi:email-outline" },
]

async function handleCopyWithTracking(source: string) {
  const sanitizedSource = source.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "")
  if (!sanitizedSource) {
    return
  }

  await copyAction.triggerCopy(`${pageUrl.value}?ref=${encodeURIComponent(sanitizedSource)}`)
  copySuccess.value = `Copied! Tracking: ${sanitizedSource}`
  setTimeout(() => copySuccess.value = null, 3000)
  if (source === customTag.value) {
    customTag.value = ""
  }
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
  downloadAction.triggerSuccess()
  copySuccess.value = "QR code downloaded!"
  setTimeout(() => copySuccess.value = null, 3000)
}

function shareToSocial(platform: "twitter" | "facebook" | "linkedin" | "whatsapp") {
  const trackedUrl = `${pageUrl.value}?ref=${platform}`

  const shareUrls = {
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(`🚀 Check out my #linkiosk profile! 🌟\n\n🔗 ${trackedUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackedUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackedUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out my LinKiosk profile: ${trackedUrl}`)}`,
  }

  window.open(shareUrls[platform], "_blank")
  copySuccess.value = "Opening share dialog..."
  setTimeout(() => copySuccess.value = null, 3000)
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
