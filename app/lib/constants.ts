export const BASE_URL = "https://linknest.vercel.app"

export const API_URL = "/api"

export const FEATURES = [
  {
    title: "Unlimited Links",
    description: "Add as many links or social icons as you want.",
    icon: "mdi:account-details-outline",
  },
  {
    title: "Fully Customizable",
    description: "Customize the colors, layouts and more for your page.",
    icon: "mdi:palette-outline",
  },
  {
    title: "Detailed Analytics",
    description: "Track your page views, clicks, and more with analytics.",
    icon: "mdi:chart-bell-curve-cumulative",
  },
  {
    title: "Free to Use!",
    description: "LinkNest is completely free to use, with no hidden fees.",
    icon: "mdi:tag-remove-outline",
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

export const REST_METHOD_COLORS = {
  GET: "bg-[#123733] border-[#0ec187] text-[#0ec187]",
  POST: "bg-[#202f46] border-[#74a2e7] text-[#74a2e7]",
  PUT: "bg-[#37413b] border-[#cef1a7] text-[#cef1a7]",
  DELETE: "bg-[#3b3138] border-[#e99795] text-[#e99795]",
}

export const SIDEBAR_NAV_LINKS = [
  { label: "Profile", url: "/admin/profile", icon: "material-symbols:location-home-outline" },
  { label: "Preferences", url: "/admin/preferences", icon: "material-symbols:settings-applications-outline" },
  { label: "Analytics", url: "/admin/analytics", icon: "material-symbols:chart-data-outline" },
]

export const APPEARANCE_TABS = [
  { label: "Background", value: "background" },
  { label: "User Info", value: "user" },
  { label: "Links", value: "links" },
  { label: "Social Icons", value: "icons" },
  { label: "Themes", value: "themes" },
]
