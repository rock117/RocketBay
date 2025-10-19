import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import type { AppConfig } from '~/types'

interface ConfigState {
  isLoading: boolean
  lastSaved: string | null
  configPath: string | null
  autoSave: boolean
  saveInterval: NodeJS.Timeout | null
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    isLoading: false,
    lastSaved: null,
    configPath: null,
    autoSave: true,
    saveInterval: null
  }),

  actions: {
    async saveConfig(): Promise<string> {
      try {
        this.isLoading = true
        const configPath = await invoke<string>('save_config')
        this.configPath = configPath
        this.lastSaved = new Date().toISOString()
        
        // Show success notification
        const { useUIStore } = await import('./ui')
        const uiStore = useUIStore()
        uiStore.addNotification({
          type: 'success',
          message: `Configuration saved to: ${configPath}`
        })
        
        return configPath
      } catch (error) {
        console.error('Failed to save config:', error)
        const { useUIStore } = await import('./ui')
        const uiStore = useUIStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to save configuration: ${error}`
        })
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadConfig(): Promise<AppConfig> {
      try {
        this.isLoading = true
        const config = await invoke<AppConfig>('load_config')
        console.log('Loaded config: ===> ', config)
        
        // Update stores with loaded data
        const { useGroupsStore } = await import('./groups')
        const { useLaunchItemsStore } = await import('./launchItems')
        const { useSettingsStore } = await import('./settings')
        const { useUIStore } = await import('./ui')
        
        console.log('import success')

        const groupsStore = useGroupsStore()
        console.log('import useGroupsStore success')
        const launchItemsStore = useLaunchItemsStore()
        console.log('import useLaunchItemsStore success')
        const settingsStore = useSettingsStore()
        console.log('import useSettingsStore success')
        const uiStore = useUIStore()
        console.log('import useUiStore success')
        console.log('use success')
        
        groupsStore.setGroups(config.groups)
        launchItemsStore.setLaunchItems(config.launch_items)
        settingsStore.setSettings(config.settings)
        console.log('set success')
        
        this.lastSaved = config.last_saved || null
        
        // Show success notification
        uiStore.addNotification({
          type: 'success',
          message: 'Configuration loaded successfully'
        })
        
        return config
      } catch (error) {
        console.error('Failed to load config:', error)
        const { useUIStore } = await import('./ui')
        const uiStore = useUIStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to load configuration: ${error}`
        })
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getConfigPath(): Promise<string> {
      try {
        console.log('invoke = ', invoke)
        const path = await invoke<string>('get_config_path')
        this.configPath = path
        return path
      } catch (error) {
        console.error('Failed to get config path:', error)
        throw error
      }
    },

    async backupConfig(): Promise<void> {
      try {
        await invoke('backup_config')
        
        const { useUIStore } = await import('./ui')
        const uiStore = useUIStore()
        uiStore.addNotification({
          type: 'success',
          message: 'Configuration backup created successfully'
        })
      } catch (error) {
        console.error('Failed to backup config:', error)
        const { useUIStore } = await import('./ui')
        const uiStore = useUIStore()
        uiStore.addNotification({
          type: 'error',
          message: `Failed to create backup: ${error}`
        })
        throw error
      }
    },

    enableAutoSave(intervalMinutes: number = 5): void {
      this.disableAutoSave() // Clear existing interval
      
      this.autoSave = true
      this.saveInterval = setInterval(() => {
        this.saveConfig().catch(error => {
          console.error('Auto-save failed:', error)
        })
      }, intervalMinutes * 60 * 1000)
      
      console.log(`Auto-save enabled with ${intervalMinutes} minute interval`)
    },

    disableAutoSave(): void {
      if (this.saveInterval) {
        clearInterval(this.saveInterval)
        this.saveInterval = null
      }
      this.autoSave = false
      console.log('Auto-save disabled')
    },

    async initializeConfig(): Promise<void> {
      try {
        console.log('initializeConfig running...')
        console.log('getConfigPath running...')
        // Get config path
        await this.getConfigPath()
        console.log('loadConfig running...')
        
        // Try to load existing config
        await this.loadConfig()
        console.log('enableAutoSave running...')
        // Enable auto-save by default
        this.enableAutoSave(5)
      } catch (error) {
        console.warn('Failed to initialize config, using defaults:', error)
      }
    }
  }
})
