import logoDark from "~/assets/wordmark-dark.png"
import logoLight from "~/assets/wordmark-light.png"

export function useTheme() {
  const colorMode = useState<"light" | "dark">("theme", () => "light")
  const storageKey = "nuxt-color-mode"

  const updateHtmlClass = () => {
    const html = globalThis.document.documentElement
    html.classList.remove("light", "dark")
    html.classList.add(colorMode.value)
  }

  const syncThemeFromLocalStorage = () => {
    const saved = globalThis.localStorage.getItem(storageKey)
    if (saved === "dark" || saved === "light") {
      colorMode.value = saved
    }
    else {
      const prefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      colorMode.value = prefersDark ? "dark" : "light"
    }

    updateHtmlClass()
  }

  const toggleTheme = () => {
    colorMode.value = colorMode.value === "dark" ? "light" : "dark"
    globalThis.localStorage.setItem(storageKey, colorMode.value)
    updateHtmlClass()
  }

  onMounted(() => {
    syncThemeFromLocalStorage()
  })

  const themeIcon = computed(() =>
    colorMode.value === "light" ? "mdi:weather-night" : "mdi:weather-sunny",
  )

  const themeTitle = computed(() =>
    colorMode.value === "light" ? logoDark : logoLight,
  )

  return {
    colorMode,
    toggleTheme,
    themeIcon,
    themeTitle,
  }
}
