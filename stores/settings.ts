import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import type { AppSettings } from '~/types'

interface SettingsState extends AppSettings {}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    autoSave: true,
    showNotifications: true,
    windowWidth: 1200,
    windowHeight: 800
  }),

  actions: {
    async loadSettings(): Promise<void> {
      try {
        const settings = await invoke<AppSettings>('get_settings')
        console.log('Loaded settings:', settings)
        this.$patch(settings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },

    async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
      try {
        const updatedSettings = await invoke<AppSettings>('update_settings', { 
          settings: { ...this.$state, ...newSettings } 
        })
        this.$patch(updatedSettings)
      } catch (error) {
        console.error('Failed to update settings:', error)
        throw error
      }
    },

    async toggleTheme(): Promise<void> {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      await this.updateSettings({ theme: newTheme })
    },

    setSettings(settings: Partial<AppSettings>): void {
      this.$patch(settings || {})
    }
  }
})
