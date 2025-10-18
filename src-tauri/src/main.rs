// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod commands;
mod storage;
mod config;

use models::*;
use commands::*;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_devtools::init())
        .setup(|app| {
            // Load configuration from file and seed storage
            let config = match config::ConfigManager::load_config() {
                Ok(c) => {
                    println!("Successfully loaded config with {} groups and {} launch items", 
                             c.groups.len(), c.launch_items.len());
                    c
                },
                Err(e) => {
                    println!("Failed to load config: {}, using defaults", e);
                    AppConfig::default()
                },
            };

            let storage = storage::Storage::new(app.handle().clone());
            if let Err(e) = storage.save_groups(&config.groups) {
                println!("Failed to save groups: {}", e);
            }
            if let Err(e) = storage.save_launch_items(&config.launch_items) {
                println!("Failed to save launch items: {}", e);
            }
            if let Err(e) = storage.save_settings(&config.settings) {
                println!("Failed to save settings: {}", e);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_groups,
            create_group,
            update_group,
            delete_group,
            get_launch_items,
            create_launch_item,
            update_launch_item,
            delete_launch_item,
            launch_process,
            get_settings,
            update_settings,
            save_config,
            load_config,
            get_config_path,
            backup_config,
            open_devtools
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
