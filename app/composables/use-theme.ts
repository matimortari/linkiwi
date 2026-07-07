import logoDark from "~/assets/wordmark-dark.png"
import logoLight from "~/assets/wordmark-light.png"

export function useTheme() {
  const colorMode = useState<"dark" | "light">("theme", () => "dark")
  const storageKey = "nuxt-color-mode"
  const themeIcon = computed(() => colorMode.value === "light" ? "ph:moon-stars-bold" : "ph:sun-horizon-bold")
  const themeTitle = computed(() => colorMode.value === "light" ? logoDark : logoLight)

  const toggleTheme = () => {
    colorMode.value = colorMode.value === "light" ? "dark" : "light"
    globalThis.localStorage.setItem(storageKey, colorMode.value)
    globalThis.document.documentElement.classList.remove("dark", "light")
    globalThis.document.documentElement.classList.add(colorMode.value)
  }

  onMounted(() => {
    const saved = globalThis.localStorage.getItem(storageKey)
    if (saved === "light" || saved === "dark") {
      colorMode.value = saved
    }
    else {
      colorMode.value = globalThis.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    }

    globalThis.document.documentElement.classList.remove("dark", "light")
    globalThis.document.documentElement.classList.add(colorMode.value)
  })

  return {
    colorMode,
    themeIcon,
    themeTitle,
    toggleTheme,
  }
}
