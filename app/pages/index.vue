<template>
  <section
    id="hero" v-motion
    :initial="{ opacity: 0, y: -40 }" :visible-once="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex min-h-screen w-full items-center justify-between gap-8 overflow-hidden border-b"
  >
    <img src="/assets/hero-backdrop.svg" alt="Hero background" class="hero-backdrop" aria-hidden="true">

    <div class="section-shell hero-shell">
      <header class="z-1 flex flex-col items-center gap-6 text-center md:items-start md:text-start">
        <h1>
          Keep all your stuff together!
        </h1>
        <p class="text-lead">
          Welcome to <span class="font-semibold text-secondary">LinKiwi</span>! Your links, profiles, contact info, and more
          in one place. Create and customize your page and share it with your audience.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <nuxt-link to="/sign-in" class="btn-primary">
            <span>Get Started Now</span>
            <icon name="mdi:arrow-right" size="25" />
          </nuxt-link>

          <nuxt-link to="#product" class="btn-ghost border!">
            <span>Learn More</span>
            <icon name="mdi:arrow-down" size="25" />
          </nuxt-link>
        </div>
      </header>

      <!-- Controlled bleed wrapper for the carousel -->
      <div class="flex w-full translate-y-24 justify-center md:translate-y-52">
        <Carousel />
      </div>
    </div>
  </section>

  <section
    id="product" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
    :duration="800" class="section-shell relative w-full py-24 text-center"
  >
    <div class="section-header">
      <span class="section-badge">Sharing</span>
      <h2>
        Share Your Page, Your Way
      </h2>
    </div>

    <div class="section-grid">
      <div class="order-1 flex items-center justify-center">
        <div class="product-stack relative grid grid-cols-2 gap-4">
          <div v-for="platform in SHARE_PLATFORMS" :key="platform.id" class="card platform-card flex h-30 w-40 flex-col justify-between md:h-36 md:w-56" :style="{ background: platform.color }">
            <div class="flex items-center justify-between">
              <icon name="mdi:account-circle" size="30" class="text-white/60" />
              <icon :name="platform.icon" size="25" class="text-[#eeeeee]" />
            </div>
            <div class="flex flex-col items-start gap-1 text-start">
              <span class="text-sm font-medium text-[#eeeeee]">@alexjohnson</span>
              <span class="text-xs text-white/50">{{ baseURL.replace(/^https?:\/\//, "") }}/alexjohnson</span>
            </div>
          </div>

          <div class="-right-8 -bottom-8 z-10 navigation-group hidden gap-1.5 rounded-full border bg-card p-4 whitespace-nowrap shadow-sm backdrop-blur-sm md:absolute md:flex">
            <icon name="mdi:link-variant" size="20" class="text-primary" />
            <span class="text-xs font-medium">{{ baseURL.replace(/^https?:\/\//, "") }}/alexjohnson</span>
          </div>
        </div>
      </div>

      <div class="order-2 flex flex-col items-center gap-6 text-center md:items-start md:text-start">
        <p class="text-lead">
          Customize your page with your own style and share your unique URL.
          Whether you're a creator, business, or influencer, LinKiwi makes it
          easy to share and connect with your audience.
        </p>

        <div class="flex flex-col gap-2">
          <div v-for="bullet in PRODUCT_BULLETS" :key="bullet.description" class="navigation-group text-start">
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
    :duration="800" class="relative w-full border-y bg-muted/20 py-24 text-center"
  >
    <div class="section-shell">
      <div class="section-header">
        <span class="section-badge">Analytics</span>
        <h2>
          Track Your Performance
        </h2>
      </div>

      <div class="section-grid">
        <div class="order-2 flex flex-col items-center gap-4 text-center md:order-1 md:items-start md:text-start">
          <p class="text-lead">
            Get insights into how your audience engages with your content.
            Track views, clicks, and traffic sources all in one place.
            Make data-driven decisions to optimize your online presence.
          </p>

          <div class="flex flex-col gap-3">
            <div v-for="bullet in ANALYTICS_BULLETS" :key="bullet.description" class="navigation-group text-start">
              <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
                <icon :name="bullet.icon" size="20" class="text-secondary" />
              </div>
              <span class="text-sm font-medium">{{ bullet.description }}</span>
            </div>
          </div>
        </div>

        <div class="order-1 flex w-full items-center justify-center md:order-2">
          <div class="relative w-full max-w-md">
            <div class="overlay relative space-y-2 backdrop-blur-sm">
              <div class="grid grid-cols-2 gap-2">
                <div v-for="item in MOCK_ANALYTICS" :key="item.label" class="card flex items-start gap-4">
                  <icon :name="item.icon" size="30" class="text-caption-info shrink-0" />
                  <div class="flex h-full flex-1 flex-col items-start text-start">
                    <p class="text-caption">
                      {{ item.label }}
                    </p>
                    <span class="mt-auto w-full self-end text-end text-lg font-semibold">{{ item.value }}</span>
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
    </div>
  </section>

  <section id="cta" class="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center gap-8 overflow-hidden bg-card px-4 py-24 text-center md:px-12">
    <div class="cta-wrapper-grid" />
    <div class="cta-wrapper-vignette" />

    <div class="flex flex-col items-center gap-4 rounded-3xl border border-muted/60 bg-background/80 p-8 shadow-lg backdrop-blur-sm md:p-12">
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
  meta: [{ name: "description", content: "Create your personalized link-in-bio page with LinKiwi. Share your links, profiles, and contact info in one place!" }],
})

definePageMeta({ middleware: "guest" })
</script>

<style scoped>
h1 {
  font-family: var(--font-display);
  line-height: 1.2;
  max-width: 28rem;
  font-size: clamp(2.5rem, 8vw, 3.75rem);
}
h2 {
  font-size: clamp(1.85rem, 5vw, 2.4rem);
  line-height: 1.2;
}

.section-shell {
  margin-inline: auto;
  width: 100%;
  max-width: 1280px;
  padding-inline: 1.25rem;
}

.hero-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding-top: 8rem;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.section-grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
  gap: 3rem;
}

.platform-card {
  position: relative;
  z-index: 1;
  transform-origin: bottom center;
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.15);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
}

.platform-card:nth-child(2) {
  transform: translateY(0.6rem) rotate(-2deg);
  animation-delay: 0.15s;
}
.platform-card:nth-child(3) {
  transform: translateY(-0.2rem) rotate(1.8deg);
  animation-delay: 0.35s;
}
.platform-card:nth-child(4) {
  transform: translateY(0.9rem) rotate(2.4deg);
  animation-delay: 0.55s;
}
.platform-card:hover {
  transform: translateY(-0.2rem) scale(1.02);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.12);
}

@media (min-width: 768px) {
  .section-shell {
    padding-inline: 2rem;
  }

  .hero-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
    gap: 3rem;
    padding-block: 6rem;
  }

  .section-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem;
  }

  h1 {
    line-height: 1.1;
  }
}

.hero-backdrop {
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
  line-height: 1.7;
  font-weight: 500;
}

.section-badge {
  border-radius: var(--border-radius);
  border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
  background-color: color-mix(in srgb, var(--primary) 10%, transparent);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
}
</style>
