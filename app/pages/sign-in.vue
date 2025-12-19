<template>
  <div class="relative flex min-h-screen flex-1">
    <div class="z-10 flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
      <div class="w-full">
        <header class="my-4 flex flex-col items-center gap-4 text-center">
          <h1 class="font-display">
            Sign In
          </h1>
          <p class="text-caption">
            Choose a provider to continue.
          </p>
        </header>

        <div class="mx-auto flex max-w-sm flex-col justify-center gap-2 p-4">
          <button v-for="provider in OAUTH_PROVIDERS" :key="provider.name" class="btn" @click="signIn(provider.name)">
            <icon :name="provider.icon" size="25" />
            <span>{{ provider.label }}</span>
          </button>
        </div>

        <p class="mx-auto max-w-sm border-t py-4 text-center text-sm font-medium text-muted-foreground">
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
    </div>

    <!-- Right side image for desktop -->
    <div class="hidden md:block md:w-1/2">
      <img src="/assets/sign-in-image.png" alt="Sign In Background" class="size-full object-cover">
    </div>

    <!-- Fullscreen image for mobile -->
    <img src="/assets/sign-in-image.png" alt="Sign In Background" class="absolute inset-0 -z-10 block size-full object-cover opacity-10 md:hidden">
  </div>
</template>

<script setup lang="ts">
function signIn(provider: string) {
  navigateTo(`/api/auth/${provider}`, { external: true })
}

useHead({
  title: "Sign In",
  meta: [{ name: "description", content: "Linkstashr Sign In page" }],
})
</script>
