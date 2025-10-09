export function useCarousel(itemsLength: number, interval = 3000) {
  const currentIndex = ref(0)

  let timer: number

  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % itemsLength
  }

  onMounted(() => {
    timer = window.setInterval(next, interval)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { currentIndex, next }
}
