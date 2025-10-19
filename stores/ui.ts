import { defineStore } from 'pinia'
import type { Group, LaunchItem, Notification } from '~/types'

interface UIState {
  isLoading: boolean
  showAddGroupModal: boolean
  showEditGroupModal: boolean
  showAddItemModal: boolean
  showEditItemModal: boolean
  showConfigModal: boolean
  editingGroup: Group | null
  editingItem: LaunchItem | null
  notifications: Notification[]
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isLoading: false,
    showAddGroupModal: false,
    showEditGroupModal: false,
    showAddItemModal: false,
    showEditItemModal: false,
    showConfigModal: false,
    editingGroup: null,
    editingItem: null,
    notifications: []
  }),

  actions: {
    setLoading(loading: boolean): void {
      this.isLoading = loading
    },

    setShowAddGroupModal(show: boolean): void {
      this.showAddGroupModal = show
      if (!show) {
        this.editingGroup = null
      }
    },

    setShowEditGroupModal(show: boolean, group: Group | null = null): void {
      this.showEditGroupModal = show
      this.editingGroup = group
    },

    setShowAddItemModal(show: boolean): void {
      this.showAddItemModal = show
      if (!show) {
        this.editingItem = null
      }
    },

    setShowEditItemModal(show: boolean, item: LaunchItem | null = null): void {
      this.showEditItemModal = show
      this.editingItem = item
    },

    setShowConfigModal(show: boolean): void {
      this.showConfigModal = show
    },

    addNotification(notification: Omit<Notification, 'id'>): void {
      const id = Date.now().toString()
      const newNotification: Notification = {
        id,
        type: 'info',
        duration: 3000,
        ...notification
      }
      
      this.notifications.push(newNotification)
      
      // Auto remove notification
      setTimeout(() => {
        this.removeNotification(id)
      }, newNotification.duration || 3000)
    },

    removeNotification(id: string): void {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  }
})
