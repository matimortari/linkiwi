const toasts = ref<Toast[]>([])
let toastIdCounter = 0

export function useToast() {
  function show(message: string, type: Toast["type"], duration = 5000) {
    const id = `toast-${++toastIdCounter}`
    const toast: Toast = { id, message, type, duration }

    toasts.value.push(toast)
    if (duration > 0) {
      setTimeout(dismiss, duration, id)
    }

    return id
  }

  function success(message: string, duration = 5000) {
    return show(message, "success", duration)
  }

  function error(message: string, duration = 7000) {
    return show(message, "error", duration)
  }

  function warning(message: string, duration = 6000) {
    return show(message, "warning", duration)
  }

  function info(message: string, duration = 5000) {
    return show(message, "info", duration)
  }

  function dismiss(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clear() {
    toasts.value = []
  }

  return { toasts: readonly(toasts), show, success, error, warning, info, dismiss, clear }
}
