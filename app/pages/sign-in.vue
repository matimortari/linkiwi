<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <header class="my-4 flex flex-col items-center justify-center gap-2">
      <h2>
        Sign In
      </h2>
    </header>

    <div class="my-4 flex flex-col items-center gap-4">
      <p class="text-muted-foreground text-lg font-semibold">
        Choose a provider to continue.
      </p>

      <div class="flex flex-row items-center gap-4">
        <button v-for="provider in OAUTH_PROVIDERS" :key="provider.name" class="btn" @click="signIn(provider.name)">
          <icon :name="provider.icon" size="25" />
          <span>{{ provider.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function signIn(provider: string) {
  navigateTo(`/api/auth/${provider}`, { external: true })
}

useHead({
  title: "Sign In",
  meta: [{ name: "description", content: "LinkNest Sign In page" }],
})
</script>
