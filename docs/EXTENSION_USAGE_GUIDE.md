# 🚀 Cursor Auto Accept Extension 使用指南

## 📦 安裝方法

### 方法一：從 VSIX 檔案安裝（推薦）

1. **下載擴展包**

   - 從專案根目錄找到 `cursor-auto-accept-extension-1.0.0.vsix` 檔案
   - 檔案大小約 33KB

2. **在 VS Code 中安裝**

   ```bash
   # 方法 1: 使用命令行
   code --install-extension cursor-auto-accept-extension-1.0.0.vsix

   # 方法 2: 使用 VS Code UI
   ```

   - 開啟 VS Code
   - 按 `Ctrl+Shift+P` 開啟命令面板
   - 輸入 `Extensions: Install from VSIX...`
   - 選擇 `cursor-auto-accept-extension-1.0.0.vsix` 檔案

3. **重新載入 VS Code**
   - 安裝完成後，重新載入 VS Code 視窗

### 方法二：開發模式安裝

```bash
# 1. 克隆專案
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 2. 安裝依賴
npm install

# 3. 編譯擴展
npm run compile

# 4. 在 VS Code 中按 F5 進入開發模式
```

## 🎯 功能介紹

### 核心功能

1. **自動接受程式碼建議** 🤖

   - 自動偵測並點擊 "Accept"、"Accept All" 按鈕
   - 支援 "Run"、"Apply"、"Execute" 等操作按鈕
   - 智能辨識 "Resume Conversation" 連結

2. **檔案分析與追蹤** 📊

   - 即時追蹤修改的檔案
   - 統計程式碼增減行數
   - 記錄接受操作的歷史

3. **ROI (投資回報率) 計算** ⚡

   - 計算節省的時間
   - 分析生產力提升
   - 工作流程效率統計

4. **互動式控制面板** 🎮
   - 三分頁設計：主面板、分析、ROI
   - 即時狀態顯示
   - 詳細的操作日誌

## 🛠️ 使用方法

### 基本操作

#### 1. 啟動擴展

- **方法一**：按 `Ctrl+Shift+A` (Mac: `Cmd+Shift+A`)
- **方法二**：命令面板 → `Cursor Auto Accept: Toggle`
- **方法三**：點擊狀態列的 "⚡ Auto Accept" 按鈕

#### 2. 開啟控制面板

- **方法一**：按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
- **方法二**：命令面板 → `Cursor Auto Accept: Show Panel`
- **方法三**：點擊狀態列按鈕

#### 3. 查看分析報告

- 命令面板 → `Cursor Auto Accept: Show Analytics`
- 或在控制面板中點擊 "分析" 標籤頁

### 控制面板功能

#### 主面板標籤

- **狀態指示器**：顯示當前運行狀態
- **點擊計數器**：顯示自動點擊次數
- **控制按鈕**：開始/停止/設定
- **ROI 摘要**：即時顯示節省時間

#### 分析標籤

- **會話統計**：當前會話的詳細數據
- **檔案活動**：修改檔案的清單和統計
- **按鈕類型分析**：不同操作的使用頻率
- **資料匯出**：支援 JSON 格式匯出

#### ROI 標籤

- **時間節省統計**：詳細的時間分析
- **生產力指標**：效率提升百分比
- **工作流程比較**：手動 vs 自動化比較
- **趨勢預測**：日/週/月的時間節省預測

## ⚙️ 設定選項

### 在 VS Code 設定中配置

1. 開啟設定：`File` > `Preferences` > `Settings`
2. 搜尋 `cursorAutoAccept`
3. 可用的設定選項：

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

### 設定說明

| 設定項目                   | 預設值  | 說明                         |
| -------------------------- | ------- | ---------------------------- |
| `enabled`                  | `true`  | 是否啟用擴展                 |
| `interval`                 | `2000`  | 檢測間隔（毫秒）             |
| `enableAcceptAll`          | `true`  | 啟用 "Accept All" 按鈕       |
| `enableAccept`             | `true`  | 啟用 "Accept" 按鈕           |
| `enableRun`                | `true`  | 啟用 "Run" 按鈕              |
| `enableApply`              | `true`  | 啟用 "Apply" 按鈕            |
| `enableExecute`            | `true`  | 啟用 "Execute" 按鈕          |
| `enableResume`             | `true`  | 啟用 "Resume" 連結           |
| `debugMode`                | `false` | 啟用除錯模式                 |
| `averageCompleteWorkflow`  | `30000` | 手動工作流程平均時間（毫秒） |
| `averageAutomatedWorkflow` | `100`   | 自動工作流程平均時間（毫秒） |

## 🎮 快捷鍵

| 快捷鍵         | 功能     | 說明                  |
| -------------- | -------- | --------------------- |
| `Ctrl+Shift+A` | 切換擴展 | 開啟/關閉自動接受功能 |
| `Ctrl+Shift+P` | 開啟面板 | 顯示控制面板          |

_Mac 用戶請將 `Ctrl` 替換為 `Cmd`_

## 📊 資料管理

### 匯出分析資料

1. 開啟控制面板
2. 切換到 "分析" 標籤
3. 點擊 "匯出資料" 按鈕
4. 選擇儲存位置
5. 檔案格式：`cursor-auto-accept-extension-YYYY-MM-DD.json`

### 清除資料

1. 開啟控制面板
2. 切換到 "分析" 標籤
3. 點擊 "清除資料" 按鈕
4. 確認清除操作

### 資料結構

```json
{
  "analytics": {
    "sessionStart": "2025-06-11T15:49:06+08:00",
    "totalAccepts": 150,
    "files": {...},
    "sessions": [...],
    "buttonTypeCounts": {...}
  },
  "roiTracking": {
    "totalTimeSaved": 450000,
    "workflowSessions": [...],
    "codeGenerationSessions": [...]
  },
  "totalClicks": 150,
  "savedAt": "2025-06-11T15:49:06+08:00"
}
```

## 🚨 注意事項

### 重要提醒

1. **專為 Cursor 設計**：此擴展專門為 Cursor 編輯器優化
2. **更新影響**：Cursor 更新可能導致功能暫時失效
3. **備用腳本**：如果擴展失效，可使用 `autoAccept.js` 備用腳本

### 使用建議

1. **定期備份資料**：匯出分析資料以防丟失
2. **適度使用**：建議在需要時才啟用，避免過度依賴
3. **檢查設定**：根據個人習慣調整設定參數

### 疑難排解

1. **擴展無法啟動**

   - 檢查 VS Code 版本是否 ≥ 1.96.0
   - 重新安裝擴展
   - 查看 VS Code 開發者工具的錯誤訊息

2. **無法偵測按鈕**

   - 確認正在使用 Cursor 編輯器
   - 檢查 Cursor 是否有更新
   - 啟用除錯模式查看詳細日誌

3. **效能問題**
   - 調整檢測間隔時間
   - 關閉不需要的按鈕類型
   - 定期清除分析資料

## 🔧 開發者資訊

### 專案結構

```
cursor-auto-accept-extension/
├── src/                    # 原始碼
│   ├── extension.ts        # 主擴展檔案
│   ├── analytics.ts        # 分析功能
│   ├── autoAcceptService.ts # 自動接受服務
│   └── webviewPanel.ts     # 控制面板
├── dist/                   # 編譯輸出
└── autoAccept.js          # 備用腳本
```

### 建置指令

```bash
npm run compile      # 編譯
npm run package:vsix # 打包
npm run lint         # 檢查程式碼
npm run format       # 格式化
```

## 📞 支援與回饋

- **GitHub Issues**: [報告問題](https://github.com/s123104/cursor-auto-accept-extension/issues)
- **功能建議**: 在 Issues 中提出新功能想法
- **文檔改進**: 歡迎提交 Pull Request

---

**🎉 享受更高效的 Cursor 程式開發體驗！**
