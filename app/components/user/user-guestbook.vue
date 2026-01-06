<template>
  <div class="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
    <transition name="slide-fade">
      <div v-if="isOpen" class="overlay flex w-80 flex-col gap-2 md:w-96">
        <div class="flex items-center justify-between border-b pb-2">
          <h5>
            Leave a message
          </h5>
          <button class="flex items-center transition-transform hover:scale-110" aria-label="Close guestbook" @click="isOpen = false">
            <icon name="mdi:close" size="24" />
          </button>
        </div>

        <form class="flex flex-col gap-2" @submit.prevent="handleSubmitComment">
          <label for="name" class="text-sm font-medium">Name</label>
          <input id="name" v-model="form.name" placeholder="Enter your name" class="rounded-lg!">

          <label for="email" class="text-sm font-medium">Email <span class="text-caption">(optional)</span></label>
          <input
            id="email" v-model="form.email"
            type="email" placeholder="your@email.com"
            class="rounded-lg!"
          >

          <label for="message" class="text-sm font-medium">Message</label>
          <textarea id="message" v-model="form.message" placeholder="Write your message here..." class="h-24 resize-none rounded-lg!" />

          <button type="submit" class="btn-primary self-end">
            <icon name="mdi:send" size="20" />
            <span>Submit</span>
          </button>
        </form>
      </div>
    </transition>

    <button class="btn" :class="{ 'bg-primary! text-background!': isOpen }" aria-label="Toggle guestbook" @click="isOpen = !isOpen">
      <icon name="mdi:message-text" size="25" class="transition-transform" :class="{ 'rotate-12': isOpen }" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId?: string
}>()

const analyticsStore = useAnalyticsStore()
const isOpen = ref(false)
const form = ref({ name: "", email: "", message: "" })

async function handleSubmitComment() {
  if (!props.userId) {
    return
  }

  await analyticsStore.submitComment({
    userId: props.userId,
    name: form.value.name,
    email: form.value.email,
    message: form.value.message,
  })

  form.value.name = ""
  form.value.email = ""
  form.value.message = ""
  isOpen.value = false
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0, 1, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
