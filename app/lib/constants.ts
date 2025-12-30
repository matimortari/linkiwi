export const BASE_URL = "https://linkstashr.vercel.app"

export const PRODUCT_BULLETS = [
  {
    description: "Design your own personalized link page",
    icon: "mdi:cards-playing-heart-outline",
  },
  {
    description: "Add unlimited links and social profiles",
    icon: "mdi:link-variant-plus",
  },
  {
    description: "Free to use!",
    icon: "mdi:tag-remove-outline",
  },
]

export const ANALYTICS_BULLETS = [
  {
    description: "Real-time page view tracking",
    icon: "mdi:clock-star-four-points-outline",
  },
  {
    description: "Monitor link and social icon clicks",
    icon: "mdi:cursor-default-click-outline",
  },
  {
    description: "Discover your traffic sources",
    icon: "mdi:web",
  },
]

export const MOCK_ANALYTICS = [
  {
    label: "Total Page Views",
    icon: "mdi:file-eye-outline",
    value: "1,247",
  },
  {
    label: "Total Clicks",
    icon: "mdi:cursor-default-click-outline",
    value: "389",
  },
  {
    label: "Click Rate",
    icon: "mdi:file-percent-outline",
    value: "31.2%",
  },
  {
    label: "Joined On",
    icon: "mdi:calendar-clock-outline",
    value: "Oct 12, 2025",
  },
]

export const MOCK_REFERRALS = [
  {
    source: "LinkedIn",
    percentage: "45%",
    color: "#60A5FA",
  },
  {
    source: "Reddit",
    percentage: "35%",
    color: "#FBBF24",
  },
  {
    source: "Instagram",
    percentage: "20%",
    color: "#F472B6",
  },
]

export const QUOTES = [
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "The only thing that is constant is change.",
    author: "Heraclitus",
  },
  {
    quote: "How far have we come, how far can we go?",
    author: "Unknown",
  },
  {
    quote: "How lucky I am to have something that makes saying goodbye so hard.",
    author: "Winnie the Pooh",
  },
  {
    quote: "I wish there was a way to know you're in the good old days before you've actually left them.",
    author: "Andy Bernard",
  },
  {
    quote: "We need diversity of thought in the world to face the new challenges.",
    author: "Tim Berners-Lee",
  },
  {
    quote: "Simple things should be simple, complex things should be possible.",
    author: "Alan Kay",
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
  },
  {
    quote: "A positive attitude makes all the difference in the world.",
    author: "Jenny Holzer",
  },
  {
    quote: "Low expectations are good protection.",
    author: "Jenny Holzer",
  },
  {
    quote: "Things turn out best for the people who make the best of the way things turn out.",
    author: "John Wooden",
  },
  {
    quote: "Keep your face always toward the sunshine - and shadows will fall behind you.",
    author: "Walt Whitman",
  },
]

export const OAUTH_PROVIDERS = [
  { name: "github", label: "Sign In With Github", icon: "simple-icons:github" },
  { name: "google", label: "Sign In With Google", icon: "simple-icons:google" },
]

export const REST_METHOD_LABELS = {
  GET: "text-xs font-semibold text-[#0ec187]",
  POST: "text-xs font-semibold text-[#74a2e7]",
  PUT: "text-xs font-semibold text-[#cef1a7]",
  DELETE: "text-xs font-semibold text-[#e99795]",
}

export const SIDEBAR_NAV_LINKS = [
  { label: "Profile", url: "/admin/profile", icon: "mdi:home-outline" },
  { label: "Preferences", url: "/admin/preferences", icon: "mdi:cog-outline" },
  { label: "Analytics", url: "/admin/analytics", icon: "mdi:chart-bell-curve-cumulative" },
]

export const APPEARANCE_TABS = [
  { label: "Background", value: "background" },
  { label: "User Info", value: "user" },
  { label: "Links", value: "links" },
  { label: "Social Icons", value: "icons" },
  { label: "Themes", value: "themes" },
]

export const DEFAULT_PREFERENCES = {
  backgroundType: "FLAT" as const,
  backgroundColor: "#f5f7fa",
  backgroundGradientStart: "#000000",
  backgroundGradientEnd: "#000000",
  profilePictureRadius: "0.5rem" as const,
  profilePictureBorderColor: "#d1dae3",
  profilePictureBorderWidth: "2px" as const,
  slugTextColor: "#1e293b",
  slugTextWeight: "400" as const,
  slugTextSize: "1rem" as const,
  slugFontFamily: "'Roboto', sans-serif" as const,
  headerTextColor: "#334155",
  headerTextWeight: "400" as const,
  headerTextSize: "1.1rem" as const,
  headerFontFamily: "'Roboto', sans-serif" as const,
  linkBackgroundColor: "#e2e8f0",
  linkTextColor: "#475569",
  linkTextWeight: "400" as const,
  linkTextSize: "0.9rem" as const,
  linkFontFamily: "'Roboto', sans-serif" as const,
  isLinkShadow: false,
  linkShadowColor: "#94a3b8",
  linkShadowWeight: "medium" as const,
  linkHoverBackgroundColor: "#cbd5e1",
  linkBorderRadius: "0.5rem" as const,
  linkPadding: "0.5rem" as const,
  showLinkCopyButton: true,
  iconBackgroundColor: "#e2e8f0",
  isIconShadow: false,
  iconShadowColor: "#94a3b8",
  iconShadowWeight: "medium" as const,
  iconLogoColor: "#475569",
  iconHoverBackgroundColor: "#cbd5e1",
  supportBanner: "NONE" as const,
  enableGuestbook: false,
}
