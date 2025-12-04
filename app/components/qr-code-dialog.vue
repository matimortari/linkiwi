<template>
  <Dialog :is-open="isOpen" title="My QR Code" @update:is-open="emit('close')">
    <div class="flex flex-col items-center gap-4 p-2">
      <p class="text-caption text-center">
        Scan this QR code to visit your profile:
      </p>

      <div class="flex items-center justify-center overflow-hidden rounded-lg bg-secondary p-1 shadow-lg">
        <QrcodeVue :value="pageUrl" :size="200" level="H" render-as="svg" />
      </div>

      <button class="font-semibold hover:underline" @click="copyPageUrl(pageUrl)">
        @{{ user?.slug }}
      </button>
    </div>

    <footer class="flex flex-row items-center justify-between">
      <p class="text-success">
        {{ copySuccess || '' }}
      </p>

      <button class="btn-primary" @click="copyPageUrl(pageUrl)">
        Copy Link
      </button>
    </footer>
  </Dialog>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue"

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits<(e: "close" | "update:isOpen") => void>()

const { user } = storeToRefs(useUserStore())
const copySuccess = ref<string | null>(null)

const pageUrl = computed(() => {
  if (!user.value)
    return ""

  return `${BASE_URL}/${user.value.slug}`
})

function copyPageUrl(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = "Copied to clipboard!"
    setTimeout(() => {
      copySuccess.value = null
    }, 2000)
  })
}
</script>
