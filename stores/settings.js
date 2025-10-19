import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    autoSave: true,
    showNotifications: true,
    windowWidth: 1200,
    windowHeight: 800
  }),

  actions: {
    async loadSettings() {
      try {
        const settings = await invoke('get_settings')
        console.log('Loaded settings:', settings)
        this.$patch(settings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },

    async updateSettings(newSettings) {
      try {
        const updatedSettings = await invoke('update_settings', { 
          settings: { ...this.$state, ...newSettings } 
        })
        this.$patch(updatedSettings)
      } catch (error) {
        console.error('Failed to update settings:', error)
        throw error
      }
    },

    async toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      await this.updateSettings({ theme: newTheme })
    },

    setSettings(settings) {
      this.$patch(settings || {})
    }
  }
})
