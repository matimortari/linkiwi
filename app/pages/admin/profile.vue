<template>
  <div v-if="user" class="flex w-full flex-col gap-4 md:flex-row">
    <div
      v-motion class="card flex-1"
      :initial="{ opacity: 0, x: -20 }" :visible="{ opacity: 1, x: 0 }"
      :duration="800"
    >
      <header class="space-y-2 border-b py-2">
        <h2 v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :duration="800">
          Profile
        </h2>
        <p class="text-caption">
          Welcome back, <span class="font-semibold text-primary">{{ user.slug }}</span>!
        </p>
      </header>

      <div class="flex flex-col gap-4 p-2">
        <ProfileShareAccount />
        <ProfileLinkList />
        <ProfileIconList />
      </div>
    </div>

    <div class="flex w-full justify-center md:w-1/3">
      <Preview />
    </div>
  </div>

  <div v-else class="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
    <Spinner v-if="loading" />
    <p class="text-caption text-center" :class="{ 'text-destructive-foreground': errors.getUser || errors.getUserBySlug }">
      {{ errors.getUser || errors.getUserBySlug || 'User not found.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { user, loading, errors } = storeToRefs(useUserStore())

useHead({
  title: "Profile",
  link: [{ rel: "canonical", href: "https://linknest.vercel.app/admin/profile" }],
  meta: [{ name: "description", content: "LinkNest profile page." }],
})

definePageMeta({
  layout: "admin",
  middleware: auth,
})
</script>
