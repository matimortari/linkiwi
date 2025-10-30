export function useContent(options: { selector?: string, parseMethod?: boolean } = {}) {
  const { selector = "article", parseMethod = false } = options
  const activeSection = ref<string | null>(null)
  const headers = ref<any[]>([])
  let observer: IntersectionObserver | null = null

  onMounted(async () => {
    await nextTick()

    const container = document.querySelector(selector)
    if (!container)
      return

    const hElements = container.querySelectorAll("h2, h3, h4")
    headers.value = Array.from(hElements).map((el) => {
      const text = el.textContent?.trim() || ""
      let method: string | undefined
      if (parseMethod) {
        const next = el.nextElementSibling
        if (next && !/^H[2-4]$/.test(next.tagName)) {
          const nextText = next.textContent?.replace(/\*\*/g, "").trim() || ""
          const match = nextText.match(/^(GET|POST|PUT|DELETE)\b/i)
          if (match)
            method = match[1]?.toUpperCase()
        }
      }

      // Generate unique ID
      let id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      let counter = 1
      while (document.getElementById(id)) {
        id = `${id}-${counter++}`
      }
      el.id = id

      return { id, text, level: Number(el.tagName.replace("H", "")), method }
    })

    // IntersectionObserver for active heading
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          activeSection.value = entry.target.id
      })
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0 })

    hElements.forEach(heading => observer!.observe(heading))
  })

  onBeforeUnmount(() => observer?.disconnect())

  function headerClasses(header: any) {
    const classes = []
    if (header.level === 2)
      classes.push("ml-0 my-2 text-base font-semibold")
    if (header.level === 3)
      classes.push("ml-4 my-2 text-sm font-semibold")
    if (header.level === 4)
      classes.push("ml-8 text-xs")
    if (activeSection.value === header.id)
      classes.push("text-primary font-semibold")
    return classes.join(" ")
  }

  return { headers, headerClasses }
}
