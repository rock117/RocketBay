use crate::models::*;
use serde_json;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub struct Storage {
    app_handle: AppHandle,
}

impl Storage {
    pub fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }

    fn get_data_dir(&self) -> Result<PathBuf, Box<dyn std::error::Error>> {
        let app_data_dir = self.app_handle
            .path()
            .app_data_dir()
            .map_err(|e| format!("Failed to get app data dir: {}", e))?;
        
        if !app_data_dir.exists() {
            fs::create_dir_all(&app_data_dir)?;
        }
        
        Ok(app_data_dir)
    }


    pub fn load_launch_items(&self) -> Result<Vec<LaunchItem>, Box<dyn std::error::Error>> {
        let data_dir = self.get_data_dir()?;
        let items_file = data_dir.join("launch_items.json");
        
        if !items_file.exists() {
            return Ok(vec![]);
        }
        
        let content = fs::read_to_string(items_file)?;
        let items: Vec<LaunchItem> = serde_json::from_str(&content)?;
        Ok(items)
    }

    pub fn save_launch_items(&self, items: &[LaunchItem]) -> Result<(), Box<dyn std::error::Error>> {
        let data_dir = self.get_data_dir()?;
        let items_file = data_dir.join("launch_items.json");
        
        let content = serde_json::to_string_pretty(items)?;
        fs::write(items_file, content)?;
        Ok(())
    }

    pub fn load_settings(&self) -> Result<AppSettings, Box<dyn std::error::Error>> {
        let data_dir = self.get_data_dir()?;
        let settings_file = data_dir.join("settings.json");
        
        if !settings_file.exists() {
            return Ok(AppSettings::default());
        }
        
        let content = fs::read_to_string(settings_file)?;
        let settings: AppSettings = serde_json::from_str(&content)?;
        Ok(settings)
    }

    pub fn save_settings(&self, settings: &AppSettings) -> Result<(), Box<dyn std::error::Error>> {
        let data_dir = self.get_data_dir()?;
        let settings_file = data_dir.join("settings.json");
        
        let content = serde_json::to_string_pretty(settings)?;
        fs::write(settings_file, content)?;
        Ok(())
    }
}
