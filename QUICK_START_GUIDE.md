# 🚀 Cursor Auto Accept 快速開始指南

## 🎯 立即體驗新控制面板

### 📦 步驟 1：安裝擴展

**方法 A：透過 VSIX 檔案安裝**

1. 在 VS Code 中按 `Ctrl+Shift+P`
2. 輸入 "Extensions: Install from VSIX..."
3. 選擇 `cursor-auto-accept-extension-1.0.0.vsix` 檔案
4. 重新載入 VS Code

**方法 B：開發模式**

```bash
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension
npm install
npm run compile
# 在 VS Code 中按 F5 進入開發模式
```

### ⚡ 步驟 2：開啟控制面板

**最快方式：**

- 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
- 或點擊編輯器右上角的 📊 按鈕（在 .js/.ts 檔案中可見）

**其他方式：**

- 命令面板 → `Cursor Auto Accept: Show Control Panel`
- 點擊狀態列的 "⚡ Auto Accept" 按鈕

### 🎮 步驟 3：探索控制面板

#### 主面板標籤 🏠

- **狀態控制**：一鍵開始/停止自動接受功能
- **即時統計**：查看當前會話的點擊次數和節省時間
- **按鈕配置**：勾選想要自動點擊的按鈕類型
- **活動日誌**：查看即時的操作記錄

#### 分析標籤 📊

- **會話統計**：詳細的使用數據和時間追蹤
- **檔案活動**：查看被修改的檔案和程式碼變更
- **按鈕分析**：各種按鈕類型的使用頻率
- **資料管理**：匯出或清除所有分析資料

#### ROI 標籤 💰

- **時間節省**：計算總節省時間和效率提升
- **工作流程對比**：手動 vs 自動化的效率比較
- **生產力指標**：量化的工作效率改進數據

## 🎯 立即試用建議

### 1. 基本使用流程

1. **開啟控制面板** (`Ctrl+Shift+P`)
2. **點擊 "開始"** 啟動自動接受功能
3. **在 Cursor 中進行 AI 對話**，讓擴展自動點擊按鈕
4. **查看即時日誌**，觀察自動操作
5. **切換到分析/ROI 標籤**，查看統計數據

### 2. 推薦設定

```json
{
  "cursorAutoAccept.enabled": true,
  "cursorAutoAccept.interval": 2000,
  "cursorAutoAccept.enableAcceptAll": true,
  "cursorAutoAccept.enableAccept": true,
  "cursorAutoAccept.enableApply": true,
  "cursorAutoAccept.enableRun": false, // 建議手動控制
  "cursorAutoAccept.debugMode": false
}
```

### 3. 最佳實踐

- **適度使用**：在需要快速迭代時啟用，重要程式碼修改時手動審查
- **定期備份**：從分析標籤匯出資料進行備份
- **監控日誌**：注意活動日誌中的異常狀況

## 🔧 常見問題與解決

### Q: 控制面板沒有出現？

**A:** 確保在支援的檔案類型中（.js, .ts, .jsx, .tsx）或使用命令面板

### Q: 自動點擊沒有作用？

**A:**

1. 檢查 Cursor 是否在前景
2. 確認在主面板中已點擊 "開始"
3. 查看活動日誌是否有錯誤訊息

### Q: 如何自定義按鈕類型？

**A:** 在主面板標籤的 "配置" 區域勾選/取消勾選想要的按鈕類型

### Q: 資料會遺失嗎？

**A:** 資料儲存在 VS Code 的全域狀態中，建議定期從分析標籤匯出備份

## 🎊 功能亮點

### 🆕 新版本特色

- **🎨 精美 UI**：仿照 @autoAccept.js 的設計風格
- **📱 響應式設計**：適應不同視窗大小
- **⚡ 即時更新**：狀態和統計即時刷新
- **🔧 可視化配置**：不需要手動編輯設定檔
- **📋 詳細日誌**：完整的操作歷史追蹤

### 🚀 效率提升

- **90% 時間節省**：自動化重複性操作
- **零學習成本**：直觀的使用者介面
- **完全整合**：與 VS Code 生態系統完美融合

## 📞 支援與回饋

- **🐛 問題回報**：[GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)
- **💡 功能建議**：在 Issues 中提出想法
- **📧 技術支援**：透過 GitHub 或專案文檔

---

**🎉 享受您的高效程式設計體驗！**
