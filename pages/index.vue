<template>
  <div class="app-container">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <div class="main-container">
      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-header">
          <h2 class="content-title">Launch Items</h2>
          <button 
            @click="showAddItemModal = true" 
            class="btn btn-primary"
          >
            <PlusIcon class="w-4 h-4" />
            Add Launch Item
          </button>
        </div>
        
        <LaunchItemsGrid />
        
        <!-- Empty State -->
        <div v-if="filteredItems.length === 0" class="empty-state">
          <RocketLaunchIcon class="w-16 h-16 text-gray-400" />
          <h3>No Launch Items</h3>
          <p>Create your first launch item to get started</p>
          <button 
            @click="showAddItemModal = true" 
            class="btn btn-primary"
          >
            <PlusIcon class="w-4 h-4" />
            Add Launch Item
          </button>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <LaunchItemModal />
    <ConfigModal />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PlusIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline'
import { useLaunchItemsStore } from '~/stores/launchItems'
import { useUIStore } from '~/stores/ui'
import { useConfigStore } from '~/stores/config'

const launchItemsStore = useLaunchItemsStore()
const uiStore = useUIStore()
const configStore = useConfigStore()

const isLoading = computed(() => uiStore.isLoading)

const filteredItems = computed(() => {
  return launchItemsStore.items
})

const showAddItemModal = computed({
  get: () => uiStore.showAddItemModal,
  set: (value) => uiStore.setShowAddItemModal(value)
})

// Initialize data on page load
onMounted(async () => {
  uiStore.setLoading(true)
  try {
    // Try to load configuration first, fallback to individual stores if needed
    try {
      await configStore.initializeConfig()
    } catch (error) {
      console.warn('Config initialization failed, loading individual stores:', error)
      await launchItemsStore.loadItems()
    }
  } finally {
    uiStore.setLoading(false)
  }
})
</script>

<style scoped>
.app-container {
  @apply h-screen flex flex-col bg-gray-50 dark:bg-gray-900;
}

.main-container {
  @apply flex-1 flex overflow-hidden;
}

.main-content {
  @apply flex-1 flex flex-col p-6 overflow-auto;
}

.content-header {
  @apply flex items-center justify-between mb-6;
}

.content-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white;
}

.empty-state {
  @apply flex flex-col items-center justify-center flex-1 text-center;
}

.empty-state h3 {
  @apply text-xl font-semibold text-gray-900 dark:text-white mt-4;
}

.empty-state p {
  @apply text-gray-600 dark:text-gray-400 mb-6;
}
</style>
