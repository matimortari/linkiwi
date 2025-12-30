declare module "#auth-utils" {
  interface User {
    id: string
    email: string
    name: string
    image?: string | null
  }

  interface UserSession {
    user: User
    loggedInAt: Date
  }

  interface Account {
    id: string
    userId: string
    provider: string
    providerAccountId: string
    user?: User
    createdAt?: Date | string
    updatedAt?: Date | string
  }
}

interface OAuthUserData {
  id: string
  email: string
  name: string
  image: string | null
  provider: "google" | "github"
}
