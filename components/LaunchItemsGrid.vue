<template>
  <div class="launch-items-grid">
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="launch-item-card"
      draggable="true"
      @dragstart="onDragStart($event, item)"
      @click="launchItem(item)"
    >
      <div class="item-header">
        <div class="item-icon">
          <CommandLineIcon class="w-6 h-6" />
        </div>
        <div class="item-actions">
          <button
            @click.stop="editItem(item)"
            class="action-btn"
            title="Edit"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            @click.stop="deleteItem(item)"
            class="action-btn text-red-500"
            title="Delete"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div class="item-content">
        <h3 class="item-name">{{ item.name }}</h3>
        <p class="item-path">{{ item.path }}</p>
        <div v-if="item.args.length > 0" class="item-args">
          <span class="args-label">Args:</span>
          <span class="args-text">{{ item.args.join(' ') }}</span>
        </div>
        <div v-if="item.shortcut" class="item-shortcut">
          <span class="shortcut-label">Shortcut:</span>
          <kbd class="shortcut-key">{{ item.shortcut }}</kbd>
        </div>
      </div>
      
      <div class="item-footer">
        <span class="group-badge">{{ getGroupName(item.group_id) }}</span>
        <button
          @click.stop="launchItem(item)"
          class="launch-button"
        >
          <PlayIcon class="w-4 h-4" />
          Launch
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CommandLineIcon, 
  PencilIcon, 
  TrashIcon, 
  PlayIcon 
} from '@heroicons/vue/24/outline'

import { useGroupsStore } from '~/stores/groups'
import { useLaunchItemsStore } from '~/stores/launchItems'
import { useUIStore } from '~/stores/ui'

const groupsStore = useGroupsStore()
const launchItemsStore = useLaunchItemsStore()
const uiStore = useUIStore()

const filteredItems = computed(() => {
  if (!groupsStore.selectedGroupId) {
    return launchItemsStore.items
  }
  return launchItemsStore.items.filter(item => item.group_id === groupsStore.selectedGroupId)
})

const getGroupName = (groupId) => {
  const group = groupsStore.groups.find(g => g.id === groupId)
  return group?.name || 'Unknown Group'
}

const launchItem = async (item) => {
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

const editItem = (item) => {
  uiStore.setShowEditItemModal(true, item)
}

const deleteItem = async (item) => {
  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
    try {
      await launchItemsStore.deleteItem(item.id)
      uiStore.addNotification({
        type: 'success',
        message: `Deleted "${item.name}"`
      })
    } catch (error) {
      uiStore.addNotification({
        type: 'error',
        message: 'Failed to delete item'
      })
    }
  }
}

const onDragStart = (event, item) => {
  event.dataTransfer.setData('application/json', JSON.stringify(item))
}
</script>

<style scoped>
.launch-items-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.launch-item-card {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600;
}

.item-header {
  @apply flex items-center justify-between mb-3;
}

.item-icon {
  @apply text-blue-600 dark:text-blue-400;
}

.item-actions {
  @apply flex items-center gap-1 opacity-0 transition-opacity;
}

.launch-item-card:hover .item-actions {
  @apply opacity-100;
}

.action-btn {
  @apply p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.item-content {
  @apply mb-4;
}

.item-name {
  @apply text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate;
}

.item-path {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-2 truncate;
}

.item-args {
  @apply mb-2;
}

.args-label {
  @apply text-xs font-medium text-gray-500 dark:text-gray-400;
}

.args-text {
  @apply text-xs text-gray-700 dark:text-gray-300 ml-1;
}

.item-shortcut {
  @apply flex items-center gap-2;
}

.shortcut-label {
  @apply text-xs font-medium text-gray-500 dark:text-gray-400;
}

.shortcut-key {
  @apply text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-300 dark:border-gray-600;
}

.item-footer {
  @apply flex items-center justify-between;
}

.group-badge {
  @apply text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full;
}

.launch-button {
  @apply flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors;
}
</style>
