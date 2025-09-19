<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<script setup>
// No props needed for this simple loading overlay
</script>

<style scoped>
.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.loading-content {
  @apply bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4;
}

.spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}

.loading-text {
  @apply text-gray-700 dark:text-gray-300 font-medium;
}
</style>
