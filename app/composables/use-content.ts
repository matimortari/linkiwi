export function useContent(options: { selector?: string, parseMethod?: boolean } = {}) {
  const { selector = "article", parseMethod = false } = options
  const route = useRoute()
  const headers = ref<TocHeader[]>([])

  async function extractHeaders() {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    const container = document.querySelector(selector)
    if (!container) {
      return
    }

    headers.value = Array.from(container.querySelectorAll("h2, h3, h4"), (el) => {
      const text = el.textContent?.trim() || ""
      let method: string | undefined
      if (parseMethod) {
        const next = el.nextElementSibling
        if (next && !/^H[2-4]$/.test(next.tagName)) {
          const match = next.textContent?.replace(/\*\*/g, "").trim().match(/^(GET|POST|PUT|DELETE)\b/i)
          if (match) {
            method = match[1]?.toUpperCase()
          }
        }
      }

      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      el.id = id

      return { id, text, level: Number(el.tagName.replace("H", "")), method }
    })
  }

  const headerClasses = computed(() => (header: TocHeader) => {
    const classes: string[] = []
    if (header.level === 2) {
      classes.push("ml-0 my-1.5 font-semibold")
    }
    if (header.level === 3) {
      classes.push("ml-4 my-1.5 text-sm font-medium")
    }
    if (header.level === 4) {
      classes.push("ml-8 my-1 text-xs font-medium")
    }
    return classes.join(" ")
  })

  onMounted(extractHeaders)

  watch(() => route.fullPath, extractHeaders)

  return { headers, headerClasses }
}
