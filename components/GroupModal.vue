<template>
  <div
    v-if="showModal"
    class="modal-overlay"
    @click="closeModal"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEditing ? 'Edit Group' : 'Add Group' }}
        </h3>
        <button
          @click="closeModal"
          class="close-btn"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label for="group-name" class="form-label">Group Name</label>
          <input
            id="group-name"
            v-model="formData.name"
            type="text"
            class="form-input"
            required
            placeholder="Enter group name"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-picker">
            <input
              v-model="formData.color"
              type="color"
              class="color-input"
            />
            <div class="color-presets">
              <button
                v-for="color in colorPresets"
                :key="color"
                type="button"
                class="color-preset"
                :class="{ 'active': formData.color === color }"
                :style="{ backgroundColor: color }"
                @click="formData.color = color"
              />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Icon</label>
          <div class="icon-picker">
            <div class="icon-presets">
              <button
                v-for="icon in iconPresets"
                :key="icon.value"
                type="button"
                class="icon-preset"
                :class="{ 'active': formData.icon === icon.value }"
                @click="formData.icon = icon.value"
                :title="icon.name"
              >
                <component :is="icon.component" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!formData.name.trim()"
          >
            {{ isEditing ? 'Update Group' : 'Create Group' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { 
  XMarkIcon,
  FolderIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'

import { useGroupsStore } from '~/stores/groups'
import { useUIStore } from '~/stores/ui'

const groupsStore = useGroupsStore()
const uiStore = useUIStore()

const showModal = computed(() => 
  uiStore.showAddGroupModal || uiStore.showEditGroupModal
)

const isEditing = computed(() => uiStore.showEditGroupModal)

const colorPresets = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16'  // lime
]

const iconPresets = [
  { name: 'Folder', value: 'fas fa-folder', component: FolderIcon },
  { name: 'Code', value: 'fas fa-code', component: CodeBracketIcon },
  { name: 'Globe', value: 'fas fa-globe', component: GlobeAltIcon },
  { name: 'Tools', value: 'fas fa-tools', component: WrenchScrewdriverIcon },
  { name: 'Apps', value: 'fas fa-cube', component: CubeIcon },
  { name: 'Database', value: 'fas fa-database', component: CircleStackIcon }
]

const formData = reactive({
  name: '',
  color: '#3b82f6',
  icon: 'fas fa-folder'
})

const resetForm = () => {
  formData.name = ''
  formData.color = '#3b82f6'
  formData.icon = 'fas fa-folder'
}

// Watch for editing group changes
watch(() => uiStore.editingGroup, (group) => {
  if (group) {
    formData.name = group.name
    formData.color = group.color || '#3b82f6'
    formData.icon = group.icon || 'fas fa-folder'
  } else {
    resetForm()
  }
}, { immediate: true })

const closeModal = () => {
  uiStore.setShowAddGroupModal(false)
  uiStore.setShowEditGroupModal(false)
  resetForm()
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await groupsStore.updateGroup(uiStore.editingGroup.id, {
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon
      })
      uiStore.addNotification({
        type: 'success',
        message: 'Group updated successfully'
      })
    } else {
      await groupsStore.createGroup({
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon
      })
      uiStore.addNotification({
        type: 'success',
        message: 'Group created successfully'
      })
    }
    closeModal()
  } catch (error) {
    uiStore.addNotification({
      type: 'error',
      message: isEditing.value ? 'Failed to update group' : 'Failed to create group'
    })
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.close-btn {
  @apply p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.modal-body {
  @apply p-6 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.color-picker {
  @apply flex items-center gap-3;
}

.color-input {
  @apply w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer;
}

.color-presets {
  @apply flex gap-2;
}

.color-preset {
  @apply w-6 h-6 rounded-full border-2 border-transparent cursor-pointer transition-all;
}

.color-preset.active {
  @apply border-gray-400 dark:border-gray-300 scale-110;
}

.icon-presets {
  @apply grid grid-cols-6 gap-2;
}

.icon-preset {
  @apply p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.icon-preset.active {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600;
}

.form-actions {
  @apply flex justify-end gap-3 pt-4;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-secondary {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
