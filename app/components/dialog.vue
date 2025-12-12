<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @mousedown.self="closeDialog">
        <div class="overlay min-w-100 space-y-4">
          <header class="flex flex-row items-center justify-between gap-4">
            <h3>
              {{ title }}
            </h3>

            <button aria-label="Close Dialog" @mousedown="closeDialog">
              <icon name="mdi:close" size="20" class="text-muted-foreground transition-transform hover:scale-110" />
            </button>
          </header>

          <section>
            <slot />
          </section>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: "Dialog Title",
  },
})

const emit = defineEmits<{ (e: "update:isOpen", value: boolean): void, (e: "confirm"): void }>()

const dialogRef = ref<HTMLElement | null>(null)

function closeDialog() {
  emit("update:isOpen", false)
}

useClickOutside(dialogRef, () => {
  if (props.isOpen) {
    closeDialog()
  }
}, { escapeKey: true })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
