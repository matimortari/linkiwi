export function useCarousel(itemsLength: number, interval = 3000) {
  const currentIndex = ref(0)

  let timer: ReturnType<typeof setInterval>

  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % itemsLength
  }

  onMounted(() => {
    timer = globalThis.setInterval(next, interval)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { currentIndex, next }
}
