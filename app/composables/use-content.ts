import { useDebounceFn } from "@vueuse/core"

export function useContent(options: { selector?: string, parseMethod?: boolean } = {}) {
  const { selector = "article", parseMethod = false } = options
  const route = useRoute()
  const activeSection = ref<string | null>(null)
  const headers = ref<any[]>([])
  let observer: IntersectionObserver | null = null

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
          useDebounceFn(() => activeSection.value = entry.target.id, 50)()
        }
      }
    }, { root: null, rootMargin: "-100px 0px -66% 0px", threshold: 0 })

    for (const heading of hElements) {
      observer!.observe(heading)
    }
  }

  const headerClasses = computed(() => (header: any) => {
    const classes: string[] = []
    const isActive = activeSection.value === header.id
    if (header.level === 2) {
      classes.push("ml-0 my-2 font-semibold py-1")
    }
    if (header.level === 3) {
      classes.push("ml-4 my-1.5 text-sm font-medium py-1")
    }
    if (header.level === 4) {
      classes.push("ml-8 my-1 text-xs font-medium py-0.5")
    }
    if (isActive) {
      classes.push("text-primary font-bold border-l-2 border-primary pl-2 -ml-0.5")
    }
    else {
      classes.push("text-muted-foreground border-l-2 border-transparent pl-2")
    }
    return classes.join(" ")
  })

  function scrollToSection(targetId: string) {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const offset = targetElement.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: offset, behavior: "smooth" })
    }
  }

  function handleAnchorClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const link = target.closest("a[href^=\"#\"]")
    if (!link) {
      return
    }

    e.preventDefault()
    const href = link.getAttribute("href")
    if (!href) {
      return
    }

    scrollToSection(href.slice(1))
  }

  onMounted(() => {
    extractHeaders()
    document.addEventListener("click", handleAnchorClick)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    document.removeEventListener("click", handleAnchorClick)
  })

  watch(() => route.fullPath, async () => {
    observer?.disconnect()
    await extractHeaders()
  })

  return { headers, headerClasses, activeSection, scrollToSection }
}
