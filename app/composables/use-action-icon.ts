export function useActionIcon(defaultIcon: string) {
  const success = ref(false)
  const icon = computed(() => success.value ? "ph:check-bold" : defaultIcon)

  function triggerSuccess() {
    success.value = true
    setTimeout(() => (success.value = false), 1500)
  }

  async function triggerCopy(text: string) {
    if (!text) {
      return
    }

    await navigator.clipboard.writeText(text)
    triggerSuccess()
  }

  return { icon, triggerSuccess, triggerCopy }
}
