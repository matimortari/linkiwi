<template>
  <teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts" :key="toast.id"
          class="toast" :class="[`toast-${toast.type}`]"
          role="alert"
        >
          <div class="toast-content">
            <icon :name="getToastIcon(toast.type)" size="20" />
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" aria-label="Close notification" @click="dismiss(toast.id)">
            <icon name="mdi:close" size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()

function getToastIcon(type: Toast["type"]) {
  if (type === "success") {
    return "mdi:check-circle-outline"
  }

  if (type === "warning") {
    return "mdi:alert-circle-outline"
  }

  if (type === "info") {
    return "mdi:info-circle-outline"
  }

  return "mdi:close-circle-outline"
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
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
    max-width: none;
  }
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--border-radius);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  backdrop-filter: blur(8px);
  border: var(--border-style);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-size: 0.875rem;
  line-height: 1.25rem;
  word-break: break-word;
  font-weight: 500;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: calc(var(--border-radius) * 0.5);
  flex-shrink: 0;
  transition: background-color 0.2s;
  color: inherit;
}

.toast-close:hover {
  background-color: color-mix(in srgb, var(--foreground) 12%, transparent);
}

.toast-success {
  background-color: var(--success);
  color: var(--success-foreground);
}
.toast-error {
  background-color: var(--danger);
  color: var(--danger-foreground);
}
.toast-warning {
  background-color: var(--warning);
  color: var(--warning-foreground);
}
.toast-info {
  background-color: var(--info);
  color: var(--info-foreground);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform var(--transition);
}
</style>
