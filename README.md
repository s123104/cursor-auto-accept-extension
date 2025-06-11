# Cursor 自動接受與分析腳本 - 繁體中文版

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cursor](https://img.shields.io/badge/Cursor-Compatible-blue.svg)](https://cursor.sh/)
[![原作者 @ivalsaraj](https://img.shields.io/badge/原作者-@ivalsaraj-blue)](https://linkedin.com/in/ivalsaraj)
[![繁體中文版本](https://img.shields.io/badge/繁體中文-版本-green.svg)]()

**自動接受 Cursor AI 建議，並提供完整的分析、對話解析與投資回報率 (ROI) 追蹤功能。**

> **原專案來源**：[true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)  
> **原作者**：[Valsaraj R (@ivalsaraj)](https://linkedin.com/in/ivalsaraj)  
> **繁體中文版最後更新**：2025-06-11T11:38:41+08:00

## 🎯 功能簡介

這個進階腳本會自動點擊 Cursor IDE 中的「接受」、「全部接受」、「執行」、「繼續對話」等按鈕，讓您在 AI 輔助編程過程中無需手動點擊。它提供了對修改檔案的完整分析、對話解析、按鈕類型分類追蹤，以及**精確的時間節省與 ROI 指標計算**。

## ⚡ 核心功能

### 🤖 智能自動化

- **通用按鈕偵測**：接受、執行、套用、執行、繼續對話
- **基於對話的檔案偵測**：從對話中最新的 diff 區塊找到檔案
- **通用檔案支援**：適用於任何檔案類型（JS、CSS、Python、SQL 等）
- **自動繼續對話**：當達到 25 個工具呼叫限制時自動繼續
- **零中斷**：在背景安靜運作，維持開發流程

### 📊 進階分析

- **按鈕類型分析**：不同按鈕類型的色彩編碼追蹤
  - 🟢 **接受/全部接受**：標準檔案接受
  - 🟠 **執行/執行命令**：命令執行
  - 🔵 **繼續對話**：會話續接
  - 🟣 **套用/執行**：其他操作
- **檔案變更追蹤**：每個檔案增加/刪除的行數與時間戳
- **對話分析**：Diff 區塊偵測與開發進度監控
- **會話統計**：持續時間、點擊次數、修改檔案數、生產力指標

### ⚡ ROI 與時間追蹤

- **精確時間計算**：基於完整 AI 工作流程自動化
- **生產力提升**：編程效率的實際百分比增長
- **按鈕特定節省**：不同操作類型的不同時間值
- **會話預測**：每日/每週/每月時間節省估算

### 🎮 互動式控制面板

- **可拖曳介面**：可定位到螢幕任何位置
- **三分頁佈局**：主控制、分析、ROI 追蹤
- **即時更新**：即時活動日誌與狀態指示器
- **配置控制**：啟用/停用特定按鈕類型
- **資料匯出**：下載完整分析資料為 JSON

### 🔍 對話智能

- **Diff 區塊分析**：自動偵測對話中的程式碼變更
- **檔案變更監控**：追蹤開發會話中的修改
- **最近活動分析**：可配置的活動追蹤時間窗口
- **開發進度洞察**：了解編程速度與模式

## 🚀 安裝方式

### 方法一：複製貼上（推薦）

1. 複製 `autoAccept.js` 的全部內容
2. 開啟 Cursor → **說明** → **切換開發者工具**
3. 前往 **控制台** 分頁
4. 輸入 `allow pasting` 並按 Enter（如果有提示）
5. 貼上腳本內容並按 Enter
6. 腳本載入時會顯示 `[autoAcceptAndAnalytics] 腳本已載入並啟動！` 訊息

### 方法二：直接下載

1. 從儲存庫下載 `autoAccept.js`
2. 按照上述控制台步驟操作

### 方法三：書籤小工具

建立包含腳本內容的瀏覽器書籤以便快速載入。

## 📖 使用指南

### 🎮 基本控制

```javascript
// 開始自動化（也可用作全域快捷鍵）
startAccept();

// 停止自動化
stopAccept();

// 檢查目前狀態
acceptStatus();

// 顯示控制面板
globalThis.simpleAccept.showControlPanel();
```

### ⚙️ 配置設定

```javascript
// 僅啟用特定按鈕類型
enableOnly(["accept", "run", "resume"]);

// 啟用/停用個別類型
enableButton("accept");
disableButton("execute");
toggleButton("apply");

// 啟用/停用所有按鈕類型
enableAll();
disableAll();
```

**支援類型**：`accept`、`acceptAll`、`run`、`runCommand`、`apply`、`execute`、`resume`

### 📊 分析與資料

```javascript
// 在控制面板中顯示分析
showAnalytics();

// 匯出完整分析資料
exportAnalytics();

// 清除所有分析資料
clearAnalytics();

// 驗證資料完整性
validateData();

// 清除所有儲存並重置
clearStorage();
```

### 🔍 對話分析

```javascript
// 找到對話中的所有 diff 區塊
findDiffs();

// 取得包含檔案變更的對話概觀
getContext();

// 記錄詳細對話活動
logActivity();

// 找到最近的 diff 區塊（預設 30 秒）
recentDiffs();
recentDiffs(60000); // 自訂時間窗口（毫秒）
```

### 🐛 除錯控制

```javascript
// 啟用詳細檔案提取日誌
enableDebug();

// 停用除錯日誌
disableDebug();

// 切換除錯模式
toggleDebug();

// 手動按鈕搜尋以排除故障
debugAccept();
```

### ⚡ ROI 校準

```javascript
// 校準工作流程計時（預設：30 秒手動工作流程）
calibrateWorkflow(30);

// 自訂校準手動與自動時間
calibrateWorkflow(25, 100); // 25秒手動，100毫秒自動
```

## 🎛️ 控制面板功能

### 📊 主分頁

- **開始/停止控制**：帶有狀態指示器的大型視覺按鈕
- **即時計數器**：顯示目前會話點擊次數
- **活動日誌**：帶有檔案名稱和按鈕類型的時間戳日誌
- **配置複選框**：個別按鈕類型切換
- **狀態顯示**：執行中/已停止與會話持續時間

### 📈 分析分頁

- **會話概觀**：持續時間、總點擊次數、修改檔案
- **🎯 按鈕類型**：按鈕使用的色彩編碼細分
  - 接受/全部接受（綠色）
  - 執行/執行命令（橙色）
  - 繼續對話（藍色）
  - 套用/執行（紫色）
- **📁 檔案活動**：個別檔案修改歷史
- **匯出/清除控制**：資料管理功能

### ⚡ ROI 分頁

- **完整工作流程 ROI**：完整 AI 工作流程自動化的時間節省
- **會話指標**：總節省時間、生產力提升百分比
- **效能分析**：每次點擊平均時間、效率計算
- **影響預測**：預估每日/每週/每月節省
- **工作流程說明**：測量方法論的理解

## 🤖 繼續對話功能

### 自動會話續接

- **25 工具呼叫限制偵測**：自動偵測 Cursor 達到限制時
- **自動點擊繼續連結**：找到並點擊「繼續對話」markdown 連結
- **無縫工作流程**：在長會話期間維持開發動力
- **分析整合**：分別追蹤繼續操作並用藍色編碼
- **配置控制**：可像其他按鈕類型一樣啟用/停用

### 技術實作

```javascript
// 繼續偵測的目標元素
'.markdown-link[data-link="command:composer.resumeCurrentChat"]';

// 啟用/停用繼續功能
enableButton("resume");
disableButton("resume");
```

## 📁 通用檔案偵測

### 基於對話的方法

- **最新訊息分析**：透過 `data-message-index` 搜尋最近的對話訊息
- **Diff 區塊偵測**：在 `div.conversations` 容器中找到程式碼區塊
- **通用檔案支援**：透過模式匹配偵測任何檔案類型
- **備用系統**：多種偵測方法確保可靠性

### 支援的檔案類型

- **程式語言**：`.js`、`.ts`、`.py`、`.java`、`.cpp`、`.c`、`.cs`、`.go`、`.rust`、`.php`
- **網頁技術**：`.html`、`.css`、`.scss`、`.sass`、`.less`、`.vue`、`.jsx`、`.tsx`
- **資料格式**：`.json`、`.xml`、`.yaml`、`.yml`、`.toml`、`.csv`、`.sql`
- **配置檔案**：`.env`、`.config`、`.ini`、`.conf`、`.dockerfile`
- **文件格式**：`.md`、`.txt`、`.rst`、`.tex`
- **更多類型**：任何有副檔名的檔案

### 除錯檔案偵測

```javascript
// 啟用詳細檔案提取日誌
enableDebug();

// 檢視目前對話上下文
getContext();

// 查看最新 diff 區塊
findDiffs();
```

## 🔢 時間節省與 ROI 計算

### 工作流程時間測量

- **手動工作流程**：使用者提示 → 觀看 AI 生成 → 找按鈕 → 點擊 → 切換上下文
- **自動工作流程**：使用者提示 → 腳本自動點擊 → 繼續編程
- **時間節省**：手動與自動工作流程之間的差異

### 按鈕特定計時

```javascript
const workflowTimeSavings = {
  accept: 30000, // 30 秒基礎工作流程
  "accept-all": 35000, // +5秒額外審查時間
  run: 32000, // +2秒命令謹慎時間
  execute: 32000, // +2秒執行謹慎時間
  apply: 30000, // 30秒基礎工作流程
  resume: 33000, // +3秒對話連續性獎勵
};
```

### ROI 指標

- **總節省時間**：累積秒數/分鐘節省
- **生產力提升**：`(timeSaved / sessionDuration) * 100`
- **效率比率**：`automatedTime / manualTime * 100`
- **每次點擊平均**：`totalTimeSaved / totalClicks`

## 🛠️ 疑難排解

### 檔案名稱未顯示

```javascript
// 啟用除錯模式查看提取過程
enableDebug();

// 檢查對話上下文
getContext();

// 手動檔案偵測測試
findDiffs();
```

**常見原因**：

- 對話中沒有最近的 diff 區塊
- 檔案名稱不在預期元素中
- 除錯模式顯示確切的提取嘗試

### 分析中的 NaN 值

✅ **已修復**：所有計算現在都有安全數字驗證

- 添加 `isNaN()` 檢查，預設為 0
- 保護除法運算
- 全程安全變數處理

### 按鈕偵測問題

```javascript
// 手動除錯搜尋
debugAccept();

// 檢查哪些按鈕已啟用
acceptStatus();

// 測試特定按鈕類型
enableOnly(["accept"]);
```

### 控制面板問題

```javascript
// 強制顯示面板
globalThis.simpleAccept.showControlPanel();

// 重置面板位置（如果拖曳到螢幕外）
globalThis.simpleAccept.hideControlPanel();
globalThis.simpleAccept.showControlPanel();
```

### 控制台錯誤

✅ **TrustedHTML 已修復**：使用 DOM 建立而非 innerHTML
✅ **安全合規**：沒有直接 HTML 注入
✅ **跨瀏覽器相容**：現代 JavaScript 標準

## 📊 分析資料結構

### 匯出的 JSON 格式

```json
{
  "session": {
    "start": "2025-06-11T11:38:41+08:00",
    "duration": 3600000,
    "totalAccepts": 67
  },
  "buttonTypeCounts": {
    "接受": 42,
    "執行": 15,
    "繼續對話": 8,
    "套用": 2
  },
  "roiTracking": {
    "totalTimeSaved": 201000,
    "averageCompleteWorkflow": 30000,
    "productivityGain": 18.5
  },
  "files": {
    "autoAccept.js": {
      "acceptCount": 15,
      "totalAdded": 387,
      "totalDeleted": 45,
      "buttonTypes": {
        "接受": 12,
        "套用": 3
      },
      "lastAccepted": "2025-06-11T11:38:41+08:00"
    }
  }
}
```

## 🔗 進階命令參考

### 全域快捷鍵

```javascript
startAccept(); // 開始自動化
stopAccept(); // 停止自動化
acceptStatus(); // 檢查狀態
debugAccept(); // 除錯搜尋
```

### 配置

```javascript
enableOnly(["accept", "run"]); // 僅啟用指定類型
enableAll(); // 啟用所有按鈕類型
disableAll(); // 停用所有按鈕類型
toggleButton("resume"); // 切換特定類型
enableButton("apply"); // 啟用特定類型
disableButton("execute"); // 停用特定類型
```

### 分析

```javascript
showAnalytics(); // 切換到分析分頁
exportAnalytics(); // 匯出資料為 JSON
clearAnalytics(); // 清除分析資料
clearStorage(); // 重置所有內容
validateData(); // 檢查資料完整性
```

### 除錯

```javascript
enableDebug(); // 啟用檔案提取日誌
disableDebug(); // 停用除錯日誌
toggleDebug(); // 切換除錯模式
```

### 對話分析

```javascript
findDiffs(); // 找到所有 diff 區塊
getContext(); // 取得對話概觀
logActivity(); // 記錄最近活動
recentDiffs(60000); // 最近 diff（60秒窗口）
```

### 校準

```javascript
calibrateWorkflow(30); // 設定手動工作流程時間（30秒）
calibrateWorkflow(25, 100); // 自訂手動 + 自動計時
```

## 🎨 UI 自訂

### 控制面板

- **可拖曳**：點擊並拖曳標頭以重新定位
- **可最小化**：點擊最小化按鈕隱藏內容
- **可調整大小**：調整分頁和內容區域
- **色彩編碼**：不同按鈕類型的不同顏色
- **深色主題**：具有漸層的專業深色介面

### 按鈕類型顏色

- 🟢 **接受/全部接受**：`#4CAF50`（綠色）
- 🟠 **執行/執行命令**：`#FF9800`（橙色）
- 🔵 **繼續對話**：`#2196F3`（藍色）
- 🟣 **套用/執行**：`#9C27B0`（紫色）

## 📈 效能與影響

### 典型會話結果

- **1 小時會話中 50 次自動點擊**
- **2.5 分鐘直接時間節省**（僅點擊時間）
- **15-20% 生產力提升**（包括維持流暢狀態）
- **減少認知負荷**，無需手動觀看按鈕
- **更好的專注**於實際編程而非 UI 互動

### 工作流程效率

- **手動**：每次 AI 互動週期 30-35 秒
- **自動**：每次互動 0.1-0.5 秒
- **效率提升**：按鈕互動時間減少 99%+
- **流暢狀態**：維持專注於編程而非 UI 點擊

## 🔒 隱私與安全

- **無資料傳輸**：所有分析資料儲存在瀏覽器本機
- **無外部請求**：腳本完全離線運作
- **僅 localStorage**：資料保存在瀏覽器儲存空間
- **開源**：所有功能完全透明
- **無追蹤**：沒有分析資料傳送到外部伺服器

## 🆕 近期更新

### 版本 2.0（2024 年 12 月）

- ✅ **通用檔案偵測**：適用於任何檔案類型
- ✅ **基於對話的分析**：Diff 區塊偵測
- ✅ **繼續對話支援**：25 工具限制時自動繼續
- ✅ **按鈕分析分離**：色彩編碼按鈕類型追蹤
- ✅ **增強除錯日誌**：詳細檔案提取除錯
- ✅ **修復 NaN 問題**：全程安全數字驗證
- ✅ **改善 UI**：更好的分析顯示與控制

## 🤝 貢獻

1. Fork 儲存庫
2. 建立功能分支（`git checkout -b feature/amazing-feature`）
3. 提交變更（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 開啟 Pull Request

## 📄 授權

MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案。

## 👨‍💻 原作者

**Valsaraj R** ([@ivalsaraj](https://linkedin.com/in/ivalsaraj))

- 🐦 X：[@ivalsaraj](https://twitter.com/ivalsaraj)
- 💼 LinkedIn：[ivalsaraj](https://linkedin.com/in/ivalsaraj)
- 🌐 網站：[valsaraj.com](https://valsaraj.com)

## 🇹🇼 繁體中文版本

本版本為原專案的繁體中文翻譯版本，保持所有原始功能並遵循 MIT 授權。

**繁體中文版更新時間**：2025-06-11T11:38:41+08:00  
**原專案**：[true-yolo-cursor-auto-accept-full-agentic-mode](https://github.com/ivalsaraj/true-yolo-cursor-auto-accept-full-agentic-mode)

## ⭐ 支援

如果這個腳本為您節省時間並改善您的 Cursor 工作流程，請：

- ⭐ 為此儲存庫加星
- 🐛 回報錯誤或請求功能
- 📢 與其他 Cursor 使用者分享
- 💡 貢獻改進

---

<div align="center">
  <strong>使用自動化 Cursor 快樂編程！🚀</strong>
  <br>
  <em>透過智能 AI 工作流程自動化最大化您的生產力</em>
</div>
