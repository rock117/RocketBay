<div align="center">
  <img src="https://raw.githubusercontent.com/tauri-apps/tauri/dev/app-icon.png" alt="RocketBay Logo" width="120" height="120">
  
  # 🚀 RocketBay
  
  **A cross-platform process launcher that helps you organize and manage your application launch items with groups and custom configurations.**
  
  ![Development Status](https://img.shields.io/badge/Status-Under%20Development-orange)
  ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
  ![License](https://img.shields.io/badge/License-MIT-green)
  
</div>

> **⚠️ Important Note**: This is a project under development. Features may be incomplete or contain bugs. Use with caution in production environments.

## ✨ Features

### 🎯 Core Functionality
- **Launch Item Management**: Create, edit, and delete application launch items
- **Process Configuration**: Support for custom launch arguments and working directories
- **Group Management**: Organize launch items into different groups for better management
- **Keyboard Shortcuts**: Set custom keyboard shortcuts for launch items
- **Drag & Drop**: Support for dragging launch items between groups

### 🎨 User Interface
- **Modern UI**: Built with Vue 3 + Nuxt 3 for a modern user experience
- **Dual Theme**: Support for both light and dark mode themes
- **Responsive Layout**: Adapts to different screen sizes
- **Custom Groups**: Set custom icons and colors for groups
- **Intuitive Design**: Left sidebar for groups, right grid layout for launch items

### 🌍 Cross-Platform Support
- **Windows**: Full support
- **macOS**: Full support  
- **Linux**: Full support


Currently Completed:
- ✅ Project architecture setup (Tauri 2 + Nuxt 3)
- ✅ Basic UI component design
- ✅ Data model definitions
- ✅ State management (Pinia stores)
- ✅ Basic Rust backend API

In Development:
- 🔄 Launch item modal components
- 🔄 File browser integration
- 🔄 Drag & drop functionality
- 🔄 Theme switching feature
- 🔄 Notification system

Planned Features:
- 📋 Keyboard shortcut binding
- 📋 Application icon extraction
- 📋 Launch statistics
- 📋 Import/export configurations
- 📋 System tray integration

## 🏗️ Technical Architecture

### Backend (Rust + Tauri 2)
- **Tauri 2.0**: Modern desktop application framework
- **Rust**: High-performance, memory-safe systems programming language
- **Local Storage**: JSON file-based configuration and data storage
- **Cross-Platform**: Native support for multiple operating systems

### Frontend (Vue 3 + Nuxt 3)
- **Vue 3**: Modern JavaScript framework
- **Nuxt 3**: Full-stack Vue framework
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icon library


## 🛠️ Development Environment

### Prerequisites
- **Node.js** >= 18.0.0
- **Rust** >= 1.70.0
- **Tauri CLI** >= 2.0.0

### Installation
```bash
# Install frontend dependencies
npm install

# Install Tauri CLI (if not already installed)
npm install -g @tauri-apps/cli@next
```

### Development
```bash
# Start development server
npm run tauri:dev
```

### Build
```bash
# Build production version
npm run tauri:build
```

## 📝 Usage Guide

1. **Create Groups**: Click the "+" button in the left sidebar to create new groups
2. **Add Launch Items**: Click the "Add Launch Item" button in the top right
3. **Configure Items**: Set executable path, arguments, working directory, etc.
4. **Launch Applications**: Click on launch item cards or use keyboard shortcuts
5. **Drag & Drop Management**: Drag launch items between groups to organize them

## 🤝 Contributing

This project is under active development. Issues and Pull Requests are welcome!

## 📄 License

MIT License
