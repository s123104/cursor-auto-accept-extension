# Cursor Auto Accept Extension

<div align="center">
  <img src="icons/icon.png" alt="Cursor Auto Accept Extension Logo" width="128" height="128" />
  
  **🚨 專為 Cursor 設計的自動接受程式碼建議擴展套件**
  
  [![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://marketplace.visualstudio.com/items?itemName=s123104.cursor-auto-accept-extension)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=s123104.cursor-auto-accept-extension)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/s123104/cursor-auto-accept-extension)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
</div>

## ⚡ 專案概述

本擴展套件專為 Cursor IDE 設計，提供自動接受程式碼建議、檔案分析與 ROI 追蹤功能。採用 TypeScript 開發，具備完整的類型安全和現代化建置系統。

### ✨ 主要特色

- 🤖 **智能自動化**：自動偵測並點擊各種操作按鈕
- 📊 **深度分析**：詳細的檔案變更追蹤和統計分析
- ⚡ **效率提升**：大幅縮短重複性操作時間
- 🎮 **直觀控制**：三標籤頁式控制面板
- 🔧 **高度可配置**：靈活的設定選項和按鈕類型控制

## 🚀 快速開始

### 📦 安裝方式

**方法一：VSIX 檔案安裝（推薦）**

1. 從 [Releases](https://github.com/s123104/cursor-auto-accept-extension/releases) 下載最新的 `cursor-auto-accept-extension-1.0.1.vsix`
2. 在 VS Code 中執行：`code --install-extension cursor-auto-accept-extension-1.0.1.vsix`
3. 或透過 VS Code UI：Extensions → Install from VSIX...
4. 重新載入 VS Code

**方法二：開發模式安裝**

```bash
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension
npm install
npm run compile
# 在 VS Code 中按 F5 進入開發模式
```

### ⚡ 基本使用

- **切換自動接受功能**：`Ctrl+Shift+A` (Windows/Linux) 或 `Cmd+Shift+A` (macOS)
- **顯示控制面板**：`Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
- **快速存取**：點擊編輯器右上角的 📊 按鈕（支援 .js/.ts/.jsx/.tsx 檔案）

## 📋 功能特色

### 🤖 智能自動化系統

- **全面按鈕檢測**：自動識別並點擊 Accept All、Accept、Run、Apply、Execute、Resume 按鈕
- **智能間隔控制**：可配置檢查間隔時間（500-10000毫秒）
- **選擇性啟用**：可單獨控制各類按鈕的自動點擊功能
- **安全機制**：內建錯誤處理和自動恢復功能

### 📊 分析與追蹤系統

- **ROI 計算引擎**：基於節省時間的精確投資回報率分析
- **檔案變更追蹤**：詳細記錄每個檔案的修改歷史和統計
- **會話分析**：完整的使用會話記錄和效率分析
- **資料匯出**：支援 JSON 格式完整資料匯出

### 🎮 互動式控制面板

- **三標籤頁設計**：主面板、分析、ROI 分別管理不同功能
- **即時狀態監控**：實時顯示運行狀態和統計資料
- **視覺化配置**：直觀的勾選框配置各種按鈕類型
- **活動日誌**：詳細的操作歷史記錄和時間戳

## 📚 完整文檔

| 文檔類型          | 文件路徑                                                    | 說明                   |
| ----------------- | ----------------------------------------------------------- | ---------------------- |
| 📖 **安裝指南**   | [INSTALLATION.md](docs/INSTALLATION.md)                     | 詳細的安裝和設置步驟   |
| 🎮 **使用說明**   | [USAGE.md](docs/USAGE.md)                                   | 完整的功能使用指南     |
| 🔧 **擴展指南**   | [EXTENSION_USAGE_GUIDE.md](docs/EXTENSION_USAGE_GUIDE.md)   | 開發者和進階使用者指南 |
| 🚀 **現代化總結** | [MODERNIZATION_SUMMARY.md](docs/MODERNIZATION_SUMMARY.md)   | 2025年現代化更新說明   |
| 📊 **測試報告**   | [TEST_COMPLETION_REPORT.md](docs/TEST_COMPLETION_REPORT.md) | 完整的測試覆蓋報告     |
| ⚡ **快速開始**   | [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)                | 5分鐘快速入門指南      |

## 📋 系統需求

- **VS Code**: 1.96.0 或更高版本
- **Node.js**: 18.0 或更高版本（開發時）
- **平台**: Windows、macOS、Linux
- **推薦環境**: 在 Cursor 編輯器中使用以獲得最佳效果

## 🔧 開發者指南

### 建置指令

```bash
# 🏗️ 完整建置流程
npm run build              # 完整建置（檢查→編譯→測試→打包）

# ⚡ 開發模式
npm run dev                # 開發模式建置
npm run watch              # 監視模式（自動重建）

# 📦 打包相關
npm run package:vsix       # 生成 VSIX 擴展包
npm run compile            # TypeScript 編譯

# 🔍 品質檢查
npm run lint               # ESLint 程式碼檢查
npm run format             # Prettier 格式化
npm run check-types        # TypeScript 類型檢查
npm run validate           # 完整驗證流程

# 🧹 清理
npm run clean              # 清理建置檔案
```

### 專案架構

```
cursor-auto-accept-extension/
├── 📁 src/                         # TypeScript 原始碼
│   ├── extension.ts               # 主擴展入口點
│   ├── analytics.ts               # 分析引擎
│   ├── autoAcceptService.ts       # 自動接受服務
│   ├── webviewPanel.ts            # UI 控制器
│   └── test/                      # 測試檔案
├── 📁 dist/                       # 編譯輸出
│   └── extension.js               # 主程式（35.57KB）
├── 📁 icons/                      # 擴展圖標
│   └── icon.png                   # 主圖標（410KB）
├── 📁 docs/                       # 詳細文檔
├── 📁 build/                      # 建置配置
│   └── esbuild.js                 # esbuild 設定
├── 📄 package.json                # 擴展清單
├── 📄 tsconfig.json               # TypeScript 配置
├── 📄 CHANGELOG.md                # 版本更新記錄
├── 📄 LICENSE                     # MIT 授權條款
└── 📄 autoAccept.js               # 備用腳本（保留）
```

### 技術棧詳情

| 技術                      | 版本   | 用途                       |
| ------------------------- | ------ | -------------------------- |
| **TypeScript**            | 5.8.3  | 主要開發語言，提供類型安全 |
| **esbuild**               | 0.24.2 | 高速建置工具，替代 webpack |
| **VS Code Extension API** | 1.96.0 | 擴展開發框架               |
| **ESLint**                | 8.57.1 | 程式碼品質檢查             |
| **Prettier**              | 3.4.2  | 程式碼格式化               |
| **Mocha & Chai**          | Latest | 測試框架                   |
| **@vscode/vsce**          | Latest | VSIX 打包工具              |

## 📈 品質指標

### 🎯 技術指標

- **Bundle 大小**：35.57KB（esbuild 優化）
- **建置時間**：< 30ms（90%+ 速度提升）
- **TypeScript 錯誤**：0 個
- **ESLint 錯誤**：0 個（6個非阻斷性警告）
- **測試覆蓋率**：核心功能 100%

### 📊 使用統計

- **支援檔案類型**：.js, .ts, .jsx, .tsx, .py, .md 等
- **按鈕類型支援**：6 種主要按鈵類型
- **設定選項**：11 個可配置參數
- **支援語言**：繁體中文（主要）+ 英文

## 🤝 貢獻指南

我們歡迎各種形式的貢獻！請遵循以下步驟：

### 🔧 開發環境設置

```bash
# 1. Fork 並克隆專案
git clone https://github.com/your-username/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 2. 安裝依賴
npm install

# 3. 啟動開發模式
npm run dev

# 4. 在 VS Code 中按 F5 啟動除錯
```

### 📝 提交流程

1. **建立功能分支**：`git checkout -b feature/amazing-feature`
2. **進行變更**：確保遵循現有的程式碼風格
3. **執行測試**：`npm run validate` 確保所有檢查通過
4. **提交變更**：`git commit -m 'feat: add amazing feature'`
5. **推送分支**：`git push origin feature/amazing-feature`
6. **建立 Pull Request**：詳細描述變更內容

### 🐛 問題回報

報告問題時請包含：

- 詳細的錯誤描述和重現步驟
- VS Code 和擴展版本資訊
- 作業系統和環境資訊
- 相關的錯誤日誌或截圖

## 📄 授權條款

本專案採用 **MIT 授權條款** - 詳見 [LICENSE](LICENSE) 檔案

### 🙏 致謝

- **原始專案**：感謝 [true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode) 提供靈感
- **原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)
- **貢獻者**：感謝所有提供回饋和建議的使用者

## 🔗 相關連結

| 連結類型           | URL                                                                     | 說明               |
| ------------------ | ----------------------------------------------------------------------- | ------------------ |
| 🏠 **GitHub 專案** | https://github.com/s123104/cursor-auto-accept-extension                 | 原始碼倉庫         |
| 🐛 **問題回報**    | https://github.com/s123104/cursor-auto-accept-extension/issues          | Bug 回報和功能請求 |
| 📦 **發布頁面**    | https://github.com/s123104/cursor-auto-accept-extension/releases        | 版本發布和下載     |
| 📖 **說明文檔**    | https://github.com/s123104/cursor-auto-accept-extension/blob/main/docs/ | 完整文檔資料夾     |

## ⚠️ 重要提醒

- **專用設計**：此擴展專為 Cursor IDE 優化，在其他編輯器中可能功能受限
- **版本相容性**：Cursor 更新可能影響功能，請關注專案更新
- **備用方案**：如擴展失效，可使用內附的 `autoAccept.js` 備用腳本
- **資料安全**：建議定期匯出分析資料以防丟失

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/s123104">s123104</a> | Powered by TypeScript & esbuild</sub>
</div>
