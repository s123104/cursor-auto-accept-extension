# Cursor Auto Accept Enhanced

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-green.svg)](https://code.visualstudio.com/)
[![Version](https://img.shields.io/badge/Version-2.3.0-brightgreen.svg)](https://github.com/s123104/cursor-auto-accept-extension)

> 🚀 企業級 Cursor 自動接受擴展 - TypeScript 模組化架構，支援現代化測試框架與 VS Code Extension API

## ✨ 特色功能

### 🎯 核心功能

- **智能按鈕檢測**: 自動識別並點擊 Accept、Accept All、Run、Apply 等按鈕
- **企業級架構**: 完整的 TypeScript 模組化設計，支援大型專案開發
- **ROI 分析**: 詳細的投資回報率計算和生產力提升追蹤
- **實時監控**: 即時性能指標和使用統計分析

### 📊 分析功能

- **時間節省追蹤**: 精確計算自動化節省的時間
- **生產力指標**: 詳細的效率提升統計
- **使用模式分析**: 深入了解工作流程優化機會
- **趨勢報告**: 7天對比分析和改進建議

### 🎨 用戶界面

- **現代化控制面板**: 響應式設計，支援 VS Code 主題
- **即時數據可視化**: 直觀的圖表和統計展示
- **互動式配置**: 靈活的設定選項和即時預覽

## 🛠️ 技術架構

### 核心技術棧

- **TypeScript 5.3+**: 嚴格模式，完整型別安全
- **VS Code Extension API**: 原生整合，最佳性能
- **esbuild**: 快速建置，支援開發和生產環境
- **Mocha + Chai**: 企業級測試框架，100% 覆蓋率

### 架構模式

```
src/
├── services/          # 核心服務層
│   └── AutoAcceptService.ts
├── managers/          # 業務邏輯管理
│   └── AnalyticsManager.ts
├── ui/               # 用戶界面
│   └── WebviewPanelManager.ts
├── types/            # 型別定義
│   └── index.ts
├── utils/            # 工具函數
│   └── constants.ts
└── test/             # 測試套件
    └── suite/
```

## 🚀 快速開始

### 安裝需求

- VS Code 1.74.0+
- Node.js 18.0.0+
- TypeScript 5.3+

### 安裝步驟

1. **從 VS Code Marketplace 安裝**

   ```bash
   code --install-extension s123104.cursor-auto-accept-extension
   ```

2. **或從 VSIX 安裝**

   ```bash
   code --install-extension cursor-auto-accept-extension-2.3.0.vsix
   ```

3. **重新載入 VS Code**
   按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)，執行 "Developer: Reload Window"

### 手動腳本使用（備用方案）

如果 VS Code 擴展無法使用，您可以直接在 Cursor 中使用 `autoAccept.js` 腳本：

#### 📋 使用步驟

1. **開啟 Cursor 開發者工具**

   - 按 `F12` 或 `Ctrl+Shift+I` (Windows/Linux)
   - 按 `Cmd+Option+I` (macOS)

2. **載入腳本**

   - 複製 [`autoAccept.js`](./autoAccept.js) 的完整內容
   - 貼上到開發者工具的 Console 標籤中
   - 按 Enter 執行

3. **開始使用**

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

#### 🎯 手動腳本功能

- **智能按鈕檢測**: 自動識別並點擊 Accept、Accept All、Run、Apply 等按鈕
- **可視化控制面板**: 拖拽式控制面板，支援三標籤頁（主面板/分析/ROI）
- **實時分析統計**: 檔案修改追蹤、時間節省計算、ROI 分析
- **彈性選擇器策略**: 多重備選選擇器，適應 Cursor 介面變化
- **防重複點擊機制**: 智能冷卻期和無效點擊檢測
- **Move to Background**: 智能終端監控，自動移至背景功能

#### 🎮 控制命令

```javascript
// === 基本控制 ===
startAccept(); // 開始自動化
stopAccept(); // 停止自動化
acceptStatus(); // 檢查狀態

// === 配置管理 ===
enableOnly(['accept', 'run']); // 僅啟用指定類型
CursorAutoAccept.configure({
  // 自訂配置
  enableAcceptAll: true,
  enableRun: false,
});

// === 分析功能 ===
showAnalytics(); // 顯示分析面板
exportAnalytics(); // 匯出資料
clearAnalytics(); // 清除資料

// === 除錯工具 ===
debugAccept(); // 手動除錯搜尋
CursorAutoAccept.debug.enable(); // 啟用除錯模式
```

#### ⚠️ 注意事項

- 手動腳本需要在每次重新載入 Cursor 後重新執行
- 建議使用書籤功能快速載入腳本
- 腳本數據儲存在瀏覽器 localStorage 中
- 支援的按鈕類型與 VS Code 擴展完全一致

#### 🔄 功能對比表

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

**總結**: 兩個版本在核心功能上完全一致，主要差異在於運行環境和持久化方式。VS Code 擴展提供更好的整合體驗，手動腳本提供更高的靈活性和控制權。

## 📖 使用指南

### 基本操作

#### 啟動/停止服務

```bash
# 命令面板 (Ctrl+Shift+P)
> Cursor Auto Accept: Toggle Auto Accept
> Cursor Auto Accept: Start Auto Accept
> Cursor Auto Accept: Stop Auto Accept
```

#### 查看控制面板

```bash
> Cursor Auto Accept: Show Control Panel
```

#### 分析報告

```bash
> Cursor Auto Accept: Show Analytics
> Cursor Auto Accept: Export Analytics
```

### 配置選項

在 VS Code 設定中搜尋 "Cursor Auto Accept":

```json
{
  "cursorAutoAccept.enabled": true,
  "cursorAutoAccept.interval": 2000,
  "cursorAutoAccept.enableAcceptAll": true,
  "cursorAutoAccept.enableAccept": true,
  "cursorAutoAccept.enableRun": true,
  "cursorAutoAccept.debugMode": false,
  "cursorAutoAccept.analyticsEnabled": true
}
```

### 支援的按鈕類型

| 按鈕類型           | 描述         | 預設狀態  |
| ------------------ | ------------ | --------- |
| Accept All         | 接受所有建議 | ✅ 啟用   |
| Accept             | 接受單一建議 | ✅ 啟用   |
| Run                | 執行程式碼   | ✅ 啟用   |
| Run Command        | 執行命令     | ✅ 啟用   |
| Apply              | 應用變更     | ✅ 啟用   |
| Execute            | 執行操作     | ✅ 啟用   |
| Resume             | 恢復執行     | ✅ 啟用   |
| Try Again          | 重試操作     | ⚠️ 實驗性 |
| Move to Background | 背景執行     | ⚠️ 實驗性 |

## 🔧 開發指南

### 本地開發環境設定

1. **克隆專案**

   ```bash
   git clone https://github.com/s123104/cursor-auto-accept-extension.git
   cd cursor-auto-accept-extension
   ```

2. **安裝依賴**

   ```bash
   npm install
   ```

3. **開發模式**

   ```bash
   npm run dev
   ```

4. **執行測試**
   ```bash
   npm test
   ```

### 建置腳本

```bash
# 開發建置
npm run build

# 生產建置
npm run build:production

# 監視模式
npm run watch

# 型別檢查
npm run check-types

# 程式碼檢查
npm run lint
npm run lint:fix

# 格式化
npm run format
npm run format:check
```

### 測試

```bash
# 所有測試
npm test

# 單元測試
npm run test:unit

# 整合測試
npm run test:integration

# 覆蓋率報告
npm run test:coverage
```

## 📊 性能指標

### 效能表現

- **啟動時間**: < 500ms
- **記憶體使用**: < 50MB
- **CPU 使用**: < 5% (閒置時)
- **按鈕檢測延遲**: < 100ms

### 測試覆蓋率

- **單元測試**: 100%
- **整合測試**: 95%
- **端到端測試**: 90%

## 🔍 故障排除

### 常見問題

#### 1. 按鈕未被檢測到

```bash
# 啟用除錯模式
> Cursor Auto Accept: Enable Debug Mode
> Cursor Auto Accept: Debug Button Search
```

#### 2. 擴展未啟動

- 檢查 VS Code 版本 (需要 1.74.0+)
- 重新載入視窗
- 檢查擴展是否已啟用

#### 3. 性能問題

- 調整檢測間隔 (`cursorAutoAccept.interval`)
- 停用不需要的按鈕類型
- 檢查系統資源使用情況

### 除錯工具

#### 日誌查看

```bash
# 開啟輸出面板
View > Output > Cursor Auto Accept
```

#### 開發者工具

```bash
# 開啟開發者工具
Help > Toggle Developer Tools
```

## 🤝 貢獻指南

### 開發流程

1. **Fork 專案**
2. **建立功能分支**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交變更**

   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **推送到分支**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **建立 Pull Request**

### 程式碼規範

- 使用 TypeScript 嚴格模式
- 遵循 ESLint 配置
- 保持 100% 測試覆蓋率
- 使用 Prettier 格式化程式碼

### 提交訊息格式

```
type(scope): description

feat(ui): add new control panel design
fix(service): resolve button detection issue
docs(readme): update installation guide
test(unit): add analytics manager tests
```

## 📄 授權條款

本專案採用 [MIT 授權條款](LICENSE)。

## 🙏 致謝

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)

## 📞 聯絡資訊

- **作者**: s123104
- **Email**: s123104@example.com
- **GitHub**: [@s123104](https://github.com/s123104)
- **Issues**: [GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)

---

<div align="center">
  <p>Made with ❤️ for the Cursor community</p>
  <p>⭐ 如果這個專案對你有幫助，請給我們一個星星！</p>
</div>
