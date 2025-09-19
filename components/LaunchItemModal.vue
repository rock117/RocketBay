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
          {{ isEditing ? 'Edit Launch Item' : 'Add Launch Item' }}
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
          <label for="item-name" class="form-label">Name *</label>
          <input
            id="item-name"
            v-model="formData.name"
            type="text"
            class="form-input"
            required
            placeholder="Enter launch item name"
          />
        </div>
        
        <div class="form-group">
          <label for="item-path" class="form-label">Program Path *</label>
          <div class="path-input-group">
            <input
              id="item-path"
              v-model="formData.path"
              type="text"
              class="form-input"
              required
              placeholder="C:\Program Files\App\app.exe"
            />
            <button
              type="button"
              @click="selectProgramFile"
              class="browse-btn"
            >
              Browse
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="item-args" class="form-label">Arguments</label>
          <input
            id="item-args"
            v-model="formData.args"
            type="text"
            class="form-input"
            placeholder="--flag value --option"
          />
          <p class="form-help">Optional command line arguments</p>
        </div>
        
        <div class="form-group">
          <label for="item-working-dir" class="form-label">Working Directory</label>
          <div class="path-input-group">
            <input
              id="item-working-dir"
              v-model="formData.working_dir"
              type="text"
              class="form-input"
              placeholder="C:\Projects\MyProject"
            />
            <button
              type="button"
              @click="selectWorkingDirectory"
              class="browse-btn"
            >
              Browse
            </button>
          </div>
          <p class="form-help">Optional working directory for the process</p>
        </div>
        
        <div class="form-group">
          <label for="item-group" class="form-label">Group</label>
          <select
            id="item-group"
            v-model="formData.group_id"
            class="form-select"
          >
            <option value="">Select a group (optional)</option>
            <option
              v-for="group in groups"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
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
            :disabled="!formData.name.trim() || !formData.path.trim()"
          >
            {{ isEditing ? 'Update Item' : 'Create Item' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useGroupsStore } from '~/stores/groups'
import { useLaunchItemsStore } from '~/stores/launchItems'
import { useUIStore } from '~/stores/ui'

const groupsStore = useGroupsStore()
const launchItemsStore = useLaunchItemsStore()
const uiStore = useUIStore()

const showModal = computed(() => 
  uiStore.showAddItemModal || uiStore.showEditItemModal
)

const isEditing = computed(() => uiStore.showEditItemModal)

const groups = computed(() => groupsStore.groups)

const formData = reactive({
  name: '',
  path: '',
  args: '',
  working_dir: '',
  group_id: ''
})

const resetForm = () => {
  formData.name = ''
  formData.path = ''
  formData.args = ''
  formData.working_dir = ''
  formData.group_id = ''
}

// Watch for editing item changes
watch(() => uiStore.editingItem, (item) => {
  if (item) {
    formData.name = item.name
    formData.path = item.path
    formData.args = Array.isArray(item.args) ? item.args.join(' ') : (item.args || '')
    formData.working_dir = item.working_dir || ''
    formData.group_id = item.group_id || ''
  } else {
    resetForm()
  }
}, { immediate: true })

const closeModal = () => {
  uiStore.setShowAddItemModal(false)
  uiStore.setShowEditItemModal(false)
  resetForm()
}

const selectProgramFile = async () => {
  try {
    console.log('Attempting to open file dialog...')
    console.log('window.__TAURI__:', typeof window !== 'undefined' ? window.__TAURI__ : 'undefined')
    
    // Try to import and use the dialog plugin directly
    const { open } = await import('@tauri-apps/plugin-dialog')
    console.log('Dialog plugin imported successfully')
    
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Executable Files',
        extensions: ['exe', 'bat', 'cmd', 'com', 'msi']
      }, {
        name: 'All Files',
        extensions: ['*']
      }],
      title: 'Select Program File',
      defaultPath: 'C:\\'
    })
    
    console.log('File dialog result:', selected)
    if (selected && selected !== null) {
      formData.path = selected
      console.log('Selected file:', selected)
    }
  } catch (error) {
    console.error('File dialog error:', error)
    uiStore.addNotification({
      type: 'error',
      message: `Dialog error: ${error.message || 'Please enter the file path manually'}`
    })
  }
}

const selectWorkingDirectory = async () => {
  try {
    console.log('Attempting to open folder dialog...')
    console.log('window.__TAURI__:', typeof window !== 'undefined' ? window.__TAURI__ : 'undefined')
    
    // Try to import and use the dialog plugin directly
    const { open } = await import('@tauri-apps/plugin-dialog')
    console.log('Dialog plugin imported successfully')
    
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Select Working Directory',
      defaultPath: 'C:\\'
    })
    
    console.log('Folder dialog result:', selected)
    if (selected && selected !== null) {
      formData.working_dir = selected
      console.log('Selected directory:', selected)
    }
  } catch (error) {
    console.error('Folder dialog error:', error)
    uiStore.addNotification({
      type: 'error',
      message: `Dialog error: ${error.message || 'Please enter the directory path manually'}`
    })
  }
}

const handleSubmit = async () => {
  try {
    const itemData = {
      name: formData.name.trim(),
      path: formData.path.trim(),
      args: formData.args.trim().split(' ').filter(arg => arg.length > 0),
      working_dir: formData.working_dir.trim() || null,
      group_id: formData.group_id || null
    }

    if (isEditing.value) {
      await launchItemsStore.updateItem(uiStore.editingItem.id, itemData)
      uiStore.addNotification({
        type: 'success',
        message: 'Launch item updated successfully'
      })
    } else {
      await launchItemsStore.createItem(itemData)
      uiStore.addNotification({
        type: 'success',
        message: 'Launch item created successfully'
      })
    }
    closeModal()
  } catch (error) {
    uiStore.addNotification({
      type: 'error',
      message: isEditing.value ? 'Failed to update launch item' : 'Failed to create launch item'
    })
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto;
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

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-help {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.path-input-group {
  @apply flex gap-2;
}

.path-input-group .form-input {
  @apply flex-1;
}

.browse-btn {
  @apply px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors;
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
