type BackgroundType = "FLAT" | "GRADIENT"
type SupportBanner = "NONE" | "LGBTQ_RIGHTS" | "ANTI_RACISM" | "MENTAL_HEALTH" | "CLIMATE_ACTION"
type ScheduleAction = "HIDE" | "DELETE"
type ProfileItemType = "LINK" | "WIDGET" | "ICON" | "DIVIDER" | "PHOTO_GRID"
type WidgetType = "GITHUB" | "YOUTUBE" | "SPOTIFY"

interface User {
  id: string
  email: string
  name: string
  image: string
  slug: string
  description?: string | null
  location?: string | null
  preferences?: UserPreferences | null
  banner?: UserBanner | null
  items?: ProfileItem[]
  assets?: UserAsset[]
  views?: PageView[]
  comments?: Comment[]
  accounts?: Account[]
  createdAt?: Date | string
  updatedAt?: Date | string
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
  dividerColor?: string
  dividerThickness?: BorderWidth
  dividerStyle?: DividerStyle
  supportBanner?: BannerOption
  enableGuestbook?: boolean
}

interface UserBanner {
  id: string
  userId: string
  assetId?: string | null
  url: string
  asset?: UserAsset | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface UserAsset {
  id: string
  userId: string
  url: string
  key: string
  mimeType: string
  size: number
  label?: string | null
  createdAt?: Date | string
}

interface ProfileItem {
  id: string
  userId: string
  type: ProfileItemType
  order: number
  isPinned: boolean
  isVisible: boolean
  scheduledStart?: Date | string | null
  scheduledEnd?: Date | string | null
  scheduleAction?: ScheduleAction | null
  link?: ProfileItemLink | null
  widget?: ProfileItemWidget | null
  icon?: ProfileItemIcon | null
  photoGrid?: ProfileItemPhotoGrid | null
  clicks?: ItemClick[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface ProfileItemLink {
  id: string
  itemId: string
  url: string
  label: string
}

interface ProfileItemWidget {
  id: string
  itemId: string
  type: WidgetType
  handle: string
}

interface ProfileItemIcon {
  id: string
  itemId: string
  url: string
  platform?: string | null
  logo?: string | null
}

interface ProfileItemPhotoGrid {
  itemId: string
  photos?: PhotoGridItem[]
}

interface PhotoGridItem {
  id: string
  gridId: string
  assetId?: string | null
  url: string
  order: number
  alt?: string | null
  asset?: UserAsset | null
}
interface PageView {
  id: string
  userId: string
  referrer?: string | null
  source?: string | null
  createdAt: Date | string
}

interface ItemClick {
  id: string
  itemId: string
  createdAt: Date | string
  item?: ProfileItem | null
}

interface Comment {
  id: string
  userId: string
  name: string
  email?: string | null
  message: string
  createdAt: Date | string
}

interface NormalizedLink {
  id: string
  title: string
  url: string
  isVisible: boolean
  order: number
}

interface NormalizedIcon {
  id: string
  platform: string
  url: string
  logo: string
  isVisible: boolean
  order: number
}

interface NormalizedWidget {
  id: string
  isVisible: boolean
  type: WidgetType
  handle: string
}

interface UIState {
  sidebar: boolean
  preview: boolean
  dialogs: {
    user: boolean
    share: boolean
    item: {
      isOpen: boolean
      selectedItem: ProfileItem | null
      activeType: ProfileItemType | null
    }
    link: {
      isOpen: boolean
      selectedLink: ProfileItem | null
    }
    icon: {
      isOpen: boolean
      selectedIcon: ProfileItem | null
    }
    photoGrid: {
      isOpen: boolean
      selectedPhotoGrid: ProfileItem | null
    }
    widget: {
      isOpen: boolean
      selectedWidget: ProfileItem | null
    }
  }
}

interface Toast {
  id: string
  message: string
  type: "danger" | "success" | "warning" | "info"
  duration?: number
}
