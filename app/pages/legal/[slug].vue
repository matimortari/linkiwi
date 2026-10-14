<template>
  <h1>
    {{ page.title }}
  </h1>

  <div v-for="(section, index) in page.content" :key="index">
    <h2 :id="slugify(section.title)">
      {{ section.title }}
    </h2>

    <p v-for="(para, pIdx) in section.paragraphs" :key="pIdx" v-html="para" />

    <ul v-if="section.list">
      <li v-for="(item, lIdx) in section.list" :key="lIdx" v-html="item" />
    </ul>
  </div>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const route = useRoute()
const slug = route.params.slug as string

const PRIVACY_POLICY: { title: string, paragraphs: string[], list?: string[] }[] = [
  {
    title: "Introduction",
    paragraphs: [
      "This Privacy Policy explains how LinKiwi collects, uses, and protects your personal information when you access or use the LinKiwi web application.",
      "In this Policy, “we”, “us”, and “our” refer to the controller identified below, and “you” and “your” refer to users of the service.",
    ],
  },
  {
    title: "Controller",
    paragraphs: [
      "The controller of personal data processed through LinKiwi is <strong>Matheus Mortari</strong>, a natural person operating the service.",
      "Contact for privacy requests: <a href='mailto:matheus.felipe.19rt@gmail.com'>matheus.felipe.19rt@gmail.com</a>. The same contact acts as the channel for data-subject requests under the Brazilian General Data Protection Law (LGPD — Lei nº 13.709/2018).",
    ],
  },
  {
    title: "Legal Bases (LGPD)",
    paragraphs: ["We process personal data only when a legal basis under LGPD Article 7 applies, including:"],
    list: [
      "<strong>Performance of a contract</strong> (Art. 7, V) — creating and maintaining your account, authenticating you, hosting your profile page and content, and providing the features you use.",
      "<strong>Legitimate interest</strong> (Art. 7, IX) — security, fraud prevention, rate limiting, and product analytics that show you page views and click metrics for your own profile, balanced against your rights and visitors’ expectations.",
      "<strong>Compliance with a legal obligation</strong> (Art. 7, II) — when we must retain or disclose data to meet applicable law.",
      "<strong>Consent</strong> (Art. 7, I) — where an OAuth provider requires it, or where we ask for an optional permission that is not necessary for the core service.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: ["We collect information needed to operate and secure the service, including:"],
    list: [
      "Account information received from OAuth providers (Google, GitHub), such as name, email, and profile image.",
      "Content you create or share on your LinKiwi page (links, icons, widgets, photos, location blocks, guestbook entries, and appearance preferences).",
      "Profile analytics such as page views, item clicks, and referrer information, so you can measure engagement with your page.",
      "Technical data such as IP address, user agent, and authentication cookies.",
      "Cloudflare Web Analytics on the production website.",
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: ["We use the information we collect to:"],
    list: [
      "Provide, maintain, and secure the service.",
      "Authenticate users and secure accounts.",
      "Display your public profile and host the content you publish.",
      "Generate profile analytics (views, clicks, referrers) for the account owner.",
      "Communicate important updates, including security alerts and policy changes.",
      "Comply with legal obligations and protect the platform and its users.",
    ],
  },
  {
    title: "Sharing and Disclosure",
    paragraphs: ["We do not sell your personal information. We may share data under the following circumstances:"],
    list: [
      "With infrastructure and service providers that help us host, secure, or deliver the platform (for example hosting, database, Redis, object storage, and Cloudflare).",
      "With OAuth identity providers when you choose to sign in through them.",
      "Publicly, when you publish content on your LinKiwi page — that content is visible to visitors of your profile URL.",
      "When required by law, legal process, or a competent authority.",
      "To protect the rights, safety, or property of LinKiwi, its users, or third parties.",
    ],
  },
  {
    title: "Cookies and Tracking",
    paragraphs: ["LinKiwi uses cookies and similar technologies as follows:"],
    list: [
      "Essential cookies for authentication and session security.",
      "Cloudflare Web Analytics on the production website.",
      "Local preference storage for settings such as color theme.",
    ],
  },
  {
    title: "Data Retention and Security",
    paragraphs: [
      "We retain personal data only as long as necessary to provide the service or comply with legal obligations. You may delete your account from the admin interface. We apply technical and organizational measures intended to reduce unauthorized access, disclosure, or misuse.",
    ],
  },
  {
    title: "Your Rights (LGPD)",
    paragraphs: ["Under the LGPD, you may request:"],
    list: [
      "Confirmation of processing and access to your personal data.",
      "Correction of incomplete, inaccurate, or outdated data.",
      "Anonymization, blocking, or deletion of unnecessary or excessive data, or of data processed in noncompliance with the LGPD.",
      "Portability of data to another service provider, subject to ANPD regulation and technical feasibility.",
      "Information about public and private entities with which we shared data.",
      "Information about the possibility of denying consent and the consequences of that denial.",
      "Revocation of consent, where processing is based on consent.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Material changes will be reflected on this page. Continued use of LinKiwi after an update constitutes acceptance of the revised policy.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "Privacy and LGPD requests: <a href='mailto:matheus.felipe.19rt@gmail.com'>matheus.felipe.19rt@gmail.com</a>.",
    ],
  },
]

const TERMS_OF_SERVICE: { title: string, paragraphs: string[], list?: string[] }[] = [
  {
    title: "Introduction",
    paragraphs: [
      "Welcome to LinKiwi. By accessing or using the service, you agree to these Terms of Service. If you do not agree, do not use LinKiwi.",
      "In these Terms, “we”, “us”, and “our” refer to Matheus Mortari operating LinKiwi, and “you” and “your” refer to users of the service. These Terms govern access to and use of LinKiwi, including the website and API.",
    ],
  },
  {
    title: "Use of Service & Data",
    paragraphs: [
      "LinKiwi helps users create and share a personal landing page. You retain ownership of the content you add, and you grant LinKiwi a limited license to host, store, and display that content solely to provide the service. Authentication, analytics, and related processing are described in our Privacy Policy.",
    ],
    list: [
      "Do not upload or link to illegal, harmful, or malicious content.",
      "Do not interfere with other users’ pages or the platform.",
      "Do not use LinKiwi for phishing, spamming, or distributing malware.",
    ],
  },
  {
    title: "Disclaimers & Termination",
    paragraphs: [
      "LinKiwi is provided on an \"as-is\" basis. We do not guarantee uninterrupted access, error-free performance, or analytics accuracy. We may suspend or terminate your account if you violate these Terms, misuse the service, or engage in harmful activity. You may also delete your account at any time.",
      "Accounts may be suspended or terminated in cases including, but not limited to:",
    ],
    list: [
      "Violating these Terms or applicable laws.",
      "Uploading content that is illegal, harmful, or infringes third-party rights.",
      "Attempting to hack, exploit, or disrupt the platform.",
      "Spamming or sending unsolicited communications through LinKiwi.",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the Federative Republic of Brazil. Disputes shall be submitted to the courts of the controller's domicile in Brazil, without prejudice to mandatory consumer-protection venues where applicable.",
    ],
  },
  {
    title: "Changes to Terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of LinKiwi after an update constitutes acceptance of the revised Terms. Review this page periodically.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "Questions about these Terms: <a href='mailto:matheus.felipe.19rt@gmail.com'>matheus.felipe.19rt@gmail.com</a>.",
    ],
  },
]

const LEGAL_PAGES = {
  privacy: { title: "Privacy Policy", description: "Read the privacy policy for LinKiwi.", content: PRIVACY_POLICY },
  terms: { title: "Terms of Service", description: "Read the terms of service for LinKiwi.", content: TERMS_OF_SERVICE },
} as const

const page = LEGAL_PAGES[slug as keyof typeof LEGAL_PAGES]

useHead({
  title: page.title,
  link: [{ rel: "canonical", href: `${baseURL}/legal/${slug}` }],
  meta: [{ name: "description", content: page.description }],
})

definePageMeta({
  layout: "content",
  validate: route => typeof route.params.slug === "string" && ["privacy", "terms"].includes(route.params.slug),
})
</script>
