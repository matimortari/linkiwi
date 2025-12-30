interface User {
  id: string
  email: string
  name: string
  image: string | null
  slug: string
  description?: string | null
  preferences: UserPreferences
  links?: Link[]
  icons?: Icon[]
  views?: PageView[]
  comments?: Comment[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface Link {
  id: string
  url: string
  title: string
  clickCount: number
  clicks?: { date: string | Date }[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface Icon {
  id: string
  url: string
  platform: string
  logo: string
  clickCount: number
  clicks?: { date: string | Date }[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface PageView {
  id: string
  userId: string
  date: Date | string
  referrer?: string | null
  source?: string | null
}

interface Comment {
  id: string
  name: string
  email?: string | null
  message: string
  createdAt: Date | string
}
