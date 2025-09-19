use std::fs;
use std::path::PathBuf;
use serde_json;
use dirs;
use crate::models::AppConfig;

const CONFIG_DIR: &str = ".rocketbay";
const CONFIG_FILE: &str = "config.json";

pub struct ConfigManager;

impl ConfigManager {
    /// Get the path to the configuration directory
    pub fn get_config_dir() -> Result<PathBuf, String> {
        let home = dirs::home_dir().ok_or("Could not find home directory")?;
        Ok(home.join(CONFIG_DIR))
    }

    /// Get the path to the configuration file
    pub fn get_config_file_path() -> Result<PathBuf, String> {
        let config_dir = Self::get_config_dir()?;
        Ok(config_dir.join(CONFIG_FILE))
    }

    /// Ensure the configuration directory exists
    pub fn ensure_config_dir() -> Result<(), String> {
        let config_dir = Self::get_config_dir()?;
        if !config_dir.exists() {
            fs::create_dir_all(&config_dir)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }
        Ok(())
    }

    /// Save configuration to file
    pub fn save_config(config: &AppConfig) -> Result<(), String> {
        Self::ensure_config_dir()?;
        
        let config_file = Self::get_config_file_path()?;
        let json_data = serde_json::to_string_pretty(config)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;
        
        fs::write(&config_file, json_data)
            .map_err(|e| format!("Failed to write config file: {}", e))?;
        
        println!("Configuration saved to: {:?}", config_file);
        Ok(())
    }

    /// Load configuration from file
    pub fn load_config() -> Result<AppConfig, String> {
        let config_file = Self::get_config_file_path()?;
        
        if !config_file.exists() {
            println!("Config file not found, creating default configuration");
            let default_config = AppConfig::default();
            Self::save_config(&default_config)?;
            return Ok(default_config);
        }

        let json_data = fs::read_to_string(&config_file)
            .map_err(|e| format!("Failed to read config file: {}", e))?;
        
        let config: AppConfig = serde_json::from_str(&json_data)
            .map_err(|e| format!("Failed to parse config file: {}", e))?;
        
        println!("Configuration loaded from: {:?}", config_file);
        Ok(config)
    }

    /// Create a backup of the current configuration
    pub fn backup_config() -> Result<(), String> {
        let config_file = Self::get_config_file_path()?;
        if !config_file.exists() {
            return Ok(()); // Nothing to backup
        }

        let backup_file = config_file.with_extension("json.backup");
        fs::copy(&config_file, &backup_file)
            .map_err(|e| format!("Failed to create backup: {}", e))?;
        
        println!("Configuration backed up to: {:?}", backup_file);
        Ok(())
    }

    /// Get the configuration file path as a string for display
    pub fn get_config_path_string() -> Result<String, String> {
        let path = Self::get_config_file_path()?;
        Ok(path.to_string_lossy().to_string())
    }
}
