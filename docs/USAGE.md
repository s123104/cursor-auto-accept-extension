# 使用說明 - Cursor 自動接受腳本

> **原專案來源**：[true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)  
> **原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)  
> **繁體中文版本更新時間**：2025-06-11T11:38:41+08:00

## 📖 目錄

1. [基本操作](#基本操作)
2. [控制面板功能](#控制面板功能)
3. [控制台命令](#控制台命令)
4. [進階配置](#進階配置)
5. [分析功能](#分析功能)
6. [除錯工具](#除錯工具)
7. [最佳實踐](#最佳實踐)
8. [疑難排解](#疑難排解)

## 🎮 基本操作

### 啟動和停止

**透過控制面板：**

- 點擊控制面板中的「開始」按鈕啟動自動化
- 點擊「停止」按鈕停止自動化
- 狀態會即時顯示在面板上方

**透過控制台命令：**

```javascript
// 開始自動化
startAccept();

// 停止自動化
stopAccept();

// 檢查目前狀態
acceptStatus();
```

### 控制面板操作

**顯示/隱藏控制面板：**

```javascript
// 顯示控制面板
globalThis.simpleAccept.showControlPanel();

// 隱藏控制面板
globalThis.simpleAccept.hideControlPanel();
```

**移動控制面板：**

- 點擊並拖曳面板頂部的標題區域
- 面板會自動貼齊螢幕邊界
- 如果拖曳到螢幕外，使用命令重置位置

## 🎛️ 控制面板功能

### 主面板分頁

**狀態顯示：**

- 🟢 **執行中**：腳本正在自動偵測和點擊按鈕
- 🔴 **已停止**：腳本處於待機狀態
- 📊 **點擊計數**：顯示目前會話的總點擊次數

**控制按鈕：**

- **開始**：啟動自動化功能
- **停止**：停止自動化功能
- **設定**：展開/收合按鈕類型配置選項

**配置選項：**

- ✅ **全部接受**：自動點擊「Accept All」按鈕
- ✅ **接受**：自動點擊「Accept」按鈕
- ✅ **執行**：自動點擊「Run」和「Run Command」按鈕
- ✅ **套用**：自動點擊「Apply」和「Execute」按鈕
- ✅ **繼續對話**：自動點擊「Resume Conversation」連結

**活動日誌：**

- 即時顯示腳本活動
- 包含時間戳、檔案名稱、操作類型
- 顏色編碼不同類型的訊息

**ROI 資訊：**

- 顯示總節省時間
- 顯示工作流程效率百分比

### 分析分頁

**會話統計：**

- 會話持續時間
- 總接受次數
- 修改檔案數量
- 增加/刪除行數統計

**按鈕類型分析：**

- 🟢 **接受/全部接受**：標準檔案修改操作
- 🟠 **執行/執行命令**：程式碼執行操作
- 🔵 **繼續對話**：會話續接操作
- 🟣 **套用/執行**：其他應用操作

**檔案活動列表：**

- 個別檔案的修改次數
- 每個檔案的程式碼變更統計
- 最後修改時間
- 按最近活動排序

**資料管理：**

- **匯出資料**：將分析資料儲存為 JSON 檔案
- **清除資料**：重置所有分析統計

### ROI 分頁

**時間節省指標：**

- 總節省時間（累積）
- 會話持續時間
- 每次操作平均節省時間
- 生產力提升百分比

**影響分析：**

- 每日節省時間預測
- 每週節省時間預測
- 每月節省時間預測

**工作流程比較：**

- 手動工作流程時間
- 自動工作流程時間
- 效率提升百分比

## 💻 控制台命令

### 基本控制命令

```javascript
// === 啟動和停止 ===
startAccept(); // 開始自動化
stopAccept(); // 停止自動化
acceptStatus(); // 檢查狀態
debugAccept(); // 手動除錯搜尋

// === 面板控制 ===
globalThis.simpleAccept.showControlPanel(); // 顯示控制面板
globalThis.simpleAccept.hideControlPanel(); // 隱藏控制面板
```

### 配置管理命令

```javascript
// === 按鈕類型控制 ===
enableOnly(['accept', 'run']); // 僅啟用指定類型
enableAll(); // 啟用所有按鈕類型
disableAll(); // 停用所有按鈕類型

// === 個別按鈕控制 ===
enableButton('accept'); // 啟用特定類型
disableButton('execute'); // 停用特定類型
toggleButton('resume'); // 切換特定類型

// === 支援的按鈕類型 ===
// 'accept', 'acceptAll', 'run', 'runCommand', 'apply', 'execute', 'resume'
```

### 分析與資料命令

```javascript
// === 分析檢視 ===
showAnalytics(); // 切換到分析分頁
exportAnalytics(); // 匯出資料為 JSON
clearAnalytics(); // 清除分析資料
validateData(); // 檢查資料完整性

// === 儲存管理 ===
clearStorage(); // 清除所有儲存資料
```

### 對話分析命令

```javascript
// === 對話內容分析 ===
findDiffs(); // 找到所有 diff 區塊
getContext(); // 取得對話概觀
logActivity(); // 記錄詳細對話活動

// === 時間窗口分析 ===
recentDiffs(); // 最近 30 秒的 diff
recentDiffs(60000); // 最近 60 秒的 diff（毫秒）
```

### 除錯和診斷命令

```javascript
// === 除錯模式控制 ===
enableDebug(); // 啟用詳細除錯日誌
disableDebug(); // 停用除錯日誌
toggleDebug(); // 切換除錯模式

// === 診斷工具 ===
debugAccept(); // 手動按鈕搜尋測試
validateData(); // 驗證資料完整性
testLogs(); // 測試日誌輸出功能
```

### ROI 和時間校準命令

```javascript
// === 時間校準 ===
calibrateWorkflow(30); // 設定手動工作流程時間（30秒）
calibrateWorkflow(25, 100); // 自訂手動和自動時間（25秒, 100毫秒）
```

## ⚙️ 進階配置

### 自訂按鈕類型組合

```javascript
// 僅啟用安全操作（不包含執行命令）
enableOnly(['accept', 'acceptAll', 'apply']);

// 僅啟用程式碼相關操作
enableOnly(['accept', 'acceptAll', 'run', 'runCommand']);

// 僅啟用會話管理
enableOnly(['resume']);
```

### 時間和效率設定

```javascript
// 針對快速開發者（手動工作流程較快）
calibrateWorkflow(20); // 20 秒手動時間

// 針對謹慎開發者（手動工作流程較慢）
calibrateWorkflow(40); // 40 秒手動時間

// 自訂精確時間
calibrateWorkflow(30, 150); // 30秒手動, 150毫秒自動
```

### 除錯級別設定

```javascript
// 啟用檔案偵測除錯
enableDebug();

// 檢查對話解析狀況
getContext();

// 檢視最近的程式碼變更
findDiffs();

// 分析最近活動
logActivity();
```

## 📊 分析功能

### 檔案變更追蹤

**自動偵測的檔案資訊：**

- 檔案名稱和路徑
- 增加的程式碼行數
- 刪除的程式碼行數
- 修改時間戳
- 使用的按鈕類型

**統計資料包含：**

- 每個檔案的總修改次數
- 累積的程式碼變更量
- 不同按鈕類型的使用分布
- 修改活動的時間分析

### 會話分析

**即時統計：**

```javascript
// 檢視目前會話統計
acceptStatus();

// 檢視詳細分析
validateData();
```

**匯出功能：**

```javascript
// 匯出所有分析資料
exportAnalytics();

// 資料會儲存為 JSON 格式，包含：
// - 會話資訊（開始時間、持續時間、總操作數）
// - 按鈕類型統計
// - ROI 追蹤資料
// - 個別檔案詳細記錄
```

### ROI 計算方法

**時間節省計算基準：**

- **手動工作流程**：30 秒（預設）

  - 觀看 AI 生成程式碼：10-15 秒
  - 尋找並點擊按鈕：2-3 秒
  - 上下文切換時間：1-2 秒
  - 其他等待時間：5-10 秒

- **自動工作流程**：0.1 秒
  - 腳本即時偵測和點擊

**不同按鈕類型的時間：**

- **Accept All**：35 秒（需要更多審查時間）
- **Accept**：30 秒（基準時間）
- **Run/Execute**：32 秒（需要謹慎確認）
- **Apply**：30 秒（基準時間）
- **Resume**：33 秒（會話連續性獎勵）

## 🔍 除錯工具

### 基本除錯步驟

1. **啟用除錯模式：**

   ```javascript
   enableDebug();
   ```

2. **檢查按鈕偵測：**

   ```javascript
   debugAccept();
   ```

3. **檢視對話狀態：**

   ```javascript
   getContext();
   ```

4. **檢查資料完整性：**
   ```javascript
   validateData();
   ```

### 檔案偵測除錯

**檢查檔案提取過程：**

```javascript
// 啟用詳細檔案提取日誌
enableDebug();

// 檢視最新的 diff 區塊
findDiffs();

// 分析對話上下文
getContext();

// 檢視最近的檔案變更
recentDiffs(30000); // 最近 30 秒
```

**常見檔案偵測問題：**

- 對話中沒有最近的 diff 區塊
- 檔案名稱不在預期的 HTML 元素中
- 多個檔案同時修改時的偵測順序

### 按鈕偵測除錯

**檢查按鈕可見性：**

```javascript
// 手動搜尋按鈕
debugAccept();

// 檢查目前配置
acceptStatus();

// 測試特定按鈕類型
enableOnly(['accept']);
debugAccept();
```

**按鈕偵測失敗原因：**

- 按鈕文字變更或多語言問題
- DOM 結構變更
- 按鈕被其他元素遮蔽
- 時機問題（按鈕尚未出現）

## ✨ 最佳實踐

### 日常使用建議

**1. 啟動流程：**

```javascript
// 每次開啟 Cursor 後執行
startAccept();
acceptStatus(); // 確認運作正常
```

**2. 定期檢查：**

```javascript
// 每小時檢查一次統計
showAnalytics();

// 每日匯出資料備份
exportAnalytics();
```

**3. 效能監控：**

```javascript
// 檢查資料完整性
validateData();

// 如果資料過多，定期清理
clearAnalytics(); // 謹慎使用
```

### 安全使用建議

**1. 重要專案時暫停：**

```javascript
// 在關鍵操作前停止
stopAccept();

// 操作完成後重新啟動
startAccept();
```

**2. 選擇性啟用：**

```javascript
// 僅在安全操作時使用
enableOnly(['accept', 'acceptAll']);

// 避免自動執行危險命令
disableButton('run');
disableButton('execute');
```

**3. 定期備份設定：**

```javascript
// 匯出設定和統計
exportAnalytics();

// 儲存到安全位置
// 設定會自動保存在瀏覽器 localStorage
```

### 效能最佳化

**1. 減少不必要的按鈕類型：**

```javascript
// 如果不使用某些功能，請停用
disableButton('resume'); // 如果不需要自動繼續對話
```

**2. 適當的除錯設定：**

```javascript
// 平時關閉除錯模式以提升效能
disableDebug();

// 僅在需要時啟用
enableDebug(); // 調試時使用
```

**3. 定期資料清理：**

```javascript
// 檢查資料大小
validateData();

// 如果檔案過多，考慮清理舊資料
// 注意：這會永久刪除統計資料
clearAnalytics();
```

## 🛠️ 疑難排解

### 常見問題及解決方案

#### 1. 腳本無法載入

**症狀：** 貼上腳本後沒有任何反應
**解決方案：**

```javascript
// 檢查是否需要輸入 "allow pasting"
// 確認腳本完整複製
// 檢查控制台是否有錯誤訊息
```

#### 2. 控制面板不顯示

**症狀：** 腳本載入成功但看不到控制面板
**解決方案：**

```javascript
// 手動顯示控制面板
globalThis.simpleAccept.showControlPanel();

// 檢查面板是否被拖曳到螢幕外
globalThis.simpleAccept.hideControlPanel();
globalThis.simpleAccept.showControlPanel();
```

#### 3. 按鈕偵測失效

**症狀：** 腳本運作但不點擊按鈕
**解決方案：**

```javascript
// 啟用除錯模式
enableDebug();

// 手動測試按鈕偵測
debugAccept();

// 檢查按鈕配置
acceptStatus();

// 重新設定按鈕類型
enableAll();
```

#### 4. 檔案名稱不顯示

**症狀：** 分析中看不到檔案名稱
**解決方案：**

```javascript
// 檢查對話內容
getContext();

// 檢視 diff 區塊
findDiffs();

// 啟用檔案偵測除錯
enableDebug();
```

#### 5. 統計資料異常

**症狀：** 看到 NaN 或錯誤的數字
**解決方案：**

```javascript
// 驗證資料完整性
validateData();

// 重新校準時間設定
calibrateWorkflow(30);

// 如果問題持續，重置資料
clearStorage(); // 注意：會清除所有資料
```

### 進階疑難排解

#### DOM 結構變更問題

**當 Cursor 更新後按鈕偵測失效：**

```javascript
// 啟用詳細除錯
enableDebug();

// 手動檢查 DOM 結構
debugAccept();

// 檢查控制台的除錯訊息
// 可能需要等待原版腳本更新
```

#### 效能問題

**腳本運作緩慢或佔用資源：**

```javascript
// 減少啟用的按鈕類型
enableOnly(['accept']);

// 關閉除錯模式
disableDebug();

// 清理過多的統計資料
clearAnalytics();
```

#### 多檔案專案問題

**大型專案中的檔案偵測問題：**

```javascript
// 檢查最近的對話活動
logActivity();

// 查看最近的 diff 區塊
recentDiffs(60000); // 延長時間窗口

// 手動檢查對話上下文
getContext();
```

### 資料恢復

**如果意外清除了資料：**

- 檢查瀏覽器的 localStorage 是否有備份
- 查看是否有之前匯出的 JSON 檔案
- 重新開始統計（無法恢復歷史資料）

**預防資料遺失：**

```javascript
// 定期匯出備份
exportAnalytics();

// 在清除前先備份
exportAnalytics();
// 然後才執行 clearStorage()
```

---

## 📞 支援資源

- **原專案**：[GitHub Repository](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)
- **原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)
- **問題回報**：透過 GitHub Issues 回報問題
- **功能建議**：歡迎提出改進建議

**記住：這個工具是為了提升開發效率，請根據您的需求和舒適度調整使用方式！** 🚀
