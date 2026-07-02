<template>
  <teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" role="alert">
          <div class="flex min-w-0 flex-1 flex-row items-center gap-4">
            <icon :name="TOAST_ICONS[toast.type]" size="20" :class="`text-${toast.type}`" />
            <span class="text-caption wrap-break-word">{{ toast.message }}</span>
          </div>
          <button class="toast-close" aria-label="Close notification" @click="dismiss(toast.id)">
            <icon name="mdi:close" size="15" />
          </button>

          <span v-if="toast.duration && toast.duration > 0" class="toast-progress" :class="`bg-${toast.type}`" :style="{ animationDuration: `${toast.duration}ms` }" />
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()
const TOAST_ICONS: Record<Toast["type"], string> = {
  danger: "ph:x-circle-bold",
  success: "ph:check-circle-bold",
  warning: "ph:warning-circle-bold",
  info: "ph:info-bold",
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
  pointer-events: none;
}
@media (max-width: 640px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background-color: var(--neutral-900);
  color: var(--neutral-100);
  border-radius: var(--border-radius);
  border: 1px solid var(--neutral-800);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  overflow: hidden;
}

.text-danger {
  color: var(--danger);
}
.text-success {
  color: var(--success);
}
.text-warning {
  color: var(--warning);
}
.text-info {
  color: var(--info);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--neutral-400);
  border-radius: calc(var(--border-radius) * 0.5);
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.toast-close:hover {
  background-color: var(--neutral-800);
  color: var(--neutral-100);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
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
