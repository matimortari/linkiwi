export function useDynamicStyles(preferences: UserPreferences | null | Ref<UserPreferences | null | undefined>) {
  const pref = computed(() => unref(preferences))

  const backgroundStyle = computed(() =>
    pref.value?.backgroundType === "GRADIENT"
      ? { background: `linear-gradient(to bottom, ${pref.value.backgroundGradientStart}, ${pref.value.backgroundGradientEnd})` }
      : { backgroundColor: pref.value?.backgroundColor },
  )

  const profilePictureStyle = computed(() => ({
    borderRadius: pref.value?.profilePictureRadius,
    borderColor: pref.value?.profilePictureBorderColor,
    borderWidth: pref.value?.profilePictureBorderWidth,
  }))

  const slugStyle = computed(() => ({
    color: pref.value?.slugTextColor,
    fontWeight: pref.value?.slugTextWeight,
    fontSize: pref.value?.slugTextSize,
    fontFamily: pref.value?.slugFontFamily,
  }))

  const descriptionStyle = computed(() => ({
    color: pref.value?.headerTextColor,
    fontWeight: pref.value?.headerTextWeight,
    fontSize: pref.value?.headerTextSize,
    fontFamily: pref.value?.headerFontFamily,
  }))

  function iconStyle(isHovered: boolean) {
    if (!pref.value) {
      return
    }

    const shadowMap: Record<string, string> = {
      none: "none",
      light: `0 2px 4px ${pref.value.iconShadowColor}`,
      medium: `0 4px 6px ${pref.value.iconShadowColor}`,
      heavy: `0 6px 10px ${pref.value.iconShadowColor}`,
    }
    return {
      backgroundColor: isHovered ? pref.value.iconHoverBackgroundColor : pref.value.iconBackgroundColor,
      boxShadow: pref.value.isIconShadow ? shadowMap[pref.value.iconShadowWeight!] : "none",
      transition: "background-color 0.4s ease, box-shadow 0.4s ease",
    }
  }

  const iconInnerStyle = computed(() =>
    pref.value ? { color: pref.value.iconLogoColor } : {},
  )

  function linkStyle(isHovered: boolean) {
    if (!pref.value) {
      return
    }

    const shadowMap: Record<string, string> = {
      none: "none",
      light: `0 2px 4px ${pref.value.linkShadowColor}`,
      medium: `0 4px 6px ${pref.value.linkShadowColor}`,
      heavy: `0 6px 10px ${pref.value.linkShadowColor}`,
    }
    return {
      backgroundColor: isHovered ? pref.value.linkHoverBackgroundColor : pref.value.linkBackgroundColor,
      boxShadow: pref.value.isLinkShadow ? shadowMap[pref.value.linkShadowWeight!] : "none",
      borderRadius: pref.value.linkBorderRadius,
      padding: pref.value.linkPadding,
      transition: "background-color 0.4s ease, box-shadow 0.4s ease",
    }
  }

  const linkInnerStyle = computed(() => {
    if (pref.value) {
      return { color: pref.value.linkTextColor, fontWeight: pref.value.linkTextWeight, fontFamily: pref.value.linkFontFamily, fontSize: pref.value.linkTextSize }
    }
  })

  return {
    backgroundStyle,
    profilePictureStyle,
    slugStyle,
    descriptionStyle,
    iconStyle,
    iconInnerStyle,
    linkStyle,
    linkInnerStyle,
  }
}
