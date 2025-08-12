<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Groups</h2>
      <button 
        @click="uiStore.setShowAddGroupModal(true)" 
        class="icon-btn" 
        title="Add Group"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>
    
    <div class="groups-list">
      <!-- All Items Group -->
      <div 
        class="group-item"
        :class="{ 'active': !groupsStore.selectedGroupId }"
        @click="groupsStore.selectGroup(null)"
      >
        <div class="group-content">
          <div class="group-icon">
            <FolderIcon class="w-5 h-5" />
          </div>
          <span class="group-name">All Items</span>
          <span class="item-count">{{ totalItemsCount }}</span>
        </div>
      </div>

      <!-- User Groups -->
      <div
        v-for="group in groupsStore.sortedGroups"
        :key="group.id"
        class="group-item"
        :class="{ 'active': groupsStore.selectedGroupId === group.id }"
        @click="groupsStore.selectGroup(group.id)"
        @drop="onDrop($event, group.id)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="group-content">
          <button
            @click.stop="groupsStore.toggleGroupExpanded(group.id)"
            class="expand-btn"
          >
            <ChevronRightIcon 
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-90': group.expanded }"
            />
          </button>
          
          <div 
            class="group-icon"
            :style="{ color: group.color || '#6b7280' }"
          >
            <component 
              :is="getIconComponent(group.icon)" 
              class="w-5 h-5" 
            />
          </div>
          
          <span class="group-name">{{ group.name }}</span>
          <span class="item-count">{{ getGroupItemCount(group.id) }}</span>
          
          <div class="group-actions">
            <button
              @click.stop="editGroup(group)"
              class="action-btn"
              title="Edit Group"
            >
              <PencilIcon class="w-3 h-3" />
            </button>
            <button
              @click.stop="deleteGroup(group)"
              class="action-btn text-red-500"
              title="Delete Group"
            >
              <TrashIcon class="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <!-- Group Items (when expanded) -->
        <div v-if="group.expanded" class="group-items">
          <div
            v-for="item in getGroupItems(group.id)"
            :key="item.id"
            class="group-item-entry"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            <div class="item-icon">
              <CommandLineIcon class="w-4 h-4" />
            </div>
            <span class="item-name">{{ item.name }}</span>
            <button
              @click.stop="launchItem(item)"
              class="launch-btn"
              title="Launch"
            >
              <PlayIcon class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { 
  PlusIcon, 
  FolderIcon, 
  ChevronRightIcon, 
  PencilIcon, 
  TrashIcon,
  CommandLineIcon,
  PlayIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

import { useGroupsStore } from '~/stores/groups'
import { useLaunchItemsStore } from '~/stores/launchItems'
import { useUIStore } from '~/stores/ui'

const groupsStore = useGroupsStore()
const launchItemsStore = useLaunchItemsStore()
const uiStore = useUIStore()

const totalItemsCount = computed(() => launchItemsStore.items.length)

const getGroupItemCount = (groupId) => {
  return launchItemsStore.items.filter(item => item.group_id === groupId).length
}

const getGroupItems = (groupId) => {
  return launchItemsStore.items.filter(item => item.group_id === groupId)
}

const getIconComponent = (iconName) => {
  const iconMap = {
    'fas fa-folder': FolderIcon,
    'fas fa-code': CodeBracketIcon,
    'fas fa-globe': GlobeAltIcon,
    'fas fa-tools': WrenchScrewdriverIcon,
  }
  return iconMap[iconName] || FolderIcon
}

const editGroup = (group) => {
  uiStore.setShowEditGroupModal(true, group)
}

const deleteGroup = async (group) => {
  if (confirm(`Are you sure you want to delete the group "${group.name}"? This will also delete all launch items in this group.`)) {
    try {
      await groupsStore.deleteGroup(group.id)
      uiStore.addNotification({
        type: 'success',
        message: `Group "${group.name}" deleted successfully`
      })
    } catch (error) {
      uiStore.addNotification({
        type: 'error',
        message: 'Failed to delete group'
      })
    }
  }
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

// Drag and Drop functionality
const onDragStart = (event, item) => {
  event.dataTransfer.setData('application/json', JSON.stringify(item))
}

const onDrop = async (event, targetGroupId) => {
  event.preventDefault()
  const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
  
  if (itemData.group_id !== targetGroupId) {
    try {
      await launchItemsStore.moveItemToGroup(itemData.id, targetGroupId)
      uiStore.addNotification({
        type: 'success',
        message: `Moved "${itemData.name}" to new group`
      })
    } catch (error) {
      uiStore.addNotification({
        type: 'error',
        message: 'Failed to move item'
      })
    }
  }
}
</script>

<style scoped>
.sidebar {
  @apply w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col;
}

.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.icon-btn {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.groups-list {
  @apply flex-1 overflow-y-auto p-2;
}

.group-item {
  @apply mb-1 rounded-lg cursor-pointer transition-colors;
}

.group-item:hover {
  @apply bg-gray-50 dark:bg-gray-700;
}

.group-item.active {
  @apply bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800;
}

.group-content {
  @apply flex items-center gap-2 p-3 relative;
}

.expand-btn {
  @apply p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors;
}

.group-icon {
  @apply flex-shrink-0;
}

.group-name {
  @apply flex-1 text-sm font-medium text-gray-900 dark:text-white truncate;
}

.item-count {
  @apply text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full;
}

.group-actions {
  @apply flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity;
}

.group-item:hover .group-actions {
  @apply opacity-100;
}

.action-btn {
  @apply p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors;
}

.group-items {
  @apply ml-6 border-l border-gray-200 dark:border-gray-700;
}

.group-item-entry {
  @apply flex items-center gap-2 p-2 ml-4 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.item-icon {
  @apply text-gray-500 dark:text-gray-400;
}

.item-name {
  @apply flex-1 text-sm text-gray-700 dark:text-gray-300 truncate;
}

.launch-btn {
  @apply p-1 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors;
}
</style>
