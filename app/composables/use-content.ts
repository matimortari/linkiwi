export function useContent(options: { selector?: string, parseMethod?: boolean } = {}) {
  const { selector = "article", parseMethod = false } = options
  const route = useRoute()
  const activeSection = ref<string | null>(null)
  const headers = ref<any[]>([])
  let observer: IntersectionObserver | null = null

  async function extractHeaders() {
    await nextTick()
    const container = document.querySelector(selector)
    if (!container) {
      return
    }

    const hElements = container.querySelectorAll("h2, h3, h4")
    headers.value = Array.from(hElements).map((el) => {
      const text = el.textContent?.trim() || ""
      let method: string | undefined
      if (parseMethod) {
        let node = el.nextElementSibling
        while (node) {
          if (/^H[2-4]$/.test(node.tagName)) {
            break
          }

          const text = node.textContent?.replace(/\*\*/g, "").trim()
          if (text) {
            const match = text.match(/\b(GET|POST|PUT|DELETE)\b/i)
            if (match && match[1]) {
              method = match[1].toUpperCase()
            }
            break
          }

          node = node.nextElementSibling
        }
      }

      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      el.id = id

      return { id, text, level: Number(el.tagName.replace("H", "")), method }
    })

    // Clean up and re-init observer
    observer?.disconnect()
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0 })
    for (const heading of hElements) {
      observer!.observe(heading)
    }
  }

  onMounted(extractHeaders)
  onBeforeUnmount(() => observer?.disconnect())
  watch(() => route.fullPath, async () => {
    observer?.disconnect()
    await extractHeaders()
  })

  function headerClasses(header: any) {
    const classes: string[] = []
    if (header.level === 2) {
      classes.push("ml-0 my-2 text-base font-semibold")
    }
    if (header.level === 3) {
      classes.push("ml-2 my-2 text-sm font-semibold")
    }
    if (header.level === 4) {
      classes.push("ml-4 text-xs")
    }
    if (activeSection.value === header.id) {
      classes.push("text-primary font-semibold")
    }

    return classes.join(" ")
  }

  return { headers, headerClasses }
}
