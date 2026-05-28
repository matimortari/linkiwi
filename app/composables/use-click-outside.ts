export function useClickOutside(targetRef: Ref<HTMLElement | null>, callback: () => void, options?: { escapeKey?: boolean }) {
  const handler = (event: MouseEvent) => {
    if (!targetRef.value || !(event.target instanceof Node)) {
      return
    }
    if (!targetRef.value.contains(event.target)) {
      callback()
    }
  }

  const escapeHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener("click", handler)
    if (options?.escapeKey) {
      document.addEventListener("keydown", escapeHandler)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener("click", handler)
    if (options?.escapeKey) {
      document.removeEventListener("keydown", escapeHandler)
    }
  })
}
