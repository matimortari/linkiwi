import SymbolMonoDark from "~/assets/symbol-mono-dark.png"
import SymbolMonoLight from "~/assets/symbol-mono-light.png"
import Symbol from "~/assets/symbol.png"
import WordmarkDark from "~/assets/wordmark-dark.png"
import WordmarkLight from "~/assets/wordmark-light.png"

// Landing page constants
export const PRODUCT_BULLETS = [
  { description: "Share your page across different platforms with ease", icon: "mdi:share-outline" },
  { description: "Generate a QR code for in-person sharing", icon: "mdi:qrcode" },
  { description: "Tag your links per source and track visitor engagement", icon: "mdi:chart-timeline-variant-shimmer" },
]

export const ANALYTICS_BULLETS = [
  { description: "Real-time tracking for page views and clicks", icon: "mdi:clock-star-four-points-outline" },
  { description: "Monitor link and social icon clicks", icon: "mdi:cursor-default-click-outline" },
  { description: "See click rates and performance per individual link", icon: "mdi:chart-bar" },
]

export const SHARE_PLATFORMS = [
  { id: "whatsapp", icon: "simple-icons:whatsapp", color: "#25a244", rotate: -3 },
  { id: "linkedin", icon: "simple-icons:linkedin", color: "#0a66c2", rotate: -1 },
  { id: "facebook", icon: "simple-icons:facebook", color: "#1877f2", rotate: 1.5 },
  { id: "twitter", icon: "simple-icons:x", color: "#111111", rotate: 3 },
]

export const MOCK_ANALYTICS = [
  { label: "Total Page Views", icon: "mdi:file-eye-outline", value: "1,247" },
  { label: "Total Clicks", icon: "mdi:cursor-default-click-outline", value: "389" },
  { label: "Click Rate", icon: "mdi:file-percent-outline", value: "31.2%" },
  { label: "Joined On", icon: "mdi:calendar-clock-outline", value: "Oct 12, 2025" },
]

export const MOCK_REFERRALS = [
  { source: "LinkedIn", percentage: "45%", color: "#60A5FA" },
  { source: "Reddit", percentage: "35%", color: "#FBBF24" },
  { source: "Instagram", percentage: "20%", color: "#F472B6" },
]

// Admin dashboard constants
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

// Default user preferences for new accounts or resets
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

// Widget configuration constants
export const WIDGET_OPTIONS: { type: "GITHUB" | "YOUTUBE" | "SPOTIFY", label: string, icon: string }[] = [
  { type: "GITHUB", label: "GitHub", icon: "simple-icons:github" },
  { type: "YOUTUBE", label: "YouTube", icon: "simple-icons:youtube" },
  { type: "SPOTIFY", label: "Spotify", icon: "simple-icons:spotify" },
]

export const WIDGET_ICONS: Record<"GITHUB" | "YOUTUBE" | "SPOTIFY", string> = {
  GITHUB: "simple-icons:github",
  YOUTUBE: "simple-icons:youtube",
  SPOTIFY: "simple-icons:spotify",
}

export const WIDGET_LABELS: Record<"GITHUB" | "YOUTUBE" | "SPOTIFY", string> = {
  GITHUB: "GitHub",
  YOUTUBE: "YouTube",
  SPOTIFY: "Spotify",
}

export const WIDGET_META: Record<"GITHUB" | "YOUTUBE" | "SPOTIFY", { label: string, placeholder: string, hint: string }> = {
  GITHUB: { label: "GitHub Username", placeholder: "e.g. torvalds", hint: "Enter your GitHub username and display your top repositories." },
  YOUTUBE: { label: "YouTube Handle or Channel ID", placeholder: "e.g. @mkbhd or UCBcRF18a7Qf58cCRy5xuWwQ", hint: "Enter your @handle or channel ID to display your latest videos." },
  SPOTIFY: { label: "Spotify Link", placeholder: "e.g. https://open.spotify.com/track/...", hint: "Paste a Spotify URL for a track, album, playlist, episode, or podcast." },
}

// REST method label styles for documentation display
export const REST_METHOD_LABELS = {
  GET: "text-xs font-semibold text-[#0ec187]",
  POST: "text-xs font-semibold text-[#74a2e7]",
  PUT: "text-xs font-semibold text-[#cef1a7]",
  DELETE: "text-xs font-semibold text-[#e99795]",
}

// OAuth providers
export const OAUTH_PROVIDERS = [
  { name: "github", label: "Sign In With GitHub", icon: "simple-icons:github" },
  { name: "google", label: "Sign In With Google", icon: "simple-icons:google" },
]

// Brand constants
export const BRAND_SECTIONS = [
  { id: "wordmarks", label: "Wordmarks" },
  { id: "symbols", label: "Symbols" },
  { id: "brand", label: "Brand Colors" },
  { id: "base", label: "Base Colors" },
  { id: "accent", label: "Accent Colors" },
]

export const SYMBOLS = [
  { name: "Symbol", image: Symbol, bgClass: "bg-background!" },
  { name: "Symbol Mono (dark)", image: SymbolMonoDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Symbol Mono (light)", image: SymbolMonoLight, bgClass: "bg-[#030712]!" },
]

export const WORDMARKS = [
  { name: "Wordmark (dark)", image: WordmarkDark, bgClass: "bg-[#f9fafb]!" },
  { name: "Wordmark (light)", image: WordmarkLight, bgClass: "bg-[#030712]!" },
]

export const BRAND_COLORS = [
  { name: "Primary", var: "--primary" },
  { name: "Secondary", var: "--secondary" },
]

export const BASE_COLORS = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Input", var: "--input" },
  { name: "Muted", var: "--muted" },
  { name: "Muted Foreground", var: "--muted-foreground" },
]

export const ACCENT_COLORS = [
  { name: "Danger", var: "--danger" },
  { name: "Success", var: "--success" },
]
