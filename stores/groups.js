import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [],
    selectedGroupId: null,
    loading: false
  }),

  getters: {
    sortedGroups: (state) => {
      return [...state.groups].sort((a, b) => a.order - b.order)
    },
    
    selectedGroup: (state) => {
      return state.groups.find(g => g.id === state.selectedGroupId)
    }
  },

  actions: {
    async loadGroups() {
      this.loading = true
      try {
        this.groups = await invoke('get_groups')
      } catch (error) {
        console.error('Failed to load groups:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGroup(groupData) {
      try {
        const newGroup = await invoke('create_group', { request: groupData })
        this.groups.push(newGroup)
        return newGroup
      } catch (error) {
        console.error('Failed to create group:', error)
        throw error
      }
    },

    async updateGroup(groupId, updates) {
      try {
        const updatedGroup = await invoke('update_group', { 
          request: { id: groupId, ...updates } 
        })
        const index = this.groups.findIndex(g => g.id === groupId)
        if (index !== -1) {
          this.groups[index] = updatedGroup
        }
        return updatedGroup
      } catch (error) {
        console.error('Failed to update group:', error)
        throw error
      }
    },

    async deleteGroup(groupId) {
      try {
        await invoke('delete_group', { groupId })
        this.groups = this.groups.filter(g => g.id !== groupId)
        if (this.selectedGroupId === groupId) {
          this.selectedGroupId = null
        }
      } catch (error) {
        console.error('Failed to delete group:', error)
        throw error
      }
    },

    selectGroup(groupId) {
      this.selectedGroupId = groupId
    },

    toggleGroupExpanded(groupId) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        this.updateGroup(groupId, { expanded: !group.expanded })
      }
    }
  }
})
