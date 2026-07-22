<template>
  <teleport to="body">
    <div class="pointer-events-none fixed right-6 bottom-6 z-60 flex max-w-96 flex-col gap-2" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts" :key="toast.id"
          class="pointer-events-auto relative flex items-center justify-between gap-2 overflow-hidden rounded-(--border-radius) border border-muted bg-card px-5 py-4 text-foreground shadow-lg" role="alert"
        >
          <div class="flex min-w-0 flex-1 flex-row items-center gap-4">
            <icon :name="TOAST_ICONS[toast.type]" size="20" :class="TOAST_TEXT[toast.type]" />
            <span class="text-caption wrap-break-word">{{ toast.message }}</span>
          </div>
          <button
            type="button"
            class="flex shrink-0 items-center justify-center rounded-sm border-none bg-transparent p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close notification" @click="dismiss(toast.id)"
          >
            <icon name="mdi:close" size="15" />
          </button>

          <span v-if="toast.duration && toast.duration > 0" class="toast-progress absolute bottom-0 left-0 h-0.75 w-full origin-left" :class="TOAST_BG[toast.type]" :style="{ animationDuration: `${toast.duration}ms` }" />
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-progress {
  animation: shrink linear forwards;
}

@keyframes shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s var(--transition),
    transform 0.35s var(--transition);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.98);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-active {
  position: absolute;
  width: 100%;
}
.toast-move {
  transition: transform 0.35s var(--transition);
}
</style>
