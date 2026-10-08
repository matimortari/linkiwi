import { describe, expect, it } from "vitest"
import { useDynamicStyles } from "../../app/composables/use-dynamic-styles"
import { DEFAULT_PREFERENCES } from "../../app/utils/constants"

describe("useDynamicStyles", () => {
  it("returns empty style helpers when preferences are null", () => {
    const styles = useDynamicStyles(null)

    expect(styles.backgroundStyle.value).toEqual({ backgroundColor: undefined })
    expect(styles.iconStyle()).toEqual({})
    expect(styles.linkStyle()).toEqual({})
    expect(styles.dividerStyle.value).toEqual({})
  })

  it("builds flat and gradient backgrounds", () => {
    const flat = useDynamicStyles({ ...DEFAULT_PREFERENCES, backgroundType: "FLAT", backgroundColor: "#fff" })
    expect(flat.backgroundStyle.value).toEqual({ backgroundColor: "#fff" })

    const gradient = useDynamicStyles({
      ...DEFAULT_PREFERENCES,
      backgroundType: "GRADIENT",
      backgroundGradientStart: "#111",
      backgroundGradientEnd: "#222",
    })
    expect(gradient.backgroundStyle.value).toEqual({
      background: "linear-gradient(to bottom, #111, #222)",
    })
  })

  it("applies hover colors and optional shadows for icons/links", () => {
    const prefs = {
      ...DEFAULT_PREFERENCES,
      iconBackgroundColor: "#aaa",
      iconHoverBackgroundColor: "#bbb",
      isIconShadow: true,
      iconShadowColor: "#000",
      iconShadowWeight: "light" as const,
      linkBackgroundColor: "#ccc",
      linkHoverBackgroundColor: "#ddd",
      isLinkShadow: false,
    }
    const styles = useDynamicStyles(prefs)

    expect(styles.iconStyle()).toMatchObject({
      backgroundColor: "#aaa",
      boxShadow: "0 2px 4px #000",
    })
    expect(styles.iconStyle(true)).toMatchObject({ backgroundColor: "#bbb" })
    expect(styles.linkStyle()).toMatchObject({
      backgroundColor: "#ccc",
      boxShadow: "none",
    })
    expect(styles.linkStyle(true)).toMatchObject({ backgroundColor: "#ddd" })
  })
})
