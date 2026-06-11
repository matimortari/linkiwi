type BackgroundType = "FLAT" | "GRADIENT"
type SupportBanner = "NONE" | "LGBTQ_RIGHTS" | "ANTI_RACISM" | "MENTAL_HEALTH" | "CLIMATE_ACTION"
type ScheduleAction = "HIDE" | "DELETE"
type ProfileItemType = "LINK" | "WIDGET" | "ICON" | "DIVIDER" | "PHOTO_GRID"
type WidgetType = "GITHUB" | "YOUTUBE" | "SPOTIFY"
type SupportPlatform = "KO_FI" | "BUY_ME_A_COFFEE" | "PIX" | "CUSTOM"

interface User {
  id: string
  email: string
  name: string
  image?: string | null
  slug: string
  description?: string | null
  location?: string | null
  preferences?: UserPreferences | null
  banner?: UserBanner | null
  supportButton?: UserSupportButton | null
  items?: ProfileItem[]
  assets?: UserAsset[]
  views?: PageView[]
  comments?: Comment[]
  accounts?: Account[]
  createdAt?: Date | string
  updatedAt?: Date | string
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
  itemId: string
  url: string
  label: string
}

interface ProfileItemWidget {
  itemId: string
  type: WidgetType
  handle: string
}

interface ProfileItemIcon {
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

interface UserSupportButton {
  userId: string
  isEnabled: boolean
  platform: SupportPlatform
  url: string
  thankYouMessage?: string | null
  suggestedAmounts: number[]
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
}

interface Comment {
  id: string
  userId: string
  name: string
  email?: string | null
  message: string
  createdAt: Date | string
}

interface UIState {
  sidebar: boolean
  preview: boolean
  dialogs: {
    user: boolean
    share: boolean
    supportButton: boolean
    item: {
      isOpen: boolean
      selectedItem: ProfileItem | null
      activeType: ProfileItemType | null
    }
  }
}

interface TocHeader {
  id: string
  text: string
  method?: string
  level: number
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}
