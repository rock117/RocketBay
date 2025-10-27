use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchItem {
    pub id: String,
    pub name: String,
    pub path: String,
    pub args: Vec<String>,
    pub working_dir: Option<String>,
    pub icon: Option<String>,
    pub shortcut: Option<String>,
    pub order: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub theme: String, // "light" or "dark"
    pub auto_save: bool,
    pub show_notifications: bool,
    pub window_width: i32,
    pub window_height: i32,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            auto_save: true,
            show_notifications: true,
            window_width: 1200,
            window_height: 800,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateLaunchItemRequest {
    pub name: String,
    pub path: String,
    pub args: Vec<String>,
    pub working_dir: Option<String>,
    pub icon: Option<String>,
    pub shortcut: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateLaunchItemRequest {
    pub id: String,
    pub name: Option<String>,
    pub path: Option<String>,
    pub args: Option<Vec<String>>,
    pub working_dir: Option<String>,
    pub icon: Option<String>,
    pub shortcut: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub launch_items: Vec<LaunchItem>,
    pub settings: AppSettings,
    pub version: String,
    pub last_saved: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            launch_items: vec![],
            settings: AppSettings::default(),
            version: "0.1.0".to_string(),
            last_saved: chrono::Utc::now().to_rfc3339(),
        }
    }
}
