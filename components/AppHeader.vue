<template>
  <header class="header">
    <div class="header-left">
      <RocketLaunchIcon class="w-8 h-8 text-blue-600" />
      <h1 class="app-title">RocketBay</h1>
    </div>
    <div class="header-right">
      <button 
        @click="settingsStore.toggleTheme()" 
        class="icon-btn" 
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <SunIcon v-if="isDark" class="w-5 h-5" />
        <MoonIcon v-else class="w-5 h-5" />
      </button>
      <button 
        @click="showSettings = true" 
        class="icon-btn" 
        title="Settings"
      >
        <CogIcon class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { RocketLaunchIcon, SunIcon, MoonIcon, CogIcon } from '@heroicons/vue/24/outline'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const showSettings = ref(false)

const isDark = computed(() => settingsStore.theme === 'dark')
</script>

<style scoped>
.header {
  @apply flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.header-left {
  @apply flex items-center gap-3;
}

.app-title {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.header-right {
  @apply flex items-center gap-2;
}

.icon-btn {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}
</style>
