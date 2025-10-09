export function useActiveHeading() {
  const activeSection = ref<string | null>(null)

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      },
    )

    document.querySelectorAll("article h2, article h3, article h4").forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent?.trim() || ""
        heading.id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      }
      observer.observe(heading)
    })

    onBeforeUnmount(() => observer.disconnect())
  })

  return { activeSection }
}
