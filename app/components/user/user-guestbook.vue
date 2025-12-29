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

        <form class="flex flex-col gap-2" @submit.prevent="handleSubmitComment">
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

const analyticsStore = useAnalyticsStore()
const { errors } = storeToRefs(analyticsStore)
const isOpen = ref(false)
const form = ref({ name: "", email: "", message: "" })

async function handleSubmitComment() {
  errors.value.submitComment = null

  try {
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
  catch (err: any) {
    errors.value.submitComment = err.data?.message || "Failed to submit comment"
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
