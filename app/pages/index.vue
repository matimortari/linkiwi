<template>
  <section
    id="hero" v-motion
    :initial="{ opacity: 0, y: -40 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="flex min-h-screen flex-col items-center justify-center overflow-hidden border-b-2 px-4 py-24 md:flex-row md:px-24 2xl:min-h-[90vh]"
  >
    <header class="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
      <span class="text-lg font-semibold text-secondary">
        Your link-in-bio page 🪺
      </span>
      <h1 class="max-w-md font-display text-5xl! md:text-6xl!">
        Keep all your stuff together!
      </h1>
      <p class="max-w-lg font-semibold text-muted-foreground 2xl:text-lg">
        Welcome to <span class="font-bold text-secondary">LinkNest</span>! Your links, profiles, contact info, and more
        in one place. Create and customize your page and share it with your audience.
      </p>
      <nuxt-link to="/sign-in" class="btn-primary">
        <span>Get Started Now!</span>
        <icon name="mdi:arrow-right" size="20" />
      </nuxt-link>
    </header>

    <Carousel />
  </section>

  <section
    id="features" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex flex-col items-center justify-center gap-12 p-12 text-center md:p-24 2xl:p-32"
  >
    <h2 class="font-display">
      Why Choose LinkNest?
    </h2>

    <div class="container mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-4">
      <div
        v-for="(feature, index) in FEATURES" :key="index"
        v-motion :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }" :duration="800"
        :delay="200 * index" class="card flex flex-col gap-4 text-start"
      >
        <div class="flex flex-row items-center gap-4">
          <span class="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary p-2">
            <icon :name="feature.icon" size="25" class="text-[#ebe8e8]" />
          </span>
          <h5>
            {{ feature.title }}
          </h5>
        </div>
        <p class="text-caption">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>

  <section
    id="how-it-works" v-motion
    :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="relative flex flex-col items-center justify-center gap-12 p-12 text-center md:p-24 2xl:p-32"
  >
    <h2 class="font-display">
      How It Works
    </h2>

    <div class="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
      <div
        v-for="(step, index) in STEPS" :key="index"
        v-motion :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }" :duration="800"
        :delay="200 * index" class="card flex flex-col items-center gap-4 text-center"
      >
        <span class="text-primary-foreground flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-xl font-bold">
          {{ index + 1 }}
        </span>
        <h3 class="font-display-alt text-lg">
          {{ step.title }}
        </h3>
        <p class="text-caption">
          {{ step.description }}
        </p>
      </div>
    </div>
  </section>

  <section id="cta" class="relative z-10 flex min-h-[50vh] flex-col items-center justify-center gap-12 border-y bg-card p-12 text-center md:p-20">
    <div class="cta-wrapper-grid" />
    <div class="cta-wrapper-vignette" />

    <div class="flex flex-col items-center gap-4">
      <h2 class="font-display">
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

    <p class="text-sm font-medium italic transition-opacity ease-in-out" :class="{ 'opacity-0': fading }">
      "{{ randomQuote?.quote }}" - <span class="font-bold text-primary transition-colors ease-in-out">{{ randomQuote?.author }}</span>
    </p>

    <div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
      <span key="progress" class="animate-progress absolute top-0 left-0 h-full bg-linear-to-r from-primary to-secondary opacity-20" />
    </div>
  </section>
</template>

<script setup lang="ts">
const randomQuote = ref<{ quote: string, author: string }>()
const fading = ref(false)

const CYCLE = 10000
let cycleInterval: NodeJS.Timeout
let fadeTimeout: NodeJS.Timeout

function setRandomQuote() {
  randomQuote.value = QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

function runCycle() {
  fading.value = true

  fadeTimeout = setTimeout(() => {
    setRandomQuote()
    fading.value = false
  }, 300)
}

onMounted(() => {
  setRandomQuote()
  runCycle()

  cycleInterval = setInterval(runCycle, CYCLE)
})

onBeforeUnmount(() => {
  clearInterval(cycleInterval)
  clearTimeout(fadeTimeout)
})

useHead({
  title: "Your Link-in-Bio Page!",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app" }],
  meta: [{ name: "description", content: "Create your own landing page for sharing links to your social media profiles, websites, and more!" }],
})

definePageMeta({
  middleware: guest,
})

const STEPS = [
  { title: "Sign Up", description: "Create your LinkNest account quickly using Google or GitHub authentication." },
  { title: "Add Links", description: "Add links to your social profiles, websites, and favorite content all in one place." },
  { title: "Customize", description: "Choose your favorite theme, adjust colors, fonts, and layout to match your style." },
]
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
  pointer-events: none;
  border-radius: inherit;

  /* fixed: fade toward transparent so it works in both themes */
  background: radial-gradient(
    ellipse at center,
    color-mix(in oklab, var(--background) 0%, transparent 100%) 10%,
    color-mix(in oklab, var(--background) 100%, transparent 10%) 90%
  );
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
