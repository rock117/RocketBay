import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'

export const useConfigStore = defineStore('config', {
  state: () => ({
    isLoading: false,
    lastSaved: null,
    configPath: null,
    autoSave: true,
    saveInterval: null
  }),

  actions: {
    async saveConfig() {
      try {
        this.isLoading = true
        const configPath = await invoke('save_config')
        this.configPath = configPath
        this.lastSaved = new Date().toISOString()
        
        // Show success notification
        const { useUiStore } = await import('./ui.js')
        const uiStore = useUiStore()
        uiStore.addNotification({
          type: 'success',
          message: `Configuration saved to: ${configPath}`
        })
        
        return configPath
      } catch (error) {
        console.error('Failed to save config:', error)
        const { useUiStore } = await import('./ui.js')
        const uiStore = useUiStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to save configuration: ${error}`
        })
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadConfig() {
      try {
        this.isLoading = true
        const config = await invoke('load_config')
        
        // Update stores with loaded data
        const { useGroupsStore } = await import('./groups.js')
        const { useLaunchItemsStore } = await import('./launchItems.js')
        const { useSettingsStore } = await import('./settings.js')
        const { useUiStore } = await import('./ui.js')
        
        const groupsStore = useGroupsStore()
        const launchItemsStore = useLaunchItemsStore()
        const settingsStore = useSettingsStore()
        const uiStore = useUiStore()
        
        groupsStore.setGroups(config.groups)
        launchItemsStore.setLaunchItems(config.launch_items)
        settingsStore.updateSettings(config.settings)
        
        this.lastSaved = config.last_saved
        
        // Show success notification
        uiStore.addNotification({
          type: 'success',
          message: 'Configuration loaded successfully'
        })
        
        return config
      } catch (error) {
        console.error('Failed to load config:', error)
        const { useUiStore } = await import('./ui.js')
        const uiStore = useUiStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to load configuration: ${error}`
        })
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getConfigPath() {
      try {
        const path = await invoke('get_config_path')
        this.configPath = path
        return path
      } catch (error) {
        console.error('Failed to get config path:', error)
        throw error
      }
    },

    async backupConfig() {
      try {
        await invoke('backup_config')
        
        const { useUiStore } = await import('./ui.js')
        const uiStore = useUiStore()
        uiStore.addNotification({
          type: 'success',
          message: 'Configuration backup created successfully'
        })
      } catch (error) {
        console.error('Failed to backup config:', error)
        const { useUiStore } = await import('./ui.js')
        const uiStore = useUiStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to create backup: ${error}`
        })
        throw error
      }
    },

    enableAutoSave(intervalMinutes = 5) {
      this.disableAutoSave() // Clear existing interval
      
      this.autoSave = true
      this.saveInterval = setInterval(() => {
        this.saveConfig().catch(error => {
          console.error('Auto-save failed:', error)
        })
      }, intervalMinutes * 60 * 1000)
      
      console.log(`Auto-save enabled with ${intervalMinutes} minute interval`)
    },

    disableAutoSave() {
      if (this.saveInterval) {
        clearInterval(this.saveInterval)
        this.saveInterval = null
      }
      this.autoSave = false
      console.log('Auto-save disabled')
    },

    async initializeConfig() {
      try {
        // Get config path
        await this.getConfigPath()
        
        // Try to load existing config
        await this.loadConfig()
        
        // Enable auto-save by default
        this.enableAutoSave(5)
      } catch (error) {
        console.warn('Failed to initialize config, using defaults:', error)
      }
    }
  }
})

