// Tauri API types
export interface TauriInvokeFunction {
  (command: string, args?: Record<string, any>): Promise<any>
}

// App Models
export interface LaunchItem {
  id: string
  name: string
  path: string
  args?: string[]
  working_dir?: string
  icon?: string
  shortcut?: string
  order: number
  created_at: string
  updated_at: string
}

export interface AppSettings {
  theme: 'light' | 'dark'
  autoSave: boolean
  showNotifications: boolean
  windowWidth: number
  windowHeight: number
}

export interface AppConfig {
  launch_items: LaunchItem[]
  settings: AppSettings
  last_saved?: string
}

// Request types
export interface CreateLaunchItemRequest {
  name: string
  path: string
  args?: string[]
  working_dir?: string
  icon?: string
  shortcut?: string
  order?: number
}

export interface UpdateLaunchItemRequest {
  id: string
  name?: string
  path?: string
  args?: string[]
  working_dir?: string
  icon?: string
  shortcut?: string
  order?: number
}

// UI Store types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface ContextMenu {
  show: boolean
  x: number
  y: number
}

// Global types
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}
