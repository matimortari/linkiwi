<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <div class="bg-muted relative w-1/4 rounded-full">
      <div class="progress-bar from-primary to-secondary h-full w-1/4 rounded-full bg-gradient-to-r" />
    </div>

    <p class="text-muted-foreground font-semibold">
      Loading
      <span class="dot one">.</span>
      <span class="dot two">.</span>
      <span class="dot three">.</span>
    </p>
  </div>
</template>

<style scoped>
.dot {
  opacity: 0;
  animation: fadeIn 1.2s infinite;
}

.dot.one {
  animation-delay: 0s;
}
.dot.two {
  animation-delay: 0.2s;
}
.dot.three {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.progress-bar {
  height: 4px;
  animation: progress 2s ease infinite;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  10% {
    width: 10%;
  }
  50% {
    width: 40%;
  }
  60% {
    width: 60%;
  }
  100% {
    width: 100%;
  }
}
</style>
