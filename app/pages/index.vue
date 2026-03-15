<template>
  <section
    id="hero" v-motion
    :initial="{ opacity: 0, y: -40 }" :visible-once="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex min-h-screen w-full flex-col items-center justify-between gap-8 overflow-hidden border-b bg-card px-4 py-32 md:flex-row md:px-40 2xl:min-h-[80vh]"
  >
    <img src="/assets/hero-backdrop.svg" alt="Hero background" class="wave-bg" aria-hidden="true">

    <header class="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
      <h1>
        Keep all your stuff together!
      </h1>
      <p class="text-lead">
        Welcome to <span class="font-semibold text-secondary">LinKiosk</span>! Your links, profiles, contact info, and more
        in one place. Create and customize your page and share it with your audience.
      </p>

      <nuxt-link to="/sign-in" class="btn-primary">
        <span>Get Started Now!</span>
        <icon name="mdi:arrow-right" size="25" />
      </nuxt-link>
    </header>

    <Carousel />
  </section>

  <section
    id="product" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex w-full flex-col items-center justify-center gap-12 px-8 py-28 text-center md:px-20"
  >
    <div class="flex flex-col items-center gap-2">
      <span class="section-badge">Sharing</span>
      <h2>
        Share Your Page, Your Way
      </h2>
    </div>

    <div class="container mx-auto grid w-full grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-2">
      <div class="order-1 flex items-center justify-center">
        <div class="relative grid grid-cols-2 gap-2">
          <div
            v-for="platform in SHARE_PLATFORMS" :key="platform.id"
            class="card flex h-28 w-44 flex-col justify-between"
            :style="{ background: platform.color }"
          >
            <div class="flex items-center justify-between">
              <icon name="mdi:account-circle" size="30" class="text-white/60" />
              <icon :name="platform.icon" size="25" class="text-surface-foreground" />
            </div>
            <div class="flex flex-col items-start gap-1 text-start">
              <span class="text-sm font-medium text-surface-foreground">@alexjohnson</span>
              <span class="text-xs text-white/50">linkiosk.app/alexjohnson</span>
            </div>
          </div>

          <div class="-right-10 -bottom-3 navigation-group hidden gap-1.5 rounded-full border bg-card px-3 py-1.5 whitespace-nowrap shadow-sm md:absolute" style="z-index: 10;">
            <icon name="mdi:link-variant" size="20" class="text-primary" />
            <span class="text-xs font-medium">linkiosk.app/alexjohnson</span>
          </div>
        </div>
      </div>

      <div class="order-2 flex flex-col gap-4 text-start">
        <p class="text-lead">
          Customize your page with your own style and share your unique URL.
          Whether you're a creator, business, or influencer, LinKiosk makes it
          easy to share and connect with your audience.
        </p>

        <div class="flex flex-col gap-2">
          <div v-for="bullet in PRODUCT_BULLETS" :key="bullet.description" class="navigation-group gap-3">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
              <icon :name="bullet.icon" size="20" class="text-secondary" />
            </div>
            <span class="text-sm font-medium">{{ bullet.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section
    id="analytics" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex w-full flex-col items-center justify-center gap-12 border-y bg-muted/20 px-8 py-28 text-center md:px-20"
  >
    <div class="flex flex-col items-center gap-2">
      <span class="section-badge">Analytics</span>
      <h2>
        Track Your Performance
      </h2>
    </div>

    <div class="container mx-auto grid w-full grid-cols-1 items-center justify-items-center gap-12 md:grid-cols-2">
      <div class="order-2 flex flex-col gap-6 text-start md:order-1">
        <p class="text-lead">
          Get insights into how your audience engages with your content.
          Track views, clicks, and traffic sources all in one place.
          Make data-driven decisions to optimize your online presence.
        </p>

        <div class="flex flex-col gap-2">
          <div v-for="bullet in ANALYTICS_BULLETS" :key="bullet.description" class="navigation-group gap-3">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
              <icon :name="bullet.icon" size="20" class="text-secondary" />
            </div>
            <span class="text-sm font-medium">{{ bullet.description }}</span>
          </div>
        </div>
      </div>

      <div class="order-1 flex items-center justify-center md:order-2">
        <div class="relative w-full max-w-md">
          <div class="overlay relative space-y-2 backdrop-blur-sm">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="item in MOCK_ANALYTICS" :key="item.label" class="card navigation-group p-2!">
                <icon :name="item.icon" size="30" class="shrink-0 text-primary" />
                <div class="flex flex-col items-start text-start">
                  <p class="text-caption">
                    {{ item.label }}
                  </p>
                  <span class="text-lg font-semibold">{{ item.value }}</span>
                </div>
              </div>
            </div>

            <div class="card flex w-full flex-col gap-2">
              <span class="font-semibold">Top Traffic Sources</span>
              <div v-for="referral in MOCK_REFERRALS" :key="referral.source" class="flex items-center justify-between text-sm">
                <div class="navigation-group gap-2">
                  <icon name="mdi:link-variant" size="15" />
                  <span>{{ referral.source }}</span>
                </div>
                <span class="font-semibold">{{ referral.percentage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="cta" class="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center gap-8 overflow-hidden border-t bg-card px-12 py-32 text-center">
    <div class="cta-wrapper-grid" />
    <div class="cta-wrapper-vignette" />

    <div class="flex flex-col items-center gap-4">
      <h2>
        Ready to Build Your Page?
      </h2>

      <p class="text-caption max-w-sm">
        Create an account and get started in minutes!
      </p>

      <nuxt-link to="/sign-in" class="btn-primary">
        <span>Create Your Page</span>
        <icon name="mdi:arrow-right" size="20" />
      </nuxt-link>
    </div>
  </section>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()

useHead({
  title: "Your Link-in-Bio Page!",
  link: [{ rel: "canonical", href: `${baseURL}` }],
  meta: [{ name: "description", content: "Create your own landing page for sharing links to your social media profiles, websites, and more!" }],
})

definePageMeta({
  middleware: "guest",
})
</script>

<style scoped>
h1 {
  font-family: var(--font-display);
  line-height: 3rem;
  max-width: 30rem;
}
h2 {
  font-size: 2.25rem;
  line-height: 2.25rem;
}
@media (min-width: 768px) {
  h1 {
    line-height: 3.875rem;
    font-size: 3.5rem;
  }
}

.wave-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -10;
}

.cta-wrapper-grid {
  position: absolute;
  inset: 0;
  z-index: -10;
  background-position: center;
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, var(--muted) 1px, transparent 1px),
    linear-gradient(to bottom, var(--muted) 1px, transparent 1px);
  opacity: 50%;
}

.cta-wrapper-vignette {
  position: absolute;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 0%, transparent 40%, var(--background) 100%);
}

.text-lead {
  max-width: 28rem;
  color: var(--muted-foreground);
  line-height: 1.5rem;
  font-weight: 500;
}

.section-badge {
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
  background-color: color-mix(in srgb, var(--primary) 10%, transparent);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
}
</style>
