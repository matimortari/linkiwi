interface User {
  id?: string
  name?: string
  slug: string
  email?: string
  description: string | null
  image?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  preferences?: UserPreferences
  views?: PageView[]
  icons?: Icon[]
  links?: Link[]
}

interface Link {
  id?: string
  title: string
  url: string
  clicks?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  linkClicks?: { date: string | Date }[]
}

interface Icon {
  id?: string
  platform: string
  url: string
  logo: string
  clicks?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  iconClicks?: { date: string | Date }[]
}

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
}

interface PageView {
  id: string
  userId: string
  date: Date | string
}
