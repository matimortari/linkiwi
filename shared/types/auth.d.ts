declare module "#auth-utils" {
  interface User {
    id: string
    email: string
    name: string
    image?: string | null
    slug: string
    preferences: UserPreferences
    links: Link[]
    icons: Icon[]
    views: PageView[]
  }

  interface UserSession {
    user: User
    loggedInAt: Date
  }
}
