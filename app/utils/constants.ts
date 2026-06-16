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
  { description: "See click rates and performance per link", icon: "mdi:chart-bar" },
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
  { label: "Layout", value: "layout" },
  { label: "Links", value: "links" },
  { label: "Social Icons", value: "icons" },
  { label: "Themes", value: "themes" },
]

// Default user preferences for new accounts or resets
export const DEFAULT_PREFERENCES: UserPreferences = {
  backgroundType: "FLAT",
  backgroundColor: "#f5f7fa",
  backgroundGradientStart: "#000000",
  backgroundGradientEnd: "#000000",
  profilePictureRadius: "0.5rem",
  profilePictureBorderColor: "#d1dae3",
  profilePictureBorderWidth: "2px",
  slugTextColor: "#1e293b",
  slugTextWeight: "400",
  slugTextSize: "1rem",
  slugFontFamily: "'Roboto', sans-serif",
  headerTextColor: "#334155",
  headerTextWeight: "400",
  headerTextSize: "1.1rem",
  headerFontFamily: "'Roboto', sans-serif",
  linkBackgroundColor: "#e2e8f0",
  linkTextColor: "#475569",
  linkTextWeight: "400",
  linkTextSize: "0.9rem",
  linkFontFamily: "'Roboto', sans-serif",
  isLinkShadow: false,
  linkShadowColor: "#94a3b8",
  linkShadowWeight: "medium",
  linkHoverBackgroundColor: "#cbd5e1",
  linkBorderRadius: "0.5rem",
  linkPadding: "0.5rem",
  showLinkCopyButton: true,
  iconBackgroundColor: "#e2e8f0",
  isIconShadow: false,
  iconShadowColor: "#94a3b8",
  iconShadowWeight: "medium",
  iconLogoColor: "#475569",
  iconHoverBackgroundColor: "#cbd5e1",
  dividerColor: "#e2e8f0",
  dividerThickness: "1px",
  dividerStyle: "solid",
  supportBanner: "NONE",
  enableGuestbook: false,
}

// Profile item type options
export const ITEM_TYPES = [
  { type: "LINK", label: "Link", icon: "mdi:link-variant" },
  { type: "WIDGET", label: "Widget", icon: "mdi:shape-outline" },
  { type: "DIVIDER", label: "Divider", icon: "mdi:minus" },
  { type: "PHOTO_GRID", label: "Photo Grid", icon: "mdi:image-multiple-outline" },
] as const

// Supported platform options for social icons
export const SOCIAL_ICONS = {
  "Airbnb": "simple-icons:airbnb",
  "Amazon": "simple-icons:amazon",
  "App Store": "simple-icons:appstore",
  "Apple Music": "simple-icons:applemusic",
  "Apple Podcasts": "simple-icons:applepodcasts",
  "Bandcamp": "simple-icons:bandcamp",
  "Behance": "simple-icons:behance",
  "Bluesky": "simple-icons:bluesky",
  "Calendly": "simple-icons:calendly",
  "CodePen": "simple-icons:codepen",
  "Discord": "simple-icons:discord",
  "Dribbble": "simple-icons:dribbble",
  "Etsy": "simple-icons:etsy",
  "Facebook": "simple-icons:facebook",
  "GitHub": "simple-icons:github",
  "Gmail": "simple-icons:gmail",
  "Goodreads": "simple-icons:goodreads",
  "Google Maps": "simple-icons:googlemaps",
  "Google Play": "simple-icons:googleplay",
  "Instagram": "simple-icons:instagram",
  "Kickstarter": "simple-icons:kickstarter",
  "Letterboxd": "simple-icons:letterboxd",
  "LinkedIn": "simple-icons:linkedin",
  "Mastodon": "simple-icons:mastodon",
  "Medium": "simple-icons:medium",
  "Notion": "simple-icons:notion",
  "Patreon": "simple-icons:patreon",
  "Pinterest": "simple-icons:pinterest",
  "Reddit": "simple-icons:reddit",
  "ResearchGate": "simple-icons:researchgate",
  "Shopify": "simple-icons:shopify",
  "Signal": "simple-icons:signal",
  "Slack": "simple-icons:slack",
  "Snapchat": "simple-icons:snapchat",
  "SoundCloud": "simple-icons:soundcloud",
  "Spotify": "simple-icons:spotify",
  "Stack Overflow": "simple-icons:stackoverflow",
  "Substack": "simple-icons:substack",
  "Telegram": "simple-icons:telegram",
  "Tiktok": "simple-icons:tiktok",
  "Tripadvisor": "simple-icons:tripadvisor",
  "Trello": "simple-icons:trello",
  "Twitch": "simple-icons:twitch",
  "Vimeo": "simple-icons:vimeo",
  "Whatsapp": "simple-icons:whatsapp",
  "X": "simple-icons:x",
  "Yelp": "simple-icons:yelp",
  "Youtube": "simple-icons:youtube",
} as const

export const WIDGET_OPTIONS: { type: WidgetType, label: string, icon: string }[] = [
  { type: "GITHUB", label: "GitHub", icon: "simple-icons:github" },
  { type: "YOUTUBE", label: "YouTube", icon: "simple-icons:youtube" },
  { type: "SPOTIFY", label: "Spotify", icon: "simple-icons:spotify" },
]

export const WIDGET_ICONS: Record<WidgetType, string> = {
  GITHUB: "simple-icons:github",
  YOUTUBE: "simple-icons:youtube",
  SPOTIFY: "simple-icons:spotify",
}

export const WIDGET_LABELS: Record<WidgetType, string> = {
  GITHUB: "GitHub",
  YOUTUBE: "YouTube",
  SPOTIFY: "Spotify",
}

export const WIDGET_META: Record<WidgetType, { label: string, placeholder: string, hint: string }> = {
  GITHUB: { label: "GitHub Username", placeholder: "e.g. torvalds", hint: "Enter your GitHub username and display your top repositories." },
  YOUTUBE: { label: "YouTube Handle or Channel ID", placeholder: "e.g. @mkbhd or UCBcRF18a7Qf58cCRy5xuWwQ", hint: "Enter your @handle or channel ID to display your latest videos." },
  SPOTIFY: { label: "Spotify Link", placeholder: "e.g. https://open.spotify.com/track/...", hint: "Paste a Spotify URL for a track, album, playlist, episode, or podcast." },
}

export const SCHEDULE_ACTION_OPTIONS = [
  { value: "HIDE", label: "Hide", icon: "mdi:eye-off-outline" },
  { value: "DELETE", label: "Delete", icon: "mdi:trash-can-outline" },
] as const

// REST method label styles for documentation display
export const REST_METHOD_LABELS = {
  GET: "text-xs font-semibold text-[#0ec187]",
  POST: "text-xs font-semibold text-[#74a2e7]",
  PUT: "text-xs font-semibold text-[#cef1a7]",
  DELETE: "text-xs font-semibold text-[#e99795]",
}

// OAuth providers
export const OAUTH_PROVIDERS = [
  { name: "google", label: "Sign In With Google", icon: "simple-icons:google" },
  { name: "github", label: "Sign In With GitHub", icon: "simple-icons:github" },
]

// Brand constants
export const SYMBOLS = [
  { name: "Symbol", image: Symbol, bgClass: "bg-neutral-100" },
  { name: "Symbol Mono (dark)", image: SymbolMonoDark, bgClass: "bg-white" },
  { name: "Symbol Mono (light)", image: SymbolMonoLight, bgClass: "bg-neutral-900" },
]

export const WORDMARKS = [
  { name: "Wordmark (dark)", image: WordmarkDark, bgClass: "bg-white" },
  { name: "Wordmark (light)", image: WordmarkLight, bgClass: "bg-neutral-900" },
]

export const NEUTRAL_SCALE = [
  { name: "Neutral/100", var: "--neutral-100", value: "#f9fafb" },
  { name: "Neutral/200", var: "--neutral-200", value: "#f3f4f6" },
  { name: "Neutral/300", var: "--neutral-300", value: "#e5e7eb" },
  { name: "Neutral/400", var: "--neutral-400", value: "#9ca3af" },
  { name: "Neutral/500", var: "--neutral-500", value: "#6b7280" },
  { name: "Neutral/600", var: "--neutral-600", value: "#4b5563" },
  { name: "Neutral/700", var: "--neutral-700", value: "#374151" },
  { name: "Neutral/800", var: "--neutral-800", value: "#111827" },
  { name: "Neutral/900", var: "--neutral-900", value: "#030712" },
]

export const BRAND_COLORS = [
  { name: "Primary", var: "--brand-primary", value: "#77774a" },
  { name: "Secondary", var: "--brand-secondary", value: "#474b36" },
]

export const STATUS_COLORS = [
  { name: "Danger", darkVar: "--red-dark", darkVal: "#a11f1f", lightVar: "--red-light", lightVal: "#e69191" },
  { name: "Success", darkVar: "--green-dark", darkVal: "#00754a", lightVar: "--green-light", lightVal: "#81dbb3" },
  { name: "Warning", darkVar: "--orange-dark", darkVal: "#a64503", lightVar: "--orange-light", lightVal: "#fad08c" },
  { name: "Info", darkVar: "--blue-dark", darkVal: "#3773ba", lightVar: "--blue-light", lightVal: "#a3c7f0" },
]
