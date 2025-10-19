import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import type { Group, CreateGroupRequest, UpdateGroupRequest } from '~/types'

interface GroupsState {
  groups: Group[]
  selectedGroupId: string | null
  loading: boolean
}

export const useGroupsStore = defineStore('groups', {
  state: (): GroupsState => ({
    groups: [],
    selectedGroupId: null,
    loading: false
  }),

  getters: {
    sortedGroups: (state): Group[] => {
      return [...state.groups].sort((a, b) => a.order - b.order)
    },
    
    selectedGroup: (state): Group | undefined => {
      return state.groups.find(g => g.id === state.selectedGroupId)
    }
  },

  actions: {
    async loadGroups(): Promise<void> {
      this.loading = true
      try {
        this.groups = await invoke<Group[]>('get_groups')
      } catch (error) {
        console.error('Failed to load groups:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGroup(groupData: CreateGroupRequest): Promise<Group> {
      try {
        const newGroup = await invoke<Group>('create_group', { request: groupData })
        this.groups.push(newGroup)
        return newGroup
      } catch (error) {
        console.error('Failed to create group:', error)
        throw error
      }
    },

    async updateGroup(groupId: string, updates: Omit<UpdateGroupRequest, 'id'>): Promise<Group> {
      try {
        const updatedGroup = await invoke<Group>('update_group', { 
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

    async deleteGroup(groupId: string): Promise<void> {
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

    selectGroup(groupId: string | null): void {
      this.selectedGroupId = groupId
    },

    toggleGroupExpanded(groupId: string): Promise<Group> {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        return this.updateGroup(groupId, { expanded: !group.expanded })
      }
      throw new Error('Group not found')
    },

    setGroups(groups: Group[]): void {
      this.groups = groups || []
    }
  }
})
