import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    showAddGroupModal: false,
    showEditGroupModal: false,
    showAddItemModal: false,
    showEditItemModal: false,
    editingGroup: null,
    editingItem: null,
    notifications: []
  }),

  actions: {
    setLoading(loading) {
      this.isLoading = loading
    },

    setShowAddGroupModal(show) {
      this.showAddGroupModal = show
      if (!show) {
        this.editingGroup = null
      }
    },

    setShowEditGroupModal(show, group = null) {
      this.showEditGroupModal = show
      this.editingGroup = group
    },

    setShowAddItemModal(show) {
      this.showAddItemModal = show
      if (!show) {
        this.editingItem = null
      }
    },

    setShowEditItemModal(show, item = null) {
      this.showEditItemModal = show
      this.editingItem = item
    },

    addNotification(notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        type: 'info',
        duration: 3000,
        ...notification
      })
      
      // Auto remove notification
      setTimeout(() => {
        this.removeNotification(id)
      }, notification.duration || 3000)
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  }
})
