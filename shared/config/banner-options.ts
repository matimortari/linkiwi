export const BANNER_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "LGBTQ_RIGHTS", label: "LGBTQ Rights" },
  { value: "ANTI_RACISM", label: "Anti Racism" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
  { value: "CLIMATE_ACTION", label: "Climate Action" },
] as const

export type BannerOptionType = (typeof BANNER_OPTIONS)[number]["label"]

export const BANNER_MESSAGES = {
  LGBTQ_RIGHTS: "Support the LGBTQIA+ Community",
  ANTI_RACISM: "Stand Against Racism and Injustice",
  MENTAL_HEALTH: "Promote Mental Health Awareness",
  CLIMATE_ACTION: "Support Climate Action & Sustainability",
}

export const BANNER_DESCRIPTIONS = {
  LGBTQ_RIGHTS:
    "Join the movement for equality and acceptance. Learn how you can support the community and advocate for change.",
  ANTI_RACISM:
    "Challenge racism and promote equity. Discover resources and actions to help build a more inclusive and just society.",
  MENTAL_HEALTH:
    "Learn how to access support, raise awareness, and promote mental well-being for yourself and others.",
  CLIMATE_ACTION:
    "The planet needs you. Take part in meaningful efforts to combat climate change and support a sustainable future.",
}

export const BANNER_ICONS = {
  LGBTQ_RIGHTS: "circle-flags:lgbt",
  ANTI_RACISM: "streamline:fist-solid",
  MENTAL_HEALTH: "ri:mental-health-fill",
  CLIMATE_ACTION: "ri:leaf-fill",
}

export const BANNER_STYLES = {
  LGBTQ_RIGHTS: "banner lgbtq-rights",
  ANTI_RACISM: "banner anti-racism",
  MENTAL_HEALTH: "banner mental-health",
  CLIMATE_ACTION: "banner climate-action",
}

export const BANNER_LINKS = {
  LGBTQ_RIGHTS: "https://www.hrc.org",
  ANTI_RACISM: "https://www.naacp.org",
  MENTAL_HEALTH: "https://www.nami.org",
  CLIMATE_ACTION: "https://www.nrdc.org",
}
