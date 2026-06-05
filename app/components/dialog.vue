<template>
  <teleport to="body">
    <transition :name="isMobile ? 'slide-up' : 'fade'">
      <div
        v-if="isOpen" class="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-xs"
        :class="isMobile ? 'items-end justify-center' : 'items-center justify-center'" @mousedown.self="emit('update:isOpen', false)"
      >
        <div
          class="overlay space-y-4" :class="isMobile ? 'flex max-h-dvh w-full flex-col' : 'min-w-120'"
          role="dialog" aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <!-- Drag handle (mobile only) -->
          <div v-if="isMobile" class="h-1 w-20 self-center rounded-full bg-current opacity-20" />

          <header class="flex flex-row items-center justify-between gap-4 border-b pb-2">
            <h3 id="dialog-title">
              {{ title }}
            </h3>

            <button aria-label="Close Dialog" class="btn-ghost" @mousedown="emit('update:isOpen', false)">
              <icon name="mdi:close" size="20" />
            </button>
          </header>

          <section class="scroll-area" :class="isMobile ? 'overflow-y-auto' : ''">
            <slot />
          </section>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
}>(), {
  title: "Dialog Title",
})

const emit = defineEmits<{ "update:isOpen": [value: boolean] }>()

const isMobile = ref(false)

function onEscape(e: KeyboardEvent) {
  if (e.key === "Escape" && props.isOpen) {
    emit("update:isOpen", false)
  }
}

onMounted(() => {
  const mql = globalThis.matchMedia("(max-width: 767px)")
  isMobile.value = mql.matches
  mql.addEventListener("change", e => isMobile.value = e.matches)
  document.addEventListener("keydown", onEscape)
})

onBeforeUnmount(() => document.removeEventListener("keydown", onEscape))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-enter-active > div:first-child,
.slide-up-leave-active > div:first-child {
  transition: opacity 0.3s ease;
}
</style>
