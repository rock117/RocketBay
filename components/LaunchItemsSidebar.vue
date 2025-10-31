<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3 class="sidebar-title">Launch Items</h3>
      <button
        @click="$emit('add-item')"
        class="add-button"
        title="Add Launch Item"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>
    
    <div class="sidebar-content">
      <div v-if="items.length === 0" class="empty-state">
        <RocketLaunchIcon class="w-8 h-8 text-gray-400" />
        <p class="empty-text">No launch items</p>
        <button @click="$emit('add-item')" class="empty-add-btn">
          Add your first item
        </button>
      </div>
      
      <div v-else class="items-list">
        <div
          v-for="item in items"
          :key="item.id"
          :class="['item-card', { 'selected': selectedItemId === item.id }]"
          @click="$emit('select-item', item)"
          @dblclick="$emit('launch-item', item)"
          title="Double-click to launch"
        >
          <div class="item-icon">
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.name"
              class="icon-image"
              @error="handleIconError"
            />
            <CommandLineIcon v-else class="w-6 h-6 text-gray-500 default-icon" />
          </div>
          
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PlusIcon,
  RocketLaunchIcon,
  CommandLineIcon
} from '@heroicons/vue/24/outline'
import type { LaunchItem } from '~/types'

interface Props {
  items: LaunchItem[]
  selectedItemId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'add-item': []
  'select-item': [item: LaunchItem]
  'launch-item': [item: LaunchItem]
  'edit-item': [item: LaunchItem]
  'delete-item': [item: LaunchItem]
}>()


const handleIconError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // Show default icon instead
  const defaultIcon = img.nextElementSibling as HTMLElement
  if (defaultIcon) {
    defaultIcon.style.display = 'block'
  }
}
</script>

<style scoped>
.sidebar {
  @apply w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full;
}

.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.add-button {
  @apply p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors;
}

.sidebar-content {
  @apply flex-1 overflow-y-auto p-2;
}

.empty-state {
  @apply flex flex-col items-center justify-center h-full text-center p-6;
}

.empty-text {
  @apply text-gray-500 dark:text-gray-400 mt-2 mb-4;
}

.empty-add-btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm;
}

.items-list {
  @apply space-y-2;
}

.item-card {
  @apply flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200;
}

.item-card.selected {
  @apply bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500;
}

.item-icon {
  @apply flex-shrink-0 w-10 h-10 mr-3 flex items-center justify-center;
}

.icon-image {
  @apply w-8 h-8 object-contain;
}

.default-icon {
  @apply w-8 h-8 text-gray-400;
}

.item-info {
  @apply flex-1 min-w-0;
}

.item-name {
  @apply text-sm font-medium text-gray-900 dark:text-white truncate;
}
</style>
