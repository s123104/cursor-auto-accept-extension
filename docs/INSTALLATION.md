# 安裝指南 - Cursor 自動接受腳本

> **原專案來源**：[true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)  
> **原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)  
> **繁體中文版本更新時間**：2025-06-11T11:38:41+08:00

## 📋 系統需求

- **Cursor IDE**：任何版本
- **瀏覽器**：Chrome、Firefox、Safari、Edge（任何現代瀏覽器）
- **作業系統**：Windows、macOS、Linux

## 🚀 安裝方法

### 方法一：直接複製貼上（推薦）

這是最簡單且最快速的安裝方法：

1. **開啟 Cursor IDE**

2. **開啟開發者工具**

   - 點擊 **說明** → **切換開發者工具**
   - 或使用快捷鍵：
     - Windows/Linux：`Ctrl + Shift + I`
     - macOS：`Cmd + Option + I`

3. **前往控制台分頁**

   - 在開發者工具中點擊 **Console**（控制台）分頁

4. **允許貼上（如果需要）**

   - 如果出現安全提示，輸入 `allow pasting` 並按 Enter
   - 這是瀏覽器的安全功能，只需執行一次

5. **複製並貼上腳本**

   - 複製 `autoAccept.js` 檔案的全部內容
   - 在控制台中貼上程式碼
   - 按 Enter 執行

6. **確認安裝成功**
   - 您應該會看到以下訊息：
     ```
     [autoAcceptAndAnalytics] 腳本已載入並啟動！
     ✅ 自動接受控制面板已就緒！現已加入檔案分析功能
     ```
   - 螢幕右側會出現控制面板

### 方法二：檔案載入

1. **下載腳本檔案**

   - 下載 `autoAccept.js` 到您的電腦

2. **開啟檔案內容**

   - 使用任何文字編輯器開啟檔案
   - 全選並複製所有內容

3. **按照方法一的步驟 2-6 執行**

### 方法三：書籤小工具（進階）

建立瀏覽器書籤以便快速載入：

1. **建立新書籤**

   - 在瀏覽器中建立新書籤
   - 名稱：`Cursor 自動接受`

2. **設定 URL**

   ```javascript
   javascript: (function () {
     /* 在此貼上完整腳本內容 */
   })();
   ```

3. **使用方式**
   - 在 Cursor 中點擊書籤即可載入腳本

## ✅ 驗證安裝

安裝成功後，您可以透過以下方式驗證：

### 1. 視覺確認

- 螢幕右側應該出現深色控制面板
- 面板標題顯示「主面板」、「分析」、「ROI」三個分頁

### 2. 控制台測試

在控制台中執行以下命令：

```javascript
// 檢查腳本狀態
acceptStatus();

// 測試控制面板
globalThis.simpleAccept.showControlPanel();

// 檢查可用命令
console.log('可用命令: startAccept(), stopAccept(), showAnalytics()');
```

### 3. 功能測試

- 點擊面板中的「開始」按鈕
- 狀態應該變為「執行中」
- 當您在 Cursor 中產生程式碼時，腳本會自動點擊接受按鈕

## 🔧 初始設定

### 基本配置

1. **開啟控制面板**

   - 如果面板沒有顯示，在控制台執行：
     ```javascript
     globalThis.simpleAccept.showControlPanel();
     ```

2. **設定按鈕類型**

   - 點擊「設定」按鈕
   - 勾選/取消勾選要啟用的按鈕類型：
     - ✅ 全部接受
     - ✅ 接受
     - ✅ 執行
     - ✅ 套用
     - ✅ 繼續對話

3. **開始使用**
   - 點擊「開始」按鈕
   - 腳本會在背景自動運作

### 進階設定

```javascript
// 僅啟用特定按鈕類型
enableOnly(['accept', 'run']);

// 校準時間設定（手動工作流程需要 25 秒）
calibrateWorkflow(25);

// 啟用除錯模式查看詳細資訊
enableDebug();
```

## 🔄 自動啟動設定

如果您希望每次開啟 Cursor 時自動載入腳本：

### 選項 1：書籤方法

- 使用方法三建立的書籤
- 每次開啟 Cursor 時點擊書籤

### 選項 2：瀏覽器擴充功能

- 使用 Tampermonkey 或 Greasemonkey 等使用者腳本管理器
- 建立新腳本並設定在 Cursor 域名下自動執行

### 選項 3：手動載入

- 將腳本內容儲存為文字檔案
- 需要時複製貼上到控制台

## 🐛 常見問題排解

### 問題：控制台顯示「allow pasting」

**解決方案**：

- 這是瀏覽器安全功能
- 輸入 `allow pasting` 並按 Enter
- 然後再次貼上腳本

### 問題：腳本載入但沒有控制面板

**解決方案**：

```javascript
// 手動顯示控制面板
globalThis.simpleAccept.showControlPanel();
```

### 問題：腳本無法偵測按鈕

**解決方案**：

```javascript
// 啟用除錯模式
enableDebug();

// 檢查按鈕偵測
debugAccept();

// 查看目前配置
acceptStatus();
```

### 問題：控制面板被拖曳到螢幕外

**解決方案**：

```javascript
// 重置面板位置
globalThis.simpleAccept.hideControlPanel();
globalThis.simpleAccept.showControlPanel();
```

### 問題：腳本停止運作

**解決方案**：

```javascript
// 檢查執行狀態
acceptStatus();

// 重新開始
stopAccept();
startAccept();
```

## 📊 使用建議

### 最佳實踐

1. **先測試再使用**：安裝後先在簡單專案中測試
2. **檢查分析資料**：定期查看「分析」分頁了解使用情況
3. **適時停用**：在重要操作時可暫時停止腳本
4. **備份資料**：定期匯出分析資料以防遺失

### 效能最佳化

- 如果不需要某些按鈕類型，請在設定中停用
- 定期清除舊的分析資料以保持效能
- 在大型專案中可考慮降低檢查頻率

## 📞 支援與協助

如果您遇到問題：

1. **查看除錯資訊**：

   ```javascript
   enableDebug();
   validateData();
   ```

2. **檢查原始專案文件**：

   - [原專案 GitHub](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)

3. **聯絡原作者**：
   - LinkedIn：[ivalsaraj](https://linkedin.com/in/ivalsaraj)
   - Twitter：[@ivalsaraj](https://twitter.com/ivalsaraj)

## 🔄 更新說明

當有新版本時：

1. 重複安裝步驟載入新版本
2. 舊的設定和資料會自動保留
3. 檢查 `validateData()` 確認資料完整性

---

**安裝完成後，您就可以享受自動化的 Cursor 工作流程了！🚀**
