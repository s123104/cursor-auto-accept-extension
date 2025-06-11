# 🚀 Cursor Auto Accept Extension

**專為 Cursor 設計的自動接受程式碼建議擴展套件**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/s123104/cursor-auto-accept-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Cursor Specific](https://img.shields.io/badge/Cursor-Specific-orange.svg)](https://cursor.sh)

## ⚠️ 重要聲明

**此擴展專門針對 Cursor 編輯器設計，由於 Cursor 更新可能導致功能失效，請謹慎使用。**

## 📋 功能特性

### 🔄 自動化功能

- ✅ 自動接受 Accept 建議
- ✅ 自動套用 Apply 變更
- ✅ 自動執行 Run 命令
- ✅ 自動執行 Execute 操作
- ✅ 自動恢復 Resume 工作流程

### 📊 分析與追蹤

- 📈 檔案修改統計
- ⏱️ ROI（投資回報率）計算
- 💾 資料持久化存儲
- 📊 詳細分析報告
- 📤 資料匯出功能

### 🎛️ 控制介面

- 🖥️ 美觀的控制面板
- ⚙️ 靈活的設定選項
- 🔧 即時功能切換
- 📱 響應式設計

## 🚨 相容性警告

| Cursor 版本 | 相容性      | 說明                      |
| ----------- | ----------- | ------------------------- |
| 最新版本    | ⚠️ 可能失效 | Cursor 更新可能破壞相容性 |
| 舊版本      | ✅ 相對穩定 | 建議固定 Cursor 版本      |

**建議：**

- 📌 使用前備份您的 Cursor 設定
- 🔒 考慮固定 Cursor 版本
- 📞 遇到問題請及時回報

## 🛠️ 安裝方式

### 方式 1：VS Code Marketplace（推薦）

```bash
# 在 VS Code/Cursor 中搜尋
"Cursor Auto Accept Extension"
```

### 方式 2：手動安裝 .vsix

```bash
# 下載 .vsix 文件後執行
code --install-extension cursor-auto-accept-extension-1.0.0.vsix
```

### 方式 3：開發者安裝

```bash
# 克隆儲存庫
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 執行自動安裝腳本
chmod +x setup.sh
./setup.sh
```

## 🎮 使用方法

### 基本操作

1. **啟動擴展**

   - 安裝後自動啟動
   - 狀態列顯示 "⚡ Auto Accept"

2. **切換功能**

   - 快捷鍵：`Ctrl+Shift+A` (Windows/Linux)
   - 快捷鍵：`Cmd+Shift+A` (Mac)

3. **開啟控制面板**
   - 快捷鍵：`Ctrl+Shift+P` (Windows/Linux)
   - 快捷鍵：`Cmd+Shift+P` (Mac)
   - 或點擊狀態列圖示

### 設定選項

| 設定項目                           | 預設值 | 說明                 |
| ---------------------------------- | ------ | -------------------- |
| `cursorAutoAccept.enabled`         | `true` | 啟用自動接受功能     |
| `cursorAutoAccept.interval`        | `2000` | 檢查間隔（毫秒）     |
| `cursorAutoAccept.enableAcceptAll` | `true` | 啟用 Accept All 按鈕 |
| `cursorAutoAccept.enableAccept`    | `true` | 啟用 Accept 按鈕     |
| `cursorAutoAccept.enableRun`       | `true` | 啟用 Run 按鈕        |
| `cursorAutoAccept.enableApply`     | `true` | 啟用 Apply 按鈕      |
| `cursorAutoAccept.enableExecute`   | `true` | 啟用 Execute 按鈕    |
| `cursorAutoAccept.enableResume`    | `true` | 啟用 Resume 按鈕     |

## 📊 分析功能

### ROI 追蹤

- **時間節省計算**：自動 vs 手動工作流程
- **效率統計**：操作次數和頻率
- **歷史記錄**：長期使用分析

### 檔案統計

- **修改次數**：每個檔案的接受次數
- **行數變化**：增加/刪除的程式碼行數
- **時間戳記**：詳細的操作時間記錄

## 🧪 測試

```bash
# 執行所有測試
npm test

# 監視模式
npm run test:watch

# 測試覆蓋率
npm run test:coverage
```

### 測試涵蓋範圍

- ✅ 擴展激活和命令註冊
- ✅ 自動接受服務功能
- ✅ 分析管理器功能
- ✅ Webview 面板功能
- ✅ 配置管理

## 🔧 開發

### 環境需求

- Node.js 18.x+
- npm 8.x+
- VS Code 1.96.0+

### 開發流程

```bash
# 安裝依賴
npm install

# 編譯 TypeScript
npm run compile

# 監視模式編譯
npm run watch

# 執行測試
npm test

# 打包擴展
npm run package

# 清理建置檔案
npm run clean
```

### 專案結構

```
cursor-auto-accept-extension/
├── src/                    # 原始碼
│   ├── extension.ts        # 主要入口點
│   ├── analytics.ts        # 分析管理器
│   ├── autoAcceptService.ts # 自動接受服務
│   ├── webviewPanel.ts     # UI 面板管理
│   └── test/               # 測試檔案
├── package.json            # 擴展配置
├── tsconfig.json          # TypeScript 配置
├── setup.sh               # 自動安裝腳本
└── README.md              # 說明文檔
```

## 🚨 已知限制

### 技術限制

1. **DOM 操作限制**：VS Code 擴展無法直接操作編輯器 DOM
2. **API 限制**：無法直接點擊 Cursor UI 按鈕
3. **相容性風險**：Cursor 更新可能破壞功能

### 解決方案

- 使用 VS Code Commands API 間接實現功能
- 提供替代的自動化操作
- 定期更新以適應 Cursor 變更

## 🔄 更新紀錄

### v1.0.0 (2025-06-11)

- 🎉 初始版本發布
- ✨ 基本自動接受功能
- 📊 分析和 ROI 追蹤
- 🎛️ 控制面板介面
- 🧪 完整測試套件

## 🤝 貢獻

歡迎貢獻！請閱讀我們的貢獻指南：

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案。

## 📞 支援

- 🐛 **問題回報**：[GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)
- 💬 **討論**：[GitHub Discussions](https://github.com/s123104/cursor-auto-accept-extension/discussions)
- 📧 **聯絡**：s123104@example.com

## ⭐ 認可

如果這個專案對您有幫助，請給我們一個星星！⭐

---

**⚠️ 免責聲明：此擴展為非官方工具，與 Cursor 官方無關。使用風險自負。**
