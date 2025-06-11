# Cursor Auto Accept Extension

<div align="center">
  <img src="icons/icon.png" alt="Cursor Auto Accept Extension Logo" width="128" height="128" />
  
  **🚨 專為 Cursor 設計的自動接受程式碼建議擴展套件**
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=s123104.cursor-auto-accept-extension)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=s123104.cursor-auto-accept-extension)
</div>

## ⚡ 專案概述

本擴展套件專為 Cursor IDE 設計，提供自動接受程式碼建議、檔案分析與 ROI 追蹤功能。**注意：Cursor 更新可能導致功能失效**，請關注專案更新。

## 🚀 快速開始

### 安裝方式

1. 從 [Releases](https://github.com/s123104/cursor-auto-accept-extension/releases) 下載最新的 `.vsix` 檔案
2. 在 VS Code 中執行：`code --install-extension cursor-auto-accept-extension-1.0.0.vsix`
3. 重新啟動 VS Code

### 基本使用

- **切換自動接受功能**：`Ctrl+Shift+A` (Windows/Linux) 或 `Cmd+Shift+A` (macOS)
- **顯示控制面板**：`Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
- **檢視分析報告**：命令面板 → "顯示分析報告"

## 📋 功能特色

### 🤖 自動化功能

- **智能按鈕檢測**：自動識別並點擊 Accept All、Accept、Run、Apply、Execute、Resume 按鈕
- **可配置間隔**：自定義檢查間隔時間（500-10000毫秒）
- **選擇性啟用**：可單獨控制各類按鈕的自動點擊功能

### 📊 分析與追蹤

- **ROI 計算**：基於節省時間的投資回報率分析
- **詳細統計**：點擊次數、節省時間、檔案分析等數據
- **視覺化報告**：豐富的圖表和數據展示
- **資料匯出**：支援 JSON 格式資料匯出

### 🎛️ 控制面板

- **即時狀態監控**：顯示擴展運行狀態和統計資料
- **快速設定**：一鍵開關各項功能
- **檔案分析**：當前檔案的詳細分析資訊

## 📚 文檔

詳細文檔請參考 `docs/` 資料夾：

- **[安裝指南](docs/INSTALLATION.md)** - 詳細的安裝和設置說明
- **[使用說明](docs/USAGE.md)** - 完整的功能使用指南
- **[擴展使用指南](docs/EXTENSION_USAGE_GUIDE.md)** - 開發者和進階使用者指南
- **[現代化總結](docs/MODERNIZATION_SUMMARY.md)** - 最新更新和改進
- **[測試報告](docs/TEST_COMPLETION_REPORT.md)** - 完整的測試覆蓋報告

## 📋 系統需求

- **VS Code**: 1.96.0 或更高版本
- **平台**: Windows、macOS、Linux
- **推薦**: 在 Cursor 編輯器中使用以獲得最佳效果

## 🔧 開發者指南

### 建置指令

```bash
# 完整建置流程
npm run build

# 開發模式（監視檔案變更）
npm run dev

# 生成 VSIX 擴展包
npm run package:vsix

# 程式碼品質檢查
npm run lint

# 格式化程式碼
npm run format

# 清理建置檔案
npm run clean
```

### 專案結構

```
cursor-auto-accept-extension/
├── icons/              # 專案圖標
│   └── icon.png       # 主要圖標檔案
├── docs/              # 詳細文檔
├── src/               # 原始程式碼
├── dist/              # 編譯輸出
├── package.json       # 專案配置
├── README.md          # 主要說明文件
├── CHANGELOG.md       # 版本更新記錄
└── LICENSE            # 授權條款
```

### 技術棧

- **語言**：TypeScript
- **框架**：VS Code Extension API
- **建置工具**：ESLint, Prettier, TypeScript Compiler
- **測試框架**：Mocha, Chai
- **打包工具**：@vscode/vsce

## 📈 統計數據

- **測試覆蓋率**：23/23 測試通過
- **代碼品質**：ESLint 通過
- **打包大小**：~84KB
- **支援語言**：繁體中文

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！請參考：

1. Fork 此專案
2. 建立您的功能分支：`git checkout -b feature/AmazingFeature`
3. 提交您的變更：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🔗 相關連結

- **GitHub 專案**：https://github.com/s123104/cursor-auto-accept-extension
- **問題回報**：https://github.com/s123104/cursor-auto-accept-extension/issues
- **發布頁面**：https://github.com/s123104/cursor-auto-accept-extension/releases

## ⚠️ 免責聲明

本擴展套件是獨立開發的開源專案，與 Cursor 官方無關。使用前請詳閱使用說明，使用過程中的任何問題請透過 GitHub Issues 回報。

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/s123104">s123104</a></sub>
</div>
