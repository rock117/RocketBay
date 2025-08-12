<template>
  <div id="app" :class="{ 'dark': isDark }">
    <NuxtPage />
  </div>
</template>

<script setup>
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.theme === 'dark')

// Initialize settings on app start
onMounted(async () => {
  await settingsStore.loadSettings()
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}
</style>
