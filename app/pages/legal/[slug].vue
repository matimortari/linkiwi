<template>
  <h1>
    {{ LEGAL_PAGES[slug]?.title }}
  </h1>

  <div v-for="(section, index) in LEGAL_PAGES[slug]?.content" :key="index">
    <h2>
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
      "This Privacy Policy explains how LinKiwi collects, uses, and protects your personal information when you access or use our services.",
      "In this Policy, “we”, “us”, and “our” refer to LinKiwi and its affiliates, and “you” and “your” refer to users of our services.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: ["We collect information to provide and improve our services, including:"],
    list: [
      "Account information from OAuth providers (Google, GitHub).",
      "Content you create or share on your LinKiwi page.",
      "Usage analytics such as page views, clicks, and interactions.",
      "Technical data such as device type, browser, IP address, and cookies.",
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: ["We use the information we collect to:"],
    list: [
      "Provide, maintain, and improve the service.",
      "Authenticate users and secure accounts.",
      "Analyze usage trends and generate analytics for users.",
      "Communicate important updates, including policy changes.",
    ],
  },
  {
    title: "Sharing and Disclosure",
    paragraphs: ["We do not sell your personal information. We may share information in the following situations:"],
    list: [
      "With service providers that help us operate the platform.",
      "When required by law, legal process, or governmental request.",
      "To protect rights, safety, or property of LinKiwi and our users.",
    ],
  },
  {
    title: "Cookies and Tracking",
    paragraphs: ["LinKiwi uses cookies and similar technologies to enhance your experience, measure usage, and improve our services."],
    list: [
      "Essential cookies to enable account login and security.",
      "Analytics cookies to monitor traffic and feature usage.",
      "Optional cookies for personalized preferences and improvements.",
    ],
  },
  {
    title: "Data Retention and Security",
    paragraphs: [
      "We retain personal data as long as necessary to provide our services or comply with legal obligations. We implement technical and organizational measures to protect data from unauthorized access, disclosure, or misuse.",
    ],
  },
  {
    title: "Your Rights",
    paragraphs: ["Depending on your jurisdiction, you may have rights regarding your personal data, including:"],
    list: [
      "Accessing or correcting your personal information.",
      "Requesting deletion of your personal information.",
      "Objecting to or restricting certain processing activities.",
      "Withdrawing consent where applicable.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Continued use of LinKiwi constitutes acceptance of the updated policy. We encourage you to review this page periodically.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "If you have any questions about the Privacy Policy, email the maintainer at <a href='mailto:matheus.felipe.19rt@gmail.com'>matheus.felipe.19rt@gmail.com</a>.",
    ],
  },
]

const TERMS_OF_SERVICE: { title: string, paragraphs: string[], list?: string[] }[] = [
  {
    title: "Introduction",
    paragraphs: [
      "Welcome to LinKiwi! By accessing or using our service, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use LinKiwi.",
      "In these Terms, “we”, “us”, and “our” refer to LinKiwi and its affiliates, and “you” and “your” refer to users. These Terms govern your access to and use of LinKiwi, including all features, websites, and applications.",
    ],
  },
  {
    title: "Use of Service & Data",
    paragraphs: [
      "LinKiwi helps users create and share a personal landing page. You agree not to misuse the service or engage in prohibited activities. You retain ownership of the content you add, while granting us a limited license to host and display it solely for service purposes. LinKiwi collects analytics and data required for authentication and functionality; see our Privacy Policy for details.",
    ],
    list: [
      "Do not upload or link to illegal content.",
      "Do not interfere with other users pages or the platform.",
      "Do not use LinKiwi for phishing, spamming, or distributing malware.",
    ],
  },
  {
    title: "Disclaimers & Termination",
    paragraphs: [
      "LinKiwi is provided on an \"as-is\" basis. We do not guarantee uninterrupted access, error-free performance, or analytics accuracy. We may suspend or terminate your account if you violate these Terms or engage in harmful activity. You may also delete your account at any time.",
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
      "These Terms are governed by the laws of the jurisdiction where LinKiwi operates. Any disputes will be resolved in the competent courts of that jurisdiction.",
    ],
  },
  {
    title: "Changes to Terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of LinKiwi constitutes acceptance of the updated Terms. We encourage you to review the Terms periodically.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "If you have any questions about the Terms of Service, email the maintainer at <a href='mailto:matheus.felipe.19rt@gmail.com'>matheus.felipe.19rt@gmail.com</a>.",
    ],
  },
]

const LEGAL_PAGES: Record<string, { title: string, description: string, content: { title: string, paragraphs: string[], list?: string[] }[] }> = {
  privacy: { title: "Privacy Policy", description: "Read the privacy policy for LinKiwi.", content: PRIVACY_POLICY },
  terms: { title: "Terms of Service", description: "Read the terms of service for LinKiwi.", content: TERMS_OF_SERVICE },
}

useHead({
  title: LEGAL_PAGES[slug]?.title,
  link: [{ rel: "canonical", href: `${baseURL}/legal/${slug}` }],
  meta: [{ name: "description", content: LEGAL_PAGES[slug]?.description }],
})

definePageMeta({ layout: "content" })
</script>
