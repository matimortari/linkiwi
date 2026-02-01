import { useDebounceFn } from "@vueuse/core"

export function useContent(options: { selector?: string, parseMethod?: boolean } = {}) {
  const { selector = "article", parseMethod = false } = options
  const route = useRoute()
  const activeSection = ref<string | null>(null)
  const headers = ref<any[]>([])
  let observer: IntersectionObserver | null = null

  const updateActiveSection = useDebounceFn((id: string) => activeSection.value = id, 50)

  async function extractHeaders() {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    const container = document.querySelector(selector)
    if (!container) {
      return
    }

    const hElements = container.querySelectorAll("h2, h3, h4")
    headers.value = Array.from(hElements).map((el) => {
      const text = el.textContent?.trim() || ""
      let method: string | undefined
      if (parseMethod) {
        const next = el.nextElementSibling
        if (next && !/^H[2-4]$/.test(next.tagName)) {
          const nextText = next.textContent?.replace(/\*\*/g, "").trim() || ""
          const match = nextText.match(/^(GET|POST|PUT|DELETE)\b/i)
          if (match) {
            method = match[1]?.toUpperCase()
          }
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
          updateActiveSection(entry.target.id)
        }
      }
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0 })

    for (const heading of hElements) {
      observer!.observe(heading)
    }
  }

  const headerClasses = computed(() => (header: any) => {
    const classes: string[] = []
    if (header.level === 2) {
      classes.push("ml-0 my-2 font-semibold")
    }
    if (header.level === 3) {
      classes.push("ml-2 my-2 text-sm font-medium")
    }
    if (header.level === 4) {
      classes.push("ml-4 text-xs font-medium")
    }
    if (activeSection.value === header.id) {
      classes.push("text-primary font-semibold border-l-2 border-primary pl-2")
    }
    return classes.join(" ")
  })

  onMounted(extractHeaders)
  onBeforeUnmount(() => observer?.disconnect())

  watch(() => route.fullPath, async () => {
    observer?.disconnect()
    await extractHeaders()
  })

  return { headers, headerClasses, activeSection }
}
