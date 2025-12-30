<template>
  <section
    id="hero" v-motion
    :initial="{ opacity: 0, y: -40 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="flex min-h-screen flex-col items-center justify-center overflow-hidden border-b-2 px-4 py-24 md:flex-row md:px-24"
  >
    <header class="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
      <span class="font-semibold text-secondary">Your link-in-bio page</span>

      <h1 class="max-w-md font-display text-5xl! leading-20 md:text-6xl! 2xl:max-w-lg 2xl:md:text-7xl!">
        Keep all your stuff together!
      </h1>

      <p class="text-lead">
        Welcome to <span class="font-semibold text-secondary">Linkstashr</span>! Your links, profiles, contact info, and more
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
    :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex flex-col items-center justify-center gap-12 p-12 md:p-32"
  >
    <h2>
      Create Your Page In Minutes
    </h2>

    <div class="container mx-auto grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div class="flex items-center justify-center">
        <div class="relative size-64 md:size-80">
          <div class="absolute inset-0 animate-pulse rounded-2xl bg-linear-to-br from-primary to-secondary opacity-20 blur-2xl" />

          <div class="overlay relative flex size-full flex-col items-center justify-center gap-4">
            <icon name="mdi:link-variant" size="60" class="text-primary" />
            <div class="flex flex-col gap-2 text-center">
              <span v-for="i in 3" :key="i" class="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 text-start">
        <p class="text-lead">
          Customize your page with your own style and share your unique URL with your audience.
          Whether you're a creator, business, or influencer, Linkstashr makes it easy to connect all your online presence in one place.
        </p>

        <div class="flex flex-col gap-2">
          <div v-for="bullet in PRODUCT_BULLETS" :key="bullet.description" class="navigation-group">
            <icon :name="bullet.icon" size="25" class="text-secondary" />
            <span class="font-medium">{{ bullet.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section
    id="analytics" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex flex-col items-center justify-center gap-12 bg-muted/30 p-12 md:p-32"
  >
    <h2>
      Track Your Performance
    </h2>

    <div class="container mx-auto grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div class="flex flex-col gap-4 text-start">
        <p class="text-lead">
          Get insights into how your audience engages with your content.
          Track page views, link clicks, and traffic sources all in one place.
          Make data-driven decisions to optimize your online presence.
        </p>

        <div class="flex flex-col gap-2">
          <div v-for="bullet in ANALYTICS_BULLETS" :key="bullet.description" class="navigation-group">
            <icon :name="bullet.icon" size="25" class="text-secondary" />
            <span class="font-medium">{{ bullet.description }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-0 animate-pulse rounded-2xl bg-linear-to-br from-secondary to-primary opacity-20 blur-2xl" />

          <div class="overlay relative space-y-1 backdrop-blur-sm">
            <div class="grid grid-cols-2 gap-1">
              <div v-for="item in MOCK_ANALYTICS" :key="item.label" class="card navigation-group">
                <icon :name="item.icon" size="30" class="text-primary" />
                <div class="flex flex-col items-start">
                  <p class="text-caption">
                    {{ item.label }}
                  </p>
                  <span class="font-semibold md:text-lg 2xl:text-xl">{{ item.value }}</span>
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

  <section id="cta" class="relative z-10 flex min-h-[50vh] flex-col items-center justify-center gap-8 border-y bg-card p-12 text-center md:p-32">
    <div class="cta-wrapper-grid" />
    <div class="cta-wrapper-vignette" />

    <div class="flex flex-col items-center gap-4">
      <h2>
        Ready to Try?
      </h2>

      <p class="text-lg font-semibold">
        Create an account and build your page today!
      </p>

      <nuxt-link to="/sign-in" class="btn-secondary">
        <span>Get Started</span>
        <icon name="mdi:arrow-right" size="20" />
      </nuxt-link>
    </div>

    <p class="text-caption italic transition-opacity ease-in-out" :class="{ 'opacity-0': fading }">
      "{{ randomQuote?.quote }}" - <span class="text-primary">{{ randomQuote?.author }}</span>
    </p>

    <div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
      <span key="progress" class="animate-progress absolute top-0 left-0 h-full bg-linear-to-r from-primary to-secondary opacity-20" />
    </div>
  </section>
</template>

<script setup lang="ts">
const randomQuote = ref<{ quote: string, author: string }>()
const fading = ref(false)
let cycleInterval: ReturnType<typeof setInterval>
let fadeTimeout: ReturnType<typeof setTimeout>

function setRandomQuote() {
  randomQuote.value = QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

function runCycle() {
  fading.value = true

  fadeTimeout = setTimeout(() => {
    setRandomQuote()
    fading.value = false
  }, 500)
}

onMounted(() => {
  setRandomQuote()
  runCycle()
  cycleInterval = setInterval(runCycle, 10000)
})

onBeforeUnmount(() => {
  clearInterval(cycleInterval)
  clearTimeout(fadeTimeout)
})

useHead({
  title: "Your Link-in-Bio Page!",
  link: [{ rel: "canonical", href: "https://linkstashr.vercel.app" }],
  meta: [{ name: "description", content: "Create your own landing page for sharing links to your social media profiles, websites, and more!" }],
})

definePageMeta({
  middleware: guest,
})
</script>

<style scoped>
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
  gap: 1rem;
}

.cta-wrapper-vignette {
  position: absolute;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(ellipse at center, transparent 0%, transparent 40%, var(--background) 100%);
}

.text-lead {
  max-width: 28rem;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.animate-progress {
  animation: progress 10s linear infinite;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
