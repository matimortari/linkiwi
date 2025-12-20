<template>
  <div class="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
    <button class="btn rounded-full!" @click="isOpen = !isOpen">
      <icon name="mdi:chevron-down" size="30" class="transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition name="collapse">
      <div v-if="isOpen" class="overlay flex max-w-sm flex-col gap-2">
        <h5>
          Leave a message!
        </h5>

        <form class="flex flex-col gap-2" @submit.prevent="submitComment">
          <input v-model="form.name" placeholder="Your name" class="rounded-lg!">
          <input v-model="form.email" placeholder="Your email (optional)" class="rounded-lg!">
          <textarea v-model="form.message" placeholder="Your message..." class="h-20 rounded-lg!" />
          <button type="submit" class="btn-secondary self-end">
            Submit
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId?: string
}>()

const isOpen = ref(false)
const form = ref({ name: "", email: "", message: "" })

async function submitComment() {
  try {
    await $fetch("/api/user/comments", { method: "POST", body: { userId: props.userId, ...form.value } })
    form.value = { name: "", email: "", message: "" }
    isOpen.value = false
  }
  catch (err: any) {
    alert("Failed to submit message")
    console.error(err)
  }
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 300ms ease,
    opacity 200ms ease;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
