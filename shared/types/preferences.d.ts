import type { BackgroundOption, BannerOption, BorderWidth, FontFamily, FontSize, FontWeight, LinkFontSize, LinkPaddingSize, RadiusSize, ShadowWeight } from "#shared/lib/constants"

declare global {
  interface UserPreferences {
    backgroundType: BackgroundOption
    backgroundColor?: string
    backgroundGradientStart?: string
    backgroundGradientEnd?: string
    profilePictureRadius: RadiusSize
    profilePictureBorderWidth: BorderWidth
    profilePictureBorderColor: string
    slugFontFamily: FontFamily
    slugTextSize: FontSize
    slugTextWeight: FontWeight
    slugTextColor: string
    headerFontFamily: FontFamily
    headerTextSize: FontSize
    headerTextWeight: FontWeight
    headerTextColor: string
    linkFontFamily: FontFamily
    linkTextSize: LinkFontSize
    linkTextWeight: FontWeight
    linkTextColor: string
    linkBackgroundColor: string
    linkHoverBackgroundColor: string
    linkBorderRadius: RadiusSize
    linkPadding: LinkPaddingSize
    isLinkShadow: boolean
    linkShadowColor?: string
    linkShadowWeight?: ShadowWeight
    showLinkCopyButton?: boolean
    iconBackgroundColor: string
    iconHoverBackgroundColor: string
    iconLogoColor: string
    isIconShadow: boolean
    iconShadowColor?: string
    iconShadowWeight?: ShadowWeight
    supportBanner?: BannerOption
    enableGuestbook: boolean
  }
}

export {}
