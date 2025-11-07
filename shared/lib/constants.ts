export const BACKGROUND_TYPES = [
  { value: "FLAT", label: "Flat" },
  { value: "GRADIENT", label: "Gradient" },
] as const

export const RADIUS_SIZES = [
  { label: "None", value: "0rem" },
  { label: "Small", value: "0.5rem" },
  { label: "Medium", value: "1rem" },
  { label: "Large", value: "5rem" },
] as const

export const BORDER_WIDTHS = [
  { label: "None", value: "0" },
  { label: "Thin", value: "1px" },
  { label: "Medium", value: "2px" },
  { label: "Thick", value: "4px" },
] as const

export const FONT_FAMILIES = [
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Noto Sans", value: "'Noto Sans', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Lora", value: "'Lora', serif" },
  { label: "Amarante", value: "'Amarante', serif" },
  { label: "Righteous", value: "'Righteous', sans-serif" },
  { label: "Ribeye", value: "'Ribeye', serif" },
  { label: "Ribeye Marrow", value: "'Ribeye Marrow', serif" },
  { label: "Audiowide", value: "'Audiowide', sans-serif" },
  { label: "Ubuntu Mono", value: "'Ubuntu Mono', monospace" },
] as const

export const FONT_SIZES = [
  { label: "Small", value: "1rem" },
  { label: "Medium", value: "1.1rem" },
  { label: "Large", value: "1.25rem" },
  { label: "Extra Large", value: "1.5rem" },
] as const

export const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
] as const

export const SHADOW_WEIGHTS = [
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Heavy", value: "heavy" },
] as const

export const LINK_FONT_SIZES = [
  { label: "Small", value: "0.8rem" },
  { label: "Medium", value: "0.9rem" },
  { label: "Large", value: "1rem" },
] as const

export const LINK_PADDING_SIZES = [
  { label: "Small", value: "0.5rem" },
  { label: "Medium", value: "0.75rem" },
  { label: "Large", value: "0.85rem" },
] as const

// Support Banner Options
export const BANNER_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "LGBTQ_RIGHTS", label: "LGBTQ Rights" },
  { value: "ANTI_RACISM", label: "Anti Racism" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
  { value: "CLIMATE_ACTION", label: "Climate Action" },
] as const

export const BANNER_MESSAGES = {
  LGBTQ_RIGHTS: "Support the LGBTQIA+ Community",
  ANTI_RACISM: "Stand Against Racism and Injustice",
  MENTAL_HEALTH: "Promote Mental Health Awareness",
  CLIMATE_ACTION: "Support Climate Action & Sustainability",
} as const

export const BANNER_DESCRIPTIONS = {
  LGBTQ_RIGHTS:
    "Join the movement for equality and acceptance. Learn how you can support the community and advocate for change.",
  ANTI_RACISM:
    "Challenge racism and promote equity. Discover resources and actions to help build a more inclusive and just society.",
  MENTAL_HEALTH:
    "Learn how to access support, raise awareness, and promote mental well-being for yourself and others.",
  CLIMATE_ACTION:
    "The planet needs you. Take part in meaningful efforts to combat climate change and support a sustainable future.",
} as const

export const BANNER_ICONS = {
  LGBTQ_RIGHTS: "circle-flags:lgbt",
  ANTI_RACISM: "streamline:fist-solid",
  MENTAL_HEALTH: "ri:mental-health-fill",
  CLIMATE_ACTION: "ri:leaf-fill",
} as const

export const BANNER_STYLES = {
  LGBTQ_RIGHTS: "banner lgbtq-rights",
  ANTI_RACISM: "banner anti-racism",
  MENTAL_HEALTH: "banner mental-health",
  CLIMATE_ACTION: "banner climate-action",
} as const

export const BANNER_LINKS = {
  LGBTQ_RIGHTS: "https://www.hrc.org",
  ANTI_RACISM: "https://www.naacp.org",
  MENTAL_HEALTH: "https://www.nami.org",
  CLIMATE_ACTION: "https://www.nrdc.org",
} as const

export const SOCIAL_ICONS = {
  "Airbnb": "simple-icons:airbnb",
  "Amazon": "simple-icons:amazon",
  "App Store": "simple-icons:appstore",
  "Apple Music": "simple-icons:applemusic",
  "Apple Podcasts": "simple-icons:applepodcasts",
  "Bandcamp": "simple-icons:bandcamp",
  "Behance": "simple-icons:behance",
  "Bluesky": "simple-icons:bluesky",
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

export type SocialPlatform = keyof typeof SOCIAL_ICONS
export type SocialIconValue = (typeof SOCIAL_ICONS)[SocialPlatform]
export type RadiusSize = (typeof RADIUS_SIZES)[number]["value"]
export type BackgroundOption = (typeof BACKGROUND_TYPES)[number]["value"]
export type BorderWidth = (typeof BORDER_WIDTHS)[number]["value"]
export type FontFamily = (typeof FONT_FAMILIES)[number]["value"]
export type FontSize = (typeof FONT_SIZES)[number]["value"]
export type FontWeight = (typeof FONT_WEIGHTS)[number]["value"]
export type LinkFontSize = (typeof LINK_FONT_SIZES)[number]["value"]
export type ShadowWeight = (typeof SHADOW_WEIGHTS)[number]["value"]
export type LinkPaddingSize = (typeof LINK_PADDING_SIZES)[number]["value"]
export type BannerOption = (typeof BANNER_OPTIONS)[number]["value"]
