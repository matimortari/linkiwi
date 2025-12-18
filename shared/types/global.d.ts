interface User {
  id: string
  email: string
  name: string
  slug: string
  description?: string | null
  image: string
  createdAt?: Date | string
  updatedAt?: Date | string
  preferences: UserPreferences
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

interface ThemePreset {
  title: string
  preferences: UserPreferences
}

interface PageView {
  id: string
  userId: string
  date: Date | string
  referrer?: string | null
  source?: string | null
}

interface CarouselPreset {
  slug: string
  description: string
  image: string
  icons: (Omit<Pick<Icon, "id" | "logo">, "id"> & { id: string | number })[]
  links: (Omit<Pick<Link, "id" | "title">, "id"> & { id: string | number })[]
  preferences: UserPreferences
}
