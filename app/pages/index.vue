<template>
  <section
    id="hero" v-motion
    :initial="{ opacity: 0, y: -40 }" :visible="{ opacity: 1, y: 0 }"
    :duration="800" class="flex min-h-screen flex-col items-center justify-center overflow-hidden border-b-2 px-8 py-24 md:flex-row md:px-24 2xl:min-h-[75vh]"
  >
    <header class="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
      <span class="text-lg text-secondary">
        Your link-in-bio page 🪺
      </span>
      <h1 class="max-w-xl font-display md:text-6xl! 2xl:text-7xl!">
        Keep all your stuff together!
      </h1>
      <p class="max-w-lg font-semibold text-muted-foreground">
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
    :duration="800" class="relative flex flex-col items-center justify-center gap-12 p-12 text-center md:p-24"
  >
    <h2 class="font-display!">
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
        <p class="text-sm text-muted-foreground">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>

  <section id="cta" class="relative z-10 flex min-h-[50vh] flex-col items-center justify-center gap-12 border-y bg-card p-12 text-center md:p-20">
    <div class="cta-wrapper-grid" />
    <div class="cta-wrapper-vignette" />

    <div class="flex flex-col items-center gap-4">
      <h2 class="font-display!">
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

    <p class="text-sm italic transition-opacity ease-in-out" :class="{ 'opacity-0': fading }">
      "{{ randomQuote?.quote }}" -<span class="font-semibold text-primary transition-colors ease-in-out">{{ randomQuote?.author }}</span>
    </p>

    <div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-muted">
      <span class="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-secondary transition-all" :style="{ width: `${progress}%` }" />
    </div>
  </section>
</template>

<script setup lang="ts">
const randomQuote = ref<{ quote: string, author: string }>()
const fading = ref(false)
const progress = ref(0)

let interval: NodeJS.Timeout

onMounted(() => {
  const duration = 10000
  const step = 100
  let elapsed = 0

  const updateQuote = () => {
    fading.value = true
    setTimeout(() => {
      randomQuote.value = QUOTES[Math.floor(Math.random() * QUOTES.length)]
      fading.value = false
      elapsed = 0
      progress.value = 0
    }, 300)
  }

  updateQuote()

  interval = setInterval(() => {
    elapsed += step
    progress.value = Math.min((elapsed / duration) * 100, 100)
    if (elapsed >= duration)
      updateQuote()
  }, step)
})

onBeforeUnmount(() => clearInterval(interval))

useHead({
  title: "Your Link-in-Bio Page!",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app" }],
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
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at center,
    color-mix(in oklab, var(--muted) 0%, transparent 100%) 50%,
    color-mix(in oklab, var(--muted) 100%, var(--background) 0%) 100%
  );
}
</style>
