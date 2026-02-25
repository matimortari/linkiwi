<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @mousedown.self="emit('update:isOpen', false)">
        <div class="overlay min-w-100 space-y-4">
          <header class="flex flex-row items-center justify-between gap-4">
            <h3>
              {{ title }}
            </h3>

            <button aria-label="Close Dialog" class="btn-ghost" @mousedown="emit('update:isOpen', false)">
              <icon name="mdi:close" size="20" />
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
const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
}>(), {
  title: "Dialog Title",
})

const emit = defineEmits<{ "update:isOpen": [value: boolean] }>()

function onEscape(e: KeyboardEvent) {
  if (e.key === "Escape" && props.isOpen) {
    emit("update:isOpen", false)
  }
}

onMounted(() => document.addEventListener("keydown", onEscape))
onBeforeUnmount(() => document.removeEventListener("keydown", onEscape))
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
