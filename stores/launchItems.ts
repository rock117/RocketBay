import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import type { LaunchItem, CreateLaunchItemRequest, UpdateLaunchItemRequest } from '~/types'

interface LaunchItemsState {
  items: LaunchItem[]
  loading: boolean
}

export const useLaunchItemsStore = defineStore('launchItems', {
  state: (): LaunchItemsState => ({
    items: [],
    loading: false
  }),

  getters: {
    getItemsByGroup: (state) => (groupId: string): LaunchItem[] => {
      return state.items.filter(item => item.group_id === groupId)
    }
  },

  actions: {
    async loadItems(): Promise<void> {
      this.loading = true
      try {
        this.items = await invoke<LaunchItem[]>('get_launch_items')
        console.log('Loaded launch items:', this.items)
      } catch (error) {
        console.error('Failed to load launch items:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createItem(itemData: CreateLaunchItemRequest): Promise<LaunchItem> {
      try {
        const newItem = await invoke<LaunchItem>('create_launch_item', { request: itemData })
        this.items.push(newItem)
        return newItem
      } catch (error) {
        console.error('Failed to create launch item:', error)
        throw error
      }
    },

    async updateItem(itemId: string, updates: Omit<UpdateLaunchItemRequest, 'id'>): Promise<LaunchItem> {
      try {
        const updatedItem = await invoke<LaunchItem>('update_launch_item', { 
          request: { id: itemId, ...updates } 
        })
        const index = this.items.findIndex(item => item.id === itemId)
        if (index !== -1) {
          this.items[index] = updatedItem
        }
        return updatedItem
      } catch (error) {
        console.error('Failed to update launch item:', error)
        throw error
      }
    },

    async deleteItem(itemId: string): Promise<void> {
      try {
        await invoke('delete_launch_item', { itemId })
        this.items = this.items.filter(item => item.id !== itemId)
      } catch (error) {
        console.error('Failed to delete launch item:', error)
        throw error
      }
    },

    async launchItem(item: LaunchItem): Promise<void> {
      try {
        await invoke('launch_process', { item })
      } catch (error) {
        console.error('Failed to launch process:', error)
        // Try to show an error dialog; ignore if dialog is not permitted by ACL
        try {
          const { message } = await import('@tauri-apps/plugin-dialog')
          await message(
            `启动失败：${String(error)}`,
            { title: 'Launch Failed', kind: 'error' }
          )
        } catch (err) {
          // noop if dialog API not available
          console.error('Failed to show error dialog:', err)
        }
        throw error
      }
    },

    moveItemToGroup(itemId: string, newGroupId: string): Promise<LaunchItem> {
      return this.updateItem(itemId, { group_id: newGroupId })
    },

    setLaunchItems(items: LaunchItem[]): void {
      this.items = items || []
    }
  }
})
