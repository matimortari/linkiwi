<template>
  <div class="overlay max-w-sm space-y-2">
    <h4>
      Leave a message!
    </h4>

    <form class="flex flex-col gap-2" @submit.prevent="submitComment">
      <input v-model="form.name" placeholder="Your name" class="rounded-lg!">
      <input v-model="form.email" type="email" placeholder="Your email (optional)" class="rounded-lg!">
      <textarea v-model="form.message" placeholder="Your message..." class="h-20 rounded-lg!" />

      <button type="submit" class="btn-primary">
        Submit
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string | undefined
}>()

const form = ref({ name: "", email: "", message: "" })

async function submitComment() {
  try {
    await $fetch("/api/user/comments", { method: "POST", body: { userId: props.userId, ...form.value } })
    form.value = { name: "", email: "", message: "" }
  }
  catch (err: any) {
    alert("Failed to submit message")
    console.error(err)
  }
}
</script>
