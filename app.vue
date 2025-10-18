<template>
  <div id="app" :class="{ 'dark': isDark }" @contextmenu="handleContextMenu">
    <NuxtPage />
    
    <!-- Context Menu -->
    <div 
      v-if="contextMenu.show" 
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      class="context-menu"
      @click="hideContextMenu"
    >
      <div class="context-menu-item" @click="openDevTools">
        🔍 检查
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '~/stores/settings'
import { invoke } from '@tauri-apps/api/core'

const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.theme === 'dark')

// Context menu state
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0
})

// Handle right-click context menu
const handleContextMenu = (event) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY
  }
}

// Hide context menu
const hideContextMenu = () => {
  contextMenu.value.show = false
}

// Open DevTools
const openDevTools = async () => {
  try {
    await invoke('open_devtools')
    hideContextMenu()
  } catch (error) {
    console.error('Failed to open devtools:', error)
  }
}

// Hide context menu when clicking elsewhere
onMounted(async () => {
  await settingsStore.loadSettings()
  
  // Add global click listener to hide context menu
  document.addEventListener('click', hideContextMenu)
  document.addEventListener('contextmenu', (e) => {
    // Allow our context menu handler to run first
    setTimeout(() => {
      if (!contextMenu.value.show) {
        hideContextMenu()
      }
    }, 0)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
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

/* Context Menu Styles */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 120px;
  padding: 4px 0;
}

.dark .context-menu {
  background: #2d3748;
  border-color: #4a5568;
  color: white;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.context-menu-item:hover {
  background: #f7fafc;
}

.dark .context-menu-item:hover {
  background: #4a5568;
}
</style>
