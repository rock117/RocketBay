use tauri::{AppHandle, State};
use crate::models::*;
use crate::storage::*;
use crate::config::ConfigManager;
use std::process::Command;
use uuid::Uuid;

// Group commands
#[tauri::command]
pub async fn get_groups(app_handle: AppHandle) -> Result<Vec<Group>, String> {
    let storage = Storage::new(app_handle);
    storage.load_groups().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_group(
    app_handle: AppHandle,
    request: CreateGroupRequest,
) -> Result<Group, String> {
    let storage = Storage::new(app_handle);
    let mut groups = storage.load_groups().map_err(|e| e.to_string())?;
    
    let now = chrono::Utc::now().to_rfc3339();
    let new_group = Group {
        id: Uuid::new_v4().to_string(),
        name: request.name,
        color: request.color,
        icon: request.icon,
        expanded: true,
        order: groups.len() as i32,
        created_at: now.clone(),
        updated_at: now,
    };
    
    groups.push(new_group.clone());
    storage.save_groups(&groups).map_err(|e| e.to_string())?;
    
    Ok(new_group)
}

#[tauri::command]
pub async fn update_group(
    app_handle: AppHandle,
    request: UpdateGroupRequest,
) -> Result<Group, String> {
    let storage = Storage::new(app_handle);
    let mut groups = storage.load_groups().map_err(|e| e.to_string())?;
    
    let updated_group = {
        let group = groups
            .iter_mut()
            .find(|g| g.id == request.id)
            .ok_or("Group not found")?;
        
        if let Some(name) = request.name {
            group.name = name;
        }
        if let Some(color) = request.color {
            group.color = Some(color);
        }
        if let Some(icon) = request.icon {
            group.icon = Some(icon);
        }
        if let Some(expanded) = request.expanded {
            group.expanded = expanded;
        }
        if let Some(order) = request.order {
            group.order = order;
        }
        
        group.updated_at = chrono::Utc::now().to_rfc3339();
        group.clone()
    };
    
    storage.save_groups(&groups).map_err(|e| e.to_string())?;
    
    Ok(updated_group)
}

#[tauri::command]
pub async fn delete_group(app_handle: AppHandle, group_id: String) -> Result<(), String> {
    let storage = Storage::new(app_handle);
    let mut groups = storage.load_groups().map_err(|e| e.to_string())?;
    let mut items = storage.load_launch_items().map_err(|e| e.to_string())?;
    
    // Remove the group
    groups.retain(|g| g.id != group_id);
    
    // Remove all launch items in this group
    items.retain(|item| item.group_id != group_id);
    
    storage.save_groups(&groups).map_err(|e| e.to_string())?;
    storage.save_launch_items(&items).map_err(|e| e.to_string())?;
    
    Ok(())
}

// Launch item commands
#[tauri::command]
pub async fn get_launch_items(app_handle: AppHandle) -> Result<Vec<LaunchItem>, String> {
    let storage = Storage::new(app_handle);
    storage.load_launch_items().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_launch_item(
    app_handle: AppHandle,
    request: CreateLaunchItemRequest,
) -> Result<LaunchItem, String> {
    let storage = Storage::new(app_handle);
    let mut items = storage.load_launch_items().map_err(|e| e.to_string())?;
    
    let now = chrono::Utc::now().to_rfc3339();
    let new_item = LaunchItem {
        id: Uuid::new_v4().to_string(),
        name: request.name,
        path: request.path,
        args: request.args,
        working_dir: request.working_dir,
        icon: request.icon,
        shortcut: request.shortcut,
        group_id: request.group_id,
        created_at: now.clone(),
        updated_at: now,
    };
    
    items.push(new_item.clone());
    storage.save_launch_items(&items).map_err(|e| e.to_string())?;
    
    Ok(new_item)
}

#[tauri::command]
pub async fn update_launch_item(
    app_handle: AppHandle,
    request: UpdateLaunchItemRequest,
) -> Result<LaunchItem, String> {
    let storage = Storage::new(app_handle);
    let mut items = storage.load_launch_items().map_err(|e| e.to_string())?;
    
    let updated_item = {
        let item = items
            .iter_mut()
            .find(|i| i.id == request.id)
            .ok_or("Launch item not found")?;
        
        if let Some(name) = request.name {
            item.name = name;
        }
        if let Some(path) = request.path {
            item.path = path;
        }
        if let Some(args) = request.args {
            item.args = args;
        }
        if let Some(working_dir) = request.working_dir {
            item.working_dir = Some(working_dir);
        }
        if let Some(icon) = request.icon {
            item.icon = Some(icon);
        }
        if let Some(shortcut) = request.shortcut {
            item.shortcut = Some(shortcut);
        }
        if let Some(group_id) = request.group_id {
            item.group_id = group_id;
        }
        
        item.updated_at = chrono::Utc::now().to_rfc3339();
        item.clone()
    };
    
    storage.save_launch_items(&items).map_err(|e| e.to_string())?;
    
    Ok(updated_item)
}

#[tauri::command]
pub async fn delete_launch_item(app_handle: AppHandle, item_id: String) -> Result<(), String> {
    let storage = Storage::new(app_handle);
    let mut items = storage.load_launch_items().map_err(|e| e.to_string())?;
    
    items.retain(|item| item.id != item_id);
    
    storage.save_launch_items(&items).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub async fn launch_process(item: LaunchItem) -> Result<(), String> {
    let mut cmd = Command::new(&item.path);
    
    if !item.args.is_empty() {
        cmd.args(&item.args);
    }
    
    if let Some(working_dir) = &item.working_dir {
        cmd.current_dir(working_dir);
    }
    
    cmd.spawn().map_err(|e| format!("Failed to launch process: {}", e))?;
    
    Ok(())
}

// Settings commands
#[tauri::command]
pub async fn get_settings(app_handle: AppHandle) -> Result<AppSettings, String> {
    let storage = Storage::new(app_handle);
    storage.load_settings().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_settings(
    app_handle: AppHandle,
    settings: AppSettings,
) -> Result<AppSettings, String> {
    let storage = Storage::new(app_handle);
    storage.save_settings(&settings).map_err(|e| e.to_string())?;
    Ok(settings)
}

// Configuration commands
#[tauri::command]
pub async fn save_config(app_handle: AppHandle) -> Result<String, String> {
    let storage = Storage::new(app_handle);
    
    // Load current data
    let groups = storage.load_groups().map_err(|e| e.to_string())?;
    let launch_items = storage.load_launch_items().map_err(|e| e.to_string())?;
    let settings = storage.load_settings().map_err(|e| e.to_string())?;
    
    // Create config object
    let config = AppConfig {
        groups,
        launch_items,
        settings,
        version: "0.1.0".to_string(),
        last_saved: chrono::Utc::now().to_rfc3339(),
    };
    
    // Save to file
    ConfigManager::save_config(&config)?;
    
    // Return config file path
    ConfigManager::get_config_path_string()
}

#[tauri::command]
pub async fn load_config(app_handle: AppHandle) -> Result<AppConfig, String> {
    let config = ConfigManager::load_config()?;
    
    // Save loaded data to storage
    let storage = Storage::new(app_handle);
    storage.save_groups(&config.groups).map_err(|e| e.to_string())?;
    storage.save_launch_items(&config.launch_items).map_err(|e| e.to_string())?;
    storage.save_settings(&config.settings).map_err(|e| e.to_string())?;
    
    Ok(config)
}

#[tauri::command]
pub async fn get_config_path() -> Result<String, String> {
    ConfigManager::get_config_path_string()
}

#[tauri::command]
pub async fn backup_config() -> Result<(), String> {
    ConfigManager::backup_config()
}
