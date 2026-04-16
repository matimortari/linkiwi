<template>
  <section class="auth-shell">
    <div class="auth-backdrop" aria-hidden="true" />

    <div class="auth-grid">
      <div class="flex flex-col justify-center gap-4 p-4 md:p-12">
        <header class="flex flex-col gap-4">
          <h1>
            Sign In
          </h1>
          <p class="text-caption">
            Choose your preferred provider and access your dashboard.
          </p>
          <span v-if="errorMessage" class="text-caption-danger auth-error">{{ errorMessage }}</span>
        </header>

        <div class="flex flex-col items-start gap-2">
          <button v-for="provider in OAUTH_PROVIDERS" :key="provider.name" class="btn-ghost gap-4!" @click="signIn(provider.name)">
            <icon :name="provider.icon" size="35" />
            <span>{{ provider.label }}</span>
            <icon name="mdi:arrow-right" size="20" class="text-muted-foreground!" />
          </button>
        </div>

        <p class="text-caption border-t py-4">
          By signing in, you agree to our
          <nuxt-link to="/legal/terms" class="text-primary hover:underline">
            Terms of Service
          </nuxt-link>
          and
          <nuxt-link to="/legal/privacy" class="text-primary hover:underline">
            Privacy Policy.
          </nuxt-link>
        </p>
      </div>

      <aside class="auth-aside" aria-hidden="true">
        <img src="/assets/sign-in-image.png" alt="Sign In Background" class="size-full object-cover">
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
const { public: { baseURL } } = useRuntimeConfig()
const route = useRoute()

const errorMessage = computed(() => {
  const error = route.query.error as string | undefined
  if (!error) {
    return null
  }

  const messages: Record<string, string> = {
    google_oauth_failed: "Google sign in failed. Please try again.",
    github_oauth_failed: "GitHub sign in failed. Please try again.",
    session_expired: "Your session has expired. Please sign in again.",
    session_timeout: "You were signed out due to inactivity.",
  }

  return messages[error] || "Authentication failed. Please try again."
})

useHead({
  title: "Sign In",
  link: [{ rel: "canonical", href: `${baseURL}/sign-in` }],
  meta: [{ name: "description", content: "Sign in to your LinKiwi account" }],
})
</script>

<style scoped>
.auth-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 4rem;
}

.auth-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px circle at 80% 20%, color-mix(in srgb, var(--secondary) 20%, transparent), transparent 55%),
    radial-gradient(700px circle at 20% 80%, color-mix(in srgb, var(--primary) 20%, transparent), transparent 60%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--card) 85%, transparent),
      color-mix(in srgb, var(--background) 95%, transparent)
    );
  z-index: -1;
}

.auth-grid {
  display: grid;
  min-height: calc(100vh - 12rem);
  width: min(100%, 1500px);
  max-width: 1500px;
  overflow: hidden;
  border: var(--border-style);
  border-radius: 1.5rem;
  background-color: color-mix(in srgb, var(--background) 85%, transparent);
  box-shadow: 0 25px 60px -40px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}

.auth-aside {
  display: none;
  position: relative;
  min-height: 100%;
  border-left: 1px solid var(--muted);
}
.auth-aside::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(35deg, rgba(0, 0, 0, 0.55), transparent 60%);
}

@media (min-width: 768px) {
  .auth-grid {
    grid-template-columns: minmax(0, 1fr) minmax(430px, 60%);
  }

  .auth-aside {
    display: block;
  }
}
</style>
