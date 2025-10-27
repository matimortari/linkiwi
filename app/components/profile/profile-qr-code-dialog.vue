<template>
  <Dialog :is-open="isOpen" title="My QR Code" @update:is-open="emit('close')">
    <div class="flex flex-col items-center gap-4">
      <p class="text-muted-foreground text-sm">
        Scan this QR code to visit your profile:
      </p>

      <QrcodeVue :value="props.slug" :size="150" level="M" class="rounded-lg border bg-white p-2" />

      <button class="hover:underline" aria-label="Copy Profile Link" @click="copyPageUrl(pageUrl)">
        @{{ props.slug }}
      </button>
    </div>

    <footer class="flex flex-row items-center justify-between">
      <p class="text-success">
        {{ copySuccess || '' }}
      </p>

      <button class="btn-primary" aria-label="Copy Profile Link" @click="copyPageUrl(pageUrl)">
        Copy Link
      </button>
    </footer>
  </Dialog>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue"

const props = defineProps({
  isOpen: Boolean,
  slug: String,
})

const emit = defineEmits(["close", "update:isOpen"])

const copySuccess = ref<string | null>(null)
const pageUrl = `${BASE_URL}/${props.slug}`

function copyPageUrl(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = "Copied to clipboard!"
    setTimeout(() => {
      copySuccess.value = null
    }, 2000)
  })
}
</script>
