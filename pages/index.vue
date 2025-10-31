<template>
  <div class="app-container">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <div class="main-container">
      <!-- Left Sidebar - Launch Items List -->
      <LaunchItemsSidebar
        :items="filteredItems"
        :selected-item-id="selectedItem?.id"
        @add-item="handleAddItem"
        @select-item="handleSelectItem"
        @launch-item="handleLaunchItem"
        @edit-item="handleEditItem"
        @delete-item="handleDeleteItem"
      />
      
      <!-- Right Panel - Item Details -->
      <LaunchItemDetail
        :selected-item="selectedItem"
        @launch-item="handleLaunchItem"
        @edit-item="handleEditItem"
        @delete-item="handleDeleteItem"
      />
    </div>

    <!-- Modals -->
    <LaunchItemModal />
    <ConfigModal />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { PlusIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline'
import { useLaunchItemsStore } from '~/stores/launchItems'
import { useUIStore } from '~/stores/ui'
import { useConfigStore } from '~/stores/config'
import type { LaunchItem } from '~/types'

const launchItemsStore = useLaunchItemsStore()
const uiStore = useUIStore()
const configStore = useConfigStore()

const selectedItem = ref<LaunchItem | null>(null)

// Watch for changes in launch items and update selected item if it was modified
watch(() => launchItemsStore.items, (newItems) => {
  if (selectedItem.value) {
    const updatedItem = newItems.find(item => item.id === selectedItem.value?.id)
    if (updatedItem) {
      selectedItem.value = updatedItem
    }
  }
}, { deep: true })

const isLoading = computed(() => uiStore.isLoading)

const filteredItems = computed(() => {
  return launchItemsStore.items
})

const showAddItemModal = computed({
  get: () => uiStore.showAddItemModal,
  set: (value) => uiStore.setShowAddItemModal(value)
})

// Event handlers
const handleAddItem = () => {
  uiStore.setShowAddItemModal(true)
}

const handleSelectItem = (item: LaunchItem) => {
  selectedItem.value = item
}

const handleLaunchItem = async (item: LaunchItem) => {
  try {
    await launchItemsStore.launchItem(item)
    uiStore.addNotification({
      type: 'success',
      message: `Launched "${item.name}"`
    })
  } catch (error) {
    uiStore.addNotification({
      type: 'error',
      message: `Failed to launch "${item.name}"`
    })
  }
}

const handleEditItem = (item: LaunchItem) => {
  uiStore.setShowEditItemModal(true, item)
}

const handleDeleteItem = async (item: LaunchItem) => {
  try {
    // Use Tauri dialog for confirmation
    const { ask } = await import('@tauri-apps/plugin-dialog')
    const confirmed = await ask(
      `Are you sure you want to delete "${item.name}"?`,
      { 
        title: 'Confirm Deletion',
        kind: 'warning'
      }
    )
    
    if (confirmed) {
      try {
        await launchItemsStore.deleteItem(item.id)
        
        // Clear selection if deleted item was selected
        if (selectedItem.value?.id === item.id) {
          selectedItem.value = null
        }
        
        // Save configuration after successful deletion
        const { useConfigStore } = await import('~/stores/config')
        const configStore = useConfigStore()
        await configStore.saveConfig()
        
        uiStore.addNotification({
          type: 'success',
          message: `Deleted "${item.name}"`
        })
      } catch (error) {
        uiStore.addNotification({
          type: 'error',
          message: `Failed to delete "${item.name}"`
        })
      }
    }
  } catch (dialogError) {
    // Fallback to browser confirm if Tauri dialog is not available
    console.warn('Tauri dialog not available, using browser confirm:', dialogError)
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await launchItemsStore.deleteItem(item.id)
        
        // Clear selection if deleted item was selected
        if (selectedItem.value?.id === item.id) {
          selectedItem.value = null
        }
        
        // Save configuration after successful deletion
        const { useConfigStore } = await import('~/stores/config')
        const configStore = useConfigStore()
        await configStore.saveConfig()
        
        uiStore.addNotification({
          type: 'success',
          message: `Deleted "${item.name}"`
        })
      } catch (error) {
        uiStore.addNotification({
          type: 'error',
          message: `Failed to delete "${item.name}"`
        })
      }
    }
  }
}

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
  @apply flex-1 flex h-full overflow-hidden;
}
</style>
