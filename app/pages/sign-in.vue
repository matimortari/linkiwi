<template>
  <div class="relative flex min-h-screen w-full flex-1">
    <div class="z-10 flex w-full flex-col items-center justify-center gap-4 py-12 text-center md:w-1/2">
      <header class="flex flex-col items-center gap-4">
        <h1 class="font-display">
          Sign In
        </h1>
        <p class="text-caption">
          Choose a provider to continue.
        </p>
        <span v-if="errorMessage" class="text-danger">{{ errorMessage }}</span>
      </header>

      <div class="flex w-full max-w-xs flex-col gap-2">
        <button v-for="provider in OAUTH_PROVIDERS" :key="provider.name" class="btn" @click="signIn(provider.name)">
          <icon :name="provider.icon" size="25" />
          <span>{{ provider.label }}</span>
        </button>
      </div>

      <p class="max-w-xs border-t p-4 text-sm font-medium text-muted-foreground">
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

    <!-- Right side image for desktop -->
    <div class="hidden border-l-2 md:block md:w-1/2">
      <img src="/assets/sign-in-image.png" alt="Sign In Background" class="size-full object-cover">
    </div>

    <!-- Fullscreen image for mobile -->
    <img src="/assets/sign-in-image.png" alt="Sign In Background" class="absolute inset-0 -z-10 block size-full object-cover opacity-10 md:hidden">
  </div>
</template>

<script setup lang="ts">
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

function signIn(provider: string) {
  navigateTo(`/api/auth/${provider}`, { external: true })
}

useHead({
  title: "Sign In",
  meta: [{ name: "description", content: "AllLinks Sign In page" }],
})
</script>
