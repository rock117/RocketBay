<template>
  <div class="config-panel">
    <div class="config-header">
      <h3 class="config-title">Configuration Management</h3>
      <p class="config-description">Save and load your RocketBay configuration</p>
    </div>

    <div class="config-info" v-if="configStore.configPath">
      <div class="info-item">
        <span class="info-label">Config File:</span>
        <span class="info-value">{{ configStore.configPath }}</span>
      </div>
      <div class="info-item" v-if="configStore.lastSaved">
        <span class="info-label">Last Saved:</span>
        <span class="info-value">{{ formatDate(configStore.lastSaved) }}</span>
      </div>
    </div>

    <div class="config-actions">
      <button 
        @click="saveConfig" 
        :disabled="configStore.isLoading"
        class="config-btn save-btn"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17,21 17,13 7,13 7,21"/>
          <polyline points="7,3 7,8 15,8"/>
        </svg>
        {{ configStore.isLoading ? 'Saving...' : 'Save Configuration' }}
      </button>

      <button 
        @click="loadConfig" 
        :disabled="configStore.isLoading"
        class="config-btn load-btn"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
        {{ configStore.isLoading ? 'Loading...' : 'Load Configuration' }}
      </button>

      <button 
        @click="backupConfig" 
        :disabled="configStore.isLoading"
        class="config-btn backup-btn"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        Create Backup
      </button>
    </div>

    <div class="auto-save-section">
      <div class="auto-save-toggle">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="configStore.autoSave" 
            @change="toggleAutoSave"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
          Auto-save every 5 minutes
        </label>
      </div>
    </div>

    <div class="config-help">
      <h4>About Configuration</h4>
      <ul>
        <li>Configuration is saved to your home directory in <code>~/.rocketbay/config.json</code></li>
        <li>Includes all groups, launch items, and application settings</li>
        <li>Auto-save keeps your configuration synchronized automatically</li>
        <li>Backup creates a copy with <code>.backup</code> extension</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useConfigStore } from '../stores/config.js'
import { onMounted } from 'vue'

const configStore = useConfigStore()

onMounted(async () => {
  await configStore.getConfigPath()
})

const saveConfig = async () => {
  try {
    await configStore.saveConfig()
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const loadConfig = async () => {
  try {
    await configStore.loadConfig()
  } catch (error) {
    console.error('Load failed:', error)
  }
}

const backupConfig = async () => {
  try {
    await configStore.backupConfig()
  } catch (error) {
    console.error('Backup failed:', error)
  }
}

const toggleAutoSave = () => {
  if (configStore.autoSave) {
    configStore.enableAutoSave(5)
  } else {
    configStore.disableAutoSave()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.config-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.config-header {
  margin-bottom: 24px;
}

.config-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.config-description {
  color: #6b7280;
  margin: 0;
}

.config-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: #374151;
}

.info-value {
  color: #6b7280;
  font-family: monospace;
  font-size: 0.875rem;
  word-break: break-all;
  max-width: 60%;
  text-align: right;
}

.config-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.config-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 160px;
}

.config-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.save-btn {
  background: #10b981;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #059669;
}

.load-btn {
  background: #3b82f6;
  color: white;
}

.load-btn:hover:not(:disabled) {
  background: #2563eb;
}

.backup-btn {
  background: #f59e0b;
  color: white;
}

.backup-btn:hover:not(:disabled) {
  background: #d97706;
}

.auto-save-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
  margin-bottom: 24px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: background 0.2s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-input:checked + .toggle-slider {
  background: #10b981;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.config-help {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  padding: 16px;
}

.config-help h4 {
  margin: 0 0 12px 0;
  color: #0c4a6e;
  font-size: 1rem;
}

.config-help ul {
  margin: 0;
  padding-left: 20px;
  color: #0369a1;
}

.config-help li {
  margin-bottom: 4px;
}

.config-help code {
  background: #e0f2fe;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
