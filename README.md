# 🚀 Cursor Auto Accept Extension - VS Code 擴展版

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-007ACC.svg)](https://code.visualstudio.com/)

> **⚡ 將 Cursor AI 程式碼建議的接受過程完全自動化！**

這是一個專為 **Cursor AI 編輯器** 設計的 VS Code 擴展，能自動偵測並點擊 "Accept"、"Accept All"、"Apply"、"Run" 等按鈕，讓您的程式開發流程更加流暢高效。

---

## 📦 快速安裝

### 方法一：VSIX 擴展包安裝（推薦）

1. **下載擴展包**

   ```bash
   # 已生成的 VSIX 檔案
   cursor-auto-accept-extension-1.0.0.vsix (33.27KB)
   ```

2. **安裝到 VS Code**

   ```bash
   # 命令行安裝
   code --install-extension cursor-auto-accept-extension-1.0.0.vsix
   ```

   或在 VS Code 中：

   - 按 `Ctrl+Shift+P` 開啟命令面板
   - 輸入 `Extensions: Install from VSIX...`
   - 選擇 `cursor-auto-accept-extension-1.0.0.vsix` 檔案
   - 重新載入 VS Code

3. **立即開始使用**
   - 按 `Ctrl+Shift+A` 啟動/停止自動接受
   - 按 `Ctrl+Shift+P` 開啟控制面板

### 方法二：開發模式

```bash
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension
npm install
npm run compile
# 在 VS Code 中按 F5 進入開發模式
```

---

## ✨ 主要功能

### 🤖 智能自動化

- **自動接受建議**：偵測並自動點擊 Accept/Accept All 按鈕
- **執行操作**：支援 Run、Apply、Execute 等執行按鈕
- **會話續接**：自動點擊 "Resume Conversation" 連結
- **智能辨識**：精確的按鈕類型識別和顏色編碼

### 📊 詳細分析

- **檔案追蹤**：即時監控修改的檔案和程式碼變更
- **統計數據**：記錄接受次數、時間節省、工作流程效率
- **會話歷史**：完整的操作記錄和分析報告
- **資料匯出**：支援 JSON 格式的資料備份

### 🎮 控制面板

- **主面板**：狀態控制、即時統計、快速設定
- **分析標籤**：詳細的使用數據和檔案活動記錄
- **ROI 標籤**：時間節省分析和生產力指標

### ⚙️ 豐富設定

- **11 個配置選項**：完全可自訂的行為設定
- **VS Code 整合**：原生設定頁面支援
- **即時更新**：設定變更立即生效

---

## 🎯 使用方法

### 基本操作

| 快捷鍵         | 功能         | 說明                     |
| -------------- | ------------ | ------------------------ |
| `Ctrl+Shift+A` | 切換自動接受 | 開啟/關閉自動接受功能    |
| `Ctrl+Shift+P` | 開啟控制面板 | 顯示完整的控制和分析介面 |

_Mac 用戶請將 `Ctrl` 替換為 `Cmd`_

### 命令面板

在 VS Code 命令面板中可用的命令：

- `Cursor Auto Accept: Toggle` - 切換功能開關
- `Cursor Auto Accept: Show Panel` - 開啟控制面板
- `Cursor Auto Accept: Show Analytics` - 查看分析報告

### 狀態列整合

- 點擊狀態列的 "⚡ Auto Accept" 按鈕可快速切換功能
- 顯示當前狀態和點擊計數

---

## ⚙️ 設定選項

在 VS Code 設定中搜尋 `cursorAutoAccept`：

```json
{
  "cursorAutoAccept.enabled": true,
  "cursorAutoAccept.interval": 2000,
  "cursorAutoAccept.enableAcceptAll": true,
  "cursorAutoAccept.enableAccept": true,
  "cursorAutoAccept.enableRun": true,
  "cursorAutoAccept.enableApply": true,
  "cursorAutoAccept.enableExecute": true,
  "cursorAutoAccept.enableResume": true,
  "cursorAutoAccept.debugMode": false,
  "cursorAutoAccept.averageCompleteWorkflow": 30000,
  "cursorAutoAccept.averageAutomatedWorkflow": 100
}
```

### 重要設定說明

| 設定        | 預設值  | 說明                     |
| ----------- | ------- | ------------------------ |
| `enabled`   | `true`  | 總開關，控制擴展是否啟用 |
| `interval`  | `2000`  | 按鈕偵測間隔（毫秒）     |
| `debugMode` | `false` | 啟用後顯示詳細的偵測日誌 |

---

## 🏆 技術優勢

### VS Code 擴展版 vs 瀏覽器腳本版

| 項目            | 瀏覽器腳本版 | VS Code 擴展版 | 改進      |
| --------------- | ------------ | -------------- | --------- |
| **安裝方式**    | 手動注入腳本 | 一鍵 VSIX 安裝 | 90% 簡化  |
| **整合程度**    | 外部腳本     | 原生擴展       | 完全整合  |
| **啟動方式**    | 控制台命令   | 快捷鍵 + UI    | 用戶友好  |
| **設定管理**    | 腳本內修改   | VS Code 設定頁 | 標準化    |
| **Bundle 大小** | ~100KB       | 9.22KB         | 90% 減少  |
| **建置時間**    | N/A          | <1秒           | 極速      |
| **類型安全**    | JavaScript   | TypeScript     | 100% 覆蓋 |

### 現代化技術架構

- **🏗️ esbuild 建置系統**：90%+ 速度提升，生產環境 9.22KB bundle
- **📦 TypeScript 5.8.3**：完整的類型安全和現代語法支援
- **🎯 VS Code Extension API**：原生整合，標準化擴展開發
- **⚡ 非同步架構**：優化的效能和記憶體使用
- **🛡️ 錯誤邊界**：完整的錯誤處理和重試機制

---

## 📋 系統需求

- **VS Code**: 1.96.0 或更高版本
- **平台**: Windows、macOS、Linux
- **推薦**: 在 Cursor 編輯器中使用以獲得最佳效果

---

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
├── src/                    # TypeScript 原始碼
│   ├── extension.ts        # 主擴展入口點
│   ├── analytics.ts        # 分析和統計功能
│   ├── autoAcceptService.ts # 核心自動接受服務
│   └── webviewPanel.ts     # 控制面板 UI
├── build/                  # 建置配置
│   └── esbuild.js         # esbuild 設定檔
├── dist/                   # 編譯輸出目錄
│   ├── extension.js       # 主 bundle (9.22KB)
│   └── build-meta.json    # 建置元資料
├── autoAccept.js          # 備用腳本（原版）
└── cursor-auto-accept-extension-1.0.0.vsix # 最終擴展包
```

---

## 📚 完整文檔

- **📖 [使用指南](EXTENSION_USAGE_GUIDE.md)**：詳細的功能說明和操作步驟
- **📋 [更新日誌](CHANGELOG.md)**：版本更新記錄和改進詳情
- **🚀 [現代化摘要](MODERNIZATION_SUMMARY.md)**：2025年技術改進總結
- **⚙️ [安裝指南](INSTALLATION.md)**：多種安裝方式的詳細說明

---

## 🚨 重要注意事項

### 使用建議

1. **專為 Cursor 設計**：此擴展專門為 Cursor 編輯器優化，在其他環境中可能效果有限
2. **定期備份資料**：建議定期匯出分析資料以防丟失
3. **適度使用**：建議按需要啟用，培養良好的程式碼審查習慣

### 備用方案

如果 VS Code 擴展遇到問題，您可以使用保留的 `autoAccept.js` 腳本：

```javascript
// 在瀏覽器控制台中執行
// 腳本內容請參考 autoAccept.js 檔案
```

---

## 🤝 貢獻與支援

### 參與貢獻

- **🐛 回報問題**：[GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)
- **💡 功能建議**：在 Issues 中提出想法
- **📝 改進文檔**：提交 Pull Request
- **🌐 翻譯協助**：協助改進繁體中文本地化

### 開發環境

```bash
# Fork 並克隆專案
git clone https://github.com/your-username/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 安裝依賴並開始開發
npm install
npm run dev

# 在 VS Code 中按 F5 啟動除錯模式
```

---

## 📊 使用統計

### 即時效能指標

- ⚡ **Bundle 大小**: 9.22KB（生產模式）
- 🚀 **建置時間**: <1 秒
- 📦 **VSIX 大小**: 33.27KB
- 🔧 **TypeScript 覆蓋**: 100%

### 功能完成度

- ✅ 核心自動接受功能
- ✅ 完整分析和統計
- ✅ 互動式控制面板
- ✅ VS Code 原生整合
- ✅ 豐富的設定選項
- ✅ 詳細的錯誤處理

---

## ⚖️ 授權聲明

此專案基於 MIT 授權條款發布。

**原始專案**：[true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)  
**原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)  
**繁體中文版與 VS Code 擴展化**：本專案在保持原始功能的基礎上，提供繁體中文翻譯和專業的 VS Code 擴展版本。

---

**🎉 開始享受更高效的 Cursor AI 程式開發體驗！**

_如果此擴展對您有幫助，請考慮給專案一個 ⭐ Star！_
