# Cursor Auto Accept Extension

<div align="center">
  <img src="icons/icon.png" alt="Cursor Auto Accept Extension Logo" width="128" height="128" />
  
  **🚀 企業級 Cursor 自動接受程式碼建議擴展套件**
  
  [![Version](https://img.shields.io/badge/Version-2.4.0-brightgreen.svg)](https://github.com/s123104/cursor-auto-accept-extension)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
  [![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-green.svg)](https://code.visualstudio.com/)
</div>

---

## ⚡ 專案概述

本擴展專為 Cursor IDE 與 VS Code 設計，提供自動接受程式碼建議、檔案分析、ROI 追蹤與現代化控制面板。採用 TypeScript 開發，具備完整型別安全、測試框架與專業開源結構。

---

## ✨ 主要特色

- 🤖 **智能自動化**：自動偵測並點擊 Accept、Accept All、Run、Apply 等操作按鈕
- 📊 **深度分析**：ROI 計算、檔案變更追蹤、效率統計
- 🎮 **現代控制面板**：三標籤頁設計，支援即時狀態與視覺化配置
- 🔧 **高度可配置**：靈活設定選項、彈性選擇器、除錯工具
- 🛡️ **安全機制**：防重複點擊、錯誤自動恢復
- 🧑‍💻 **開源專業**：TypeScript 嚴格模式、100% 測試覆蓋、CI/CD

---

## 🚀 快速開始

### 📦 安裝方式

**方法一：VS Code Marketplace（推薦）**

```bash
code --install-extension s123104.cursor-auto-accept-extension
```

**方法二：VSIX 檔案安裝**

1. 下載最新的 `cursor-auto-accept-extension-2.4.0.vsix`
2. 執行：
   ```bash
   code --install-extension cursor-auto-accept-extension-2.4.0.vsix
   ```
3. 重新載入 VS Code

**方法三：手動腳本備用方案**

如擴展無法使用，可於 Cursor 開發者工具 Console 執行 [`autoAccept.js`](./autoAccept.js)：

```javascript
// 啟動自動接受
startAccept();
// 停止自動接受
stopAccept();
// 檢查狀態
acceptStatus();
// 顯示分析面板
showAnalytics();
```

---

## 📋 功能特色

### 🤖 智能自動化系統

- 全面按鈕檢測：Accept All、Accept、Run、Apply、Execute、Resume
- 智能間隔控制、選擇性啟用、防重複點擊、彈性選擇器

### 📊 分析與追蹤系統

- ROI 計算引擎、檔案變更追蹤、會話分析、資料匯出

### 🎮 互動式控制面板

- 三標籤頁設計、即時狀態監控、視覺化配置、活動日誌

---

## 📚 完整文檔

| 文檔類型          | 文件路徑                                                         | 說明                   |
| ----------------- | ---------------------------------------------------------------- | ---------------------- |
| 📖 **安裝指南**   | [docs/INSTALLATION.md](docs/INSTALLATION.md)                     | 詳細的安裝和設置步驟   |
| 🎮 **使用說明**   | [docs/USAGE.md](docs/USAGE.md)                                   | 完整的功能使用指南     |
| 🔧 **擴展指南**   | [docs/EXTENSION_USAGE_GUIDE.md](docs/EXTENSION_USAGE_GUIDE.md)   | 開發者和進階使用者指南 |
| 🚀 **現代化總結** | [docs/MODERNIZATION_SUMMARY.md](docs/MODERNIZATION_SUMMARY.md)   | 2025年現代化更新說明   |
| 📊 **測試報告**   | [docs/TEST_COMPLETION_REPORT.md](docs/TEST_COMPLETION_REPORT.md) | 完整的測試覆蓋報告     |

---

## 🖥️ 系統需求

- **VS Code**: 1.74.0 或更高版本
- **Node.js**: 18.0 或更高版本（開發時）
- **平台**: Windows、macOS、Linux
- **推薦環境**: Cursor 編輯器

---

## 🛠️ 技術棧與專案架構

| 技術                      | 版本  | 用途                   |
| ------------------------- | ----- | ---------------------- |
| **TypeScript**            | 5.3+  | 主要開發語言，類型安全 |
| **esbuild**               | 最新  | 高速建置工具           |
| **VS Code Extension API** | 1.74+ | 擴展開發框架           |
| **ESLint**                | 最新  | 程式碼品質檢查         |
| **Prettier**              | 最新  | 程式碼格式化           |
| **Mocha & Chai**          | 最新  | 測試框架               |
| **@vscode/vsce**          | 最新  | VSIX 打包工具          |

### 專案目錄

```
cursor-auto-accept-extension/
├── src/                         # TypeScript 原始碼
│   ├── extension.ts             # 主擴展入口點
│   ├── analytics.ts             # 分析引擎
│   ├── autoAcceptService.ts     # 自動接受服務
│   ├── webviewPanel.ts          # UI 控制器
│   └── test/                    # 測試檔案
├── dist/                        # 編譯輸出
├── icons/                       # 擴展圖標
├── docs/                        # 詳細文檔
├── package.json                 # 擴展清單
├── tsconfig.json                # TypeScript 配置
├── CHANGELOG.md                 # 版本更新記錄
├── LICENSE                      # MIT 授權條款
└── autoAccept.js                # 備用腳本（保留）
```

---

## 📈 品質與性能指標

- **Bundle 大小**：59.27KB（esbuild 優化）
- **建置時間**：< 30 秒
- **TypeScript 錯誤**：0 個
- **ESLint 錯誤**：0 個（僅警告）
- **測試覆蓋率**：核心功能 100%
- **啟動時間**：< 500ms
- **記憶體使用**：< 50MB
- **CPU 使用**：< 5%（閒置時）

---

## 🎮 使用說明與控制命令

### VS Code 擴展

- **啟動/停止服務**：
  - `Ctrl+Shift+A` (Win/Linux) 或 `Cmd+Shift+A` (macOS)
  - 命令面板：`Cursor Auto Accept: Toggle/Start/Stop Auto Accept`
- **顯示控制面板**：
  - 命令面板：`Cursor Auto Accept: Show Control Panel`
- **分析報告**：
  - 命令面板：`Cursor Auto Accept: Show/Export Analytics`

### 手動腳本（autoAccept.js）

- `startAccept()`：啟動自動化
- `stopAccept()`：停止自動化
- `acceptStatus()`：檢查狀態
- `showAnalytics()`：顯示分析面板
- 其他命令詳見腳本註解

---

## 🔄 功能對比表

| 功能特性               | VS Code 擴展       | 手動腳本 (autoAccept.js) | 說明                         |
| ---------------------- | ------------------ | ------------------------ | ---------------------------- |
| **核心按鈕檢測**       | ✅                 | ✅                       | 完全一致的按鈕識別邏輯       |
| **Accept All**         | ✅                 | ✅                       | 自動點擊 Accept All 按鈕     |
| **Accept**             | ✅                 | ✅                       | 自動點擊 Accept 按鈕         |
| **Run**                | ✅                 | ✅                       | 自動點擊 Run 按鈕            |
| **Run Command**        | ✅                 | ✅                       | 自動點擊 Run Command 按鈕    |
| **Apply**              | ✅                 | ✅                       | 自動點擊 Apply 按鈕          |
| **Execute**            | ✅                 | ✅                       | 自動點擊 Execute 按鈕        |
| **Resume**             | ✅                 | ✅                       | 自動點擊 Resume 連結         |
| **Try Again**          | ✅ 實驗性          | ✅ 實驗性                | 重試操作（實驗性功能）       |
| **Move to Background** | ✅ 實驗性          | ✅ 實驗性                | 智能背景移動（實驗性功能）   |
| **防重複點擊**         | ✅                 | ✅                       | 智能冷卻期和無效點擊檢測     |
| **彈性選擇器**         | ✅                 | ✅                       | 多重備選選擇器策略           |
| **ROI 分析**           | ✅                 | ✅                       | 時間節省計算和效率統計       |
| **檔案追蹤**           | ✅                 | ✅                       | 修改檔案統計和程式碼變更追蹤 |
| **控制面板**           | ✅ VS Code Webview | ✅ 瀏覽器面板            | 不同實現但功能相同           |
| **配置管理**           | ✅ VS Code 設定    | ✅ 腳本配置              | 設定持久化方式不同           |
| **除錯工具**           | ✅ 輸出面板        | ✅ 控制台日誌            | 除錯介面不同但功能相同       |
| **資料匯出**           | ✅ JSON 檔案       | ✅ JSON 下載             | 匯出格式完全相同             |
| **事件驅動**           | ✅ VS Code API     | ✅ MutationObserver      | 不同實現但效果相同           |
| **自動啟動**           | ✅ 擴展自動載入    | ❌ 需手動執行            | 擴展優勢                     |
| **跨會話持久化**       | ✅ VS Code 設定    | ✅ localStorage          | 不同存儲方式                 |

---

## 🧑‍💻 開發與貢獻指南

### 開發環境設置

```bash
# 1. Fork 並克隆專案
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 2. 安裝依賴
npm install

# 3. 啟動開發模式
npm run dev

# 4. 在 VS Code 中按 F5 啟動除錯
```

### 測試指令

```bash
npm test                # 所有測試
npm run test:unit       # 單元測試
npm run test:integration # 整合測試
npm run test:coverage   # 覆蓋率報告
```

### 建置指令

```bash
npm run build              # 完整建置
npm run build:production   # 生產建置
npm run watch              # 監視模式
npm run check-types        # 型別檢查
npm run lint               # 程式碼檢查
npm run format             # 格式化
npm run clean              # 清理建置檔案
```

### 貢獻流程

1. Fork 專案並建立功能分支
2. 撰寫/修改功能，確保通過所有測試
3. 提交 Pull Request，附上詳細說明
4. 維護者審查與合併

---

## 📄 授權條款

本專案採用 [MIT 授權條款](LICENSE)。

---

## 🙏 致謝

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [原始專案](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode) by @ivalsaraj

---

## 📞 聯絡資訊

- **作者**: s123104
- **GitHub**: [@s123104](https://github.com/s123104)
- **Issues**: [GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/s123104">s123104</a> | Powered by TypeScript & esbuild</sub>
</div>
