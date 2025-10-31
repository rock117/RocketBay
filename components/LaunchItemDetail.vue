<template>
  <div class="detail-panel">
    <div v-if="!selectedItem" class="empty-detail">
      <RocketLaunchIcon class="w-16 h-16 text-gray-300 dark:text-gray-600" />
      <h3 class="empty-title">Select a Launch Item</h3>
      <p class="empty-subtitle">Choose an item from the sidebar to view details</p>
    </div>
    
    <div v-else class="item-detail">
      <!-- Header -->
      <div class="detail-header">
        <div class="item-icon-large">
          <img
            v-if="selectedItem.icon"
            :src="selectedItem.icon"
            :alt="selectedItem.name"
            class="icon-image-large"
            @error="handleIconError"
          />
          <CommandLineIcon v-else class="w-12 h-12 text-gray-400 default-icon-large" />
        </div>
        
        <div class="item-header-info">
          <h2 class="item-title">{{ selectedItem.name }}</h2>
          <p class="item-subtitle">{{ selectedItem.path }}</p>
        </div>
        
      </div>
      
      <!-- Details -->
      <div class="detail-content">
        <!-- Basic Information -->
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Path</span>
            <span class="info-value">{{ selectedItem.path }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Working Directory</span>
            <span class="info-value">{{ selectedItem.working_dir || 'Not specified' }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Arguments</span>
            <span class="info-value">{{ selectedItem.args && selectedItem.args.length > 0 ? selectedItem.args.join(' ') : 'None' }}</span>
          </div>
          
          <div v-if="selectedItem.shortcut" class="info-row">
            <span class="info-label">Shortcut</span>
            <kbd class="shortcut-display">{{ selectedItem.shortcut }}</kbd>
          </div>
        </div>
        
        <!-- Bottom Actions -->
        <div class="bottom-actions">
          <button
            @click="$emit('launch-item', selectedItem)"
            class="action-btn primary-btn"
          >
            <PlayIcon class="w-4 h-4" />
            Launch
          </button>
          <button
            @click="$emit('edit-item', selectedItem)"
            class="action-btn secondary-btn"
          >
            <PencilIcon class="w-4 h-4" />
            Edit
          </button>
          <button
            @click="$emit('delete-item', selectedItem)"
            class="action-btn danger-btn"
          >
            <TrashIcon class="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RocketLaunchIcon,
  CommandLineIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import type { LaunchItem } from '~/types'

interface Props {
  selectedItem?: LaunchItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'launch-item': [item: LaunchItem]
  'edit-item': [item: LaunchItem]
  'delete-item': [item: LaunchItem]
}>()



const handleIconError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.detail-panel {
  @apply flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto;
}

.empty-detail {
  @apply flex flex-col items-center justify-center h-full text-center p-8;
}

.empty-title {
  @apply text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4;
}

.empty-subtitle {
  @apply text-gray-500 dark:text-gray-400 mt-2;
}

.item-detail {
  @apply h-full flex flex-col;
}

.detail-header {
  @apply flex items-start p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.item-icon-large {
  @apply flex-shrink-0 w-16 h-16 mr-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg;
}

.icon-image-large {
  @apply w-12 h-12 object-contain;
}

.default-icon-large {
  @apply w-12 h-12 text-gray-400;
}

.item-header-info {
  @apply flex-1 min-w-0;
}

.item-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.item-subtitle {
  @apply text-gray-600 dark:text-gray-400 mt-1 break-all;
}


.detail-content {
  @apply flex-1 p-6 space-y-6;
}

.info-section {
  @apply bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3;
}

.info-row {
  @apply flex flex-col sm:flex-row sm:items-center gap-2;
}

.info-label {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 min-w-32;
}

.info-value {
  @apply text-sm text-gray-900 dark:text-white break-all font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded;
}

.shortcut-display {
  @apply inline-block px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600;
}

.bottom-actions {
  @apply flex flex-wrap gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors;
}

.primary-btn {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.secondary-btn {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.danger-btn {
  @apply bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40;
}

</style>
