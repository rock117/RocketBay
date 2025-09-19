// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod commands;
mod storage;
mod config;

use models::*;
use commands::*;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
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
            backup_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
