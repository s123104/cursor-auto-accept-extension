/\*\*

- 📦 模組：docs/INSTALLATION.md
- 🕒 最後更新：2025-06-11T17:04:06+08:00
- 🧑‍💻 作者/更新者：@s123104
- 🔢 版本：v1.0.1
- 📝 摘要：Cursor Auto Accept Extension 完整安裝指南
  \*/

# 📦 Cursor Auto Accept Extension - 安裝指南

> **📅 更新時間**：2025-06-11T17:04:06+08:00  
> **🔢 最新版本**：v1.0.1  
> **⚡ 安裝時間**：約 2-3 分鐘

## 🎯 快速選擇安裝方式

| 用戶類型     | 推薦方式                                  | 預估時間 | 難度    |
| ------------ | ----------------------------------------- | -------- | ------- |
| **一般用戶** | [VSIX 檔案安裝](#方法一vsix-檔案安裝推薦) | 2 分鐘   | 🟢 簡單 |
| **開發者**   | [開發模式安裝](#方法二開發模式安裝)       | 5 分鐘   | 🟡 中等 |
| **進階用戶** | [原始碼編譯](#方法三從原始碼編譯)         | 10 分鐘  | 🔴 進階 |

---

## 📋 系統需求檢查

### ✅ 必要需求

| 項目         | 最低版本                                   | 推薦版本 | 檢查方式         |
| ------------ | ------------------------------------------ | -------- | ---------------- |
| **VS Code**  | 1.96.0                                     | 最新版   | `Help` → `About` |
| **作業系統** | Windows 10+ / macOS 10.14+ / Ubuntu 18.04+ | 最新版   | 系統資訊         |
| **記憶體**   | 4GB RAM                                    | 8GB+ RAM | 工作管理員       |
| **磁碟空間** | 10MB 可用空間                              | 100MB+   | 檔案總管         |

### 🔧 開發環境需求（開發模式）

| 項目           | 最低版本 | 推薦版本 | 安裝指令         |
| -------------- | -------- | -------- | ---------------- |
| **Node.js**    | 18.0.0   | 20.0.0+  | `node --version` |
| **npm**        | 8.0.0    | 10.0.0+  | `npm --version`  |
| **Git**        | 2.30.0   | 最新版   | `git --version`  |
| **TypeScript** | 5.0.0    | 5.8.3+   | `tsc --version`  |

---

## 🚀 方法一：VSIX 檔案安裝（推薦）

### 📥 步驟 1：下載 VSIX 檔案

#### 🌐 從 GitHub Releases 下載

```bash
# 最新版本 v1.0.1
https://github.com/s123104/cursor-auto-accept-extension/releases/latest
```

**📁 檔案資訊**：

- **檔案名稱**：`cursor-auto-accept-extension-1.0.1.vsix`
- **檔案大小**：859,997 bytes (約 860KB)
- **檔案格式**：標準 VS Code 擴展包
- **包含內容**：完整功能，無需額外設定

#### 🔍 驗證下載檔案

```bash
# Windows PowerShell
Get-FileHash cursor-auto-accept-extension-1.0.1.vsix -Algorithm SHA256

# macOS/Linux Terminal
shasum -a 256 cursor-auto-accept-extension-1.0.1.vsix
```

### ⚡ 步驟 2：安裝擴展

#### 🖥️ 方法 A：命令行安裝（最快）

```bash
# 在下載檔案的目錄中執行
code --install-extension cursor-auto-accept-extension-1.0.1.vsix

# 確認安裝成功
code --list-extensions | grep cursor-auto-accept
```

#### 🎮 方法 B：VS Code GUI 安裝

1. **開啟 VS Code**
2. **進入擴展視圖**：
   - 快捷鍵：`Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (macOS)
   - 或點擊左側活動列的擴展圖標
3. **安裝 VSIX**：
   - 點擊擴展視圖右上角的 `...` 按鈕
   - 選擇 "Install from VSIX..."
   - 瀏覽並選擇下載的 `.vsix` 檔案
4. **等待安裝完成**（約 10-15 秒）

#### 🔄 方法 C：拖曳安裝

1. **開啟 VS Code**
2. **直接拖曳**：將 `.vsix` 檔案拖曳到 VS Code 視窗中
3. **確認安裝**：點擊彈出的安裝確認對話框

### ✅ 步驟 3：驗證安裝

```bash
# 檢查擴展是否已安裝
code --list-extensions | findstr cursor-auto-accept    # Windows
code --list-extensions | grep cursor-auto-accept       # macOS/Linux

# 預期輸出
s123104.cursor-auto-accept-extension
```

#### 🎮 GUI 驗證方式

1. **檢查擴展列表**：

   - `Ctrl+Shift+X` → 搜尋 "Cursor Auto Accept"
   - 應顯示已安裝的擴展

2. **測試快捷鍵**：

   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
   - 輸入 "Cursor Auto Accept"
   - 應出現相關命令選項

3. **檢查狀態列**：
   - 底部狀態列應顯示 "⚡ Auto Accept" 按鈕

---

## 🛠️ 方法二：開發模式安裝

### 📚 適用情境

- 需要修改或自訂功能
- 想要體驗最新開發版本
- 學習 VS Code 擴展開發
- 貢獻代碼和功能改進

### 🔧 步驟 1：環境準備

#### 安裝 Node.js 和 npm

```bash
# 檢查是否已安裝
node --version    # 應顯示 v18.0.0 或更高版本
npm --version     # 應顯示 8.0.0 或更高版本

# 如未安裝，請從官方網站下載：
# https://nodejs.org/
```

#### 安裝 Git

```bash
# 檢查是否已安裝
git --version     # 應顯示 2.30.0 或更高版本

# 如未安裝：
# Windows: https://git-scm.com/
# macOS: brew install git
# Ubuntu: sudo apt install git
```

### 📁 步驟 2：克隆專案

```bash
# 克隆專案到本地
git clone https://github.com/s123104/cursor-auto-accept-extension.git

# 進入專案目錄
cd cursor-auto-accept-extension

# 檢查專案結構
ls -la    # macOS/Linux
dir       # Windows
```

**🗂️ 預期的目錄結構**：

```
cursor-auto-accept-extension/
├── 📁 src/                    # TypeScript 原始碼
├── 📁 dist/                   # 編譯輸出
├── 📁 icons/                  # 擴展圖標
├── 📁 docs/                   # 完整文檔
├── 📁 build/                  # 建置配置
├── 📄 package.json            # 專案配置
├── 📄 tsconfig.json           # TypeScript 配置
└── 📄 README.md               # 專案說明
```

### ⚙️ 步驟 3：安裝依賴

```bash
# 安裝所有必要依賴
npm install

# 驗證安裝成功
npm list --depth=0
```

**📦 主要依賴項目**：

| 依賴項目        | 版本    | 用途                 |
| --------------- | ------- | -------------------- |
| `typescript`    | 5.8.3   | TypeScript 編譯器    |
| `esbuild`       | 0.24.2  | 高速建置工具         |
| `eslint`        | 8.57.1  | 程式碼品質檢查       |
| `prettier`      | 3.4.2   | 程式碼格式化         |
| `@types/vscode` | ^1.96.0 | VS Code API 類型定義 |

### 🏗️ 步驟 4：編譯專案

```bash
# 編譯 TypeScript 到 JavaScript
npm run compile

# 或使用完整建置流程
npm run build

# 檢查編譯結果
ls dist/    # 應看到 extension.js
```

### 🚀 步驟 5：啟動開發模式

```bash
# 在 VS Code 中開啟專案
code .

# 在 VS Code 中按 F5 啟動開發模式
# 或使用選單：Run → Start Debugging
```

**🎮 開發模式功能**：

- **即時重載**：代碼變更時自動重新編譯
- **除錯支援**：完整的斷點和變數檢查
- **錯誤追蹤**：即時顯示編譯和運行時錯誤
- **效能監控**：擴展載入和執行效能分析

### 🔍 步驟 6：測試與驗證

```bash
# 執行程式碼檢查
npm run lint

# 執行格式化檢查
npm run format

# 執行類型檢查
npm run check-types

# 執行完整驗證
npm run validate
```

---

## 🏗️ 方法三：從原始碼編譯

### 🎯 進階用戶專用

此方法適合需要：

- 深度自訂功能
- 修改核心邏輯
- 建立自己的分支版本
- 學習擴展開發細節

### 📋 完整建置流程

```bash
# 1. 克隆並準備專案
git clone https://github.com/s123104/cursor-auto-accept-extension.git
cd cursor-auto-accept-extension

# 2. 安裝所有依賴
npm install

# 3. 清理之前的建置
npm run clean

# 4. 執行完整建置流程
npm run build

# 5. 生成 VSIX 擴展包
npm run package:vsix

# 6. 安裝編譯後的擴展
code --install-extension cursor-auto-accept-extension-1.0.1.vsix
```

### 🔧 建置指令說明

| 指令                   | 功能            | 輸出                |
| ---------------------- | --------------- | ------------------- |
| `npm run compile`      | TypeScript 編譯 | `dist/extension.js` |
| `npm run build`        | 完整建置流程    | 完整檢查+編譯       |
| `npm run package:vsix` | 生成 VSIX 包    | `.vsix` 檔案        |
| `npm run dev`          | 開發模式建置    | 開發版本            |
| `npm run watch`        | 監視模式        | 自動重建            |

### 📊 建置效能指標

| 階段                | 時間    | 輸出大小 |
| ------------------- | ------- | -------- |
| **TypeScript 編譯** | < 30ms  | -        |
| **esbuild 優化**    | < 20ms  | 35.57KB  |
| **VSIX 打包**       | < 100ms | 859.99KB |
| **總計**            | < 150ms | -        |

---

## 🔧 安裝後設定

### ⚙️ 基本配置

#### 1. 開啟 VS Code 設定

```bash
# 方法 A：快捷鍵
Ctrl+,    # Windows/Linux
Cmd+,     # macOS

# 方法 B：選單
File → Preferences → Settings
```

#### 2. 搜尋擴展設定

在設定搜尋框中輸入：`cursorAutoAccept`

#### 3. 推薦初始設定

```json
{
  "cursorAutoAccept.enabled": true,
  "cursorAutoAccept.interval": 2000,
  "cursorAutoAccept.enableAcceptAll": true,
  "cursorAutoAccept.enableAccept": true,
  "cursorAutoAccept.enableApply": true,
  "cursorAutoAccept.enableRun": false, // 🚨 建議手動控制
  "cursorAutoAccept.enableExecute": false, // 🚨 安全考量
  "cursorAutoAccept.enableResume": true,
  "cursorAutoAccept.debugMode": false
}
```

### 🎮 快捷鍵設定

#### 檢查預設快捷鍵

```bash
# 開啟快捷鍵設定
Ctrl+K Ctrl+S    # Windows/Linux
Cmd+K Cmd+S      # macOS
```

#### 預設快捷鍵

| 功能             | Windows/Linux  | macOS         | 說明           |
| ---------------- | -------------- | ------------- | -------------- |
| **顯示控制面板** | `Ctrl+Shift+P` | `Cmd+Shift+P` | 開啟主控制面板 |
| **切換自動接受** | `Ctrl+Shift+A` | `Cmd+Shift+A` | 快速開關功能   |

#### 自訂快捷鍵（可選）

```json
// keybindings.json
[
  {
    "key": "ctrl+alt+a",
    "command": "cursorAutoAccept.showControlPanel",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+t",
    "command": "cursorAutoAccept.toggle",
    "when": "editorTextFocus"
  }
]
```

---

## ✅ 安裝驗證清單

### 🔍 基本功能檢查

- [ ] **擴展已安裝**：在擴展列表中可以找到
- [ ] **快捷鍵有效**：`Ctrl+Shift+P` 可以開啟控制面板
- [ ] **編輯器按鈕**：在 .js/.ts 檔案中可見 📊 按鈕
- [ ] **狀態列顯示**：底部狀態列有 "⚡ Auto Accept" 按鈕
- [ ] **設定頁面**：VS Code 設定中找到 `cursorAutoAccept` 選項

### 🎮 控制面板檢查

- [ ] **面板開啟**：控制面板成功顯示
- [ ] **三標籤頁**：主面板、分析、ROI 標籤正常
- [ ] **狀態更新**：即時狀態和計數正確顯示
- [ ] **按鈕配置**：勾選框可以正常操作
- [ ] **活動日誌**：操作記錄正確顯示

### 🚀 功能測試

- [ ] **自動點擊**：在 Cursor 中測試按鈕自動點擊
- [ ] **檔案追蹤**：分析標籤顯示檔案活動
- [ ] **ROI 計算**：ROI 標籤顯示時間節省統計
- [ ] **資料匯出**：可以匯出 JSON 格式資料
- [ ] **設定保存**：重啟 VS Code 後設定保持不變

---

## 🆘 常見問題解決

### ❓ 安裝失敗問題

#### 問題：VS Code 版本過舊

**症狀**：安裝時提示版本不相容

**解決方案**：

```bash
# 檢查 VS Code 版本
code --version

# 更新到最新版本
# Windows: 下載最新版本重新安裝
# macOS: 透過 App Store 或官網更新
# Linux: 按套件管理器指示更新
```

#### 問題：VSIX 檔案損壞

**症狀**：安裝時提示檔案無效或損壞

**解決方案**：

```bash
# 重新下載 VSIX 檔案
# 檢查檔案完整性
ls -la cursor-auto-accept-extension-1.0.1.vsix

# 清除快取後重試
# Windows
%USERPROFILE%\.vscode\extensions
# macOS
~/.vscode/extensions
# Linux
~/.vscode/extensions
```

### ❓ 控制面板無法開啟

#### 問題：快捷鍵無效

**解決方案**：

```bash
# 檢查快捷鍵衝突
Ctrl+K Ctrl+S → 搜尋 "Cursor Auto Accept"

# 嘗試命令面板
Ctrl+Shift+P → 輸入 "Cursor Auto Accept: Show Control Panel"

# 檢查檔案類型
# 確保在 .js/.ts/.jsx/.tsx 檔案中測試
```

#### 問題：擴展未啟用

**解決方案**：

```bash
# 檢查擴展狀態
Ctrl+Shift+X → 搜尋 "Cursor Auto Accept"

# 如果顯示為停用，點擊 "Enable" 按鈕
# 重新載入 VS Code 視窗
Ctrl+Shift+P → "Developer: Reload Window"
```

### ❓ 開發模式問題

#### 問題：依賴安裝失敗

**解決方案**：

```bash
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install

# 檢查 Node.js 版本
node --version    # 確保 >= 18.0.0
```

#### 問題：編譯錯誤

**解決方案**：

```bash
# 檢查 TypeScript 版本
tsc --version

# 強制重新編譯
npm run clean
npm run compile

# 檢查錯誤日誌
npm run build 2>&1 | tee build.log
```

---

## 🔄 更新與維護

### 📅 檢查更新

```bash
# 檢查當前版本
code --list-extensions --show-versions | grep cursor-auto-accept

# 檢查 GitHub 上的最新版本
# https://github.com/s123104/cursor-auto-accept-extension/releases
```

### 🚀 更新到新版本

```bash
# 方法 A：下載新版 VSIX
# 1. 下載最新的 .vsix 檔案
# 2. 重複安裝流程（會自動覆蓋舊版）

# 方法 B：開發模式更新
git pull origin main
npm install
npm run build
```

### 🧹 完全移除

```bash
# 卸載擴展
code --uninstall-extension s123104.cursor-auto-accept-extension

# 清除設定（可選）
# 手動從 VS Code 設定中移除 cursorAutoAccept 相關設定

# 清除資料（可選）
# Windows: %APPDATA%\Code\User\globalStorage
# macOS: ~/Library/Application Support/Code/User/globalStorage
# Linux: ~/.config/Code/User/globalStorage
```

---

## 💡 最佳實踐建議

### 🎯 初次使用建議

1. **從基本設定開始**：先使用推薦的初始設定
2. **逐步啟用功能**：不要一次啟用所有按鈕類型
3. **監控活動日誌**：觀察自動操作是否符合預期
4. **定期匯出資料**：建立分析資料的備份習慣

### ⚠️ 安全注意事項

1. **謹慎啟用執行按鈕**：`enableRun` 和 `enableExecute` 建議手動控制
2. **測試環境優先**：在非生產專案中熟悉功能
3. **備份重要專案**：使用前確保代碼已提交到版本控制
4. **定期檢查設定**：確認設定符合當前工作需求

### 🚀 效能優化建議

1. **調整檢查間隔**：根據實際需求調整 `interval` 設定
2. **選擇性啟用**：只啟用需要的按鈕類型
3. **關閉除錯模式**：生產使用時設定 `debugMode: false`
4. **定期清理資料**：適時清除舊的分析資料

---

## 📞 技術支援

### 🆘 取得協助

| 支援管道                                                                                      | 適用情況           | 回應時間 |
| --------------------------------------------------------------------------------------------- | ------------------ | -------- |
| **[GitHub Issues](https://github.com/s123104/cursor-auto-accept-extension/issues)**           | Bug 回報、功能請求 | 1-3 天   |
| **[GitHub Discussions](https://github.com/s123104/cursor-auto-accept-extension/discussions)** | 使用問題、經驗分享 | 1-2 天   |
| **[文檔資料夾](https://github.com/s123104/cursor-auto-accept-extension/tree/main/docs)**      | 詳細使用說明       | 即時     |

### 📋 回報問題時請提供

1. **VS Code 版本**：`Help` → `About`
2. **擴展版本**：從擴展列表查看
3. **作業系統**：Windows/macOS/Linux 及版本
4. **錯誤訊息**：完整的錯誤日誌
5. **重現步驟**：詳細的操作步驟
6. **預期行為**：期望的正確行為

### 🤝 社群支援

- **貢獻代碼**：歡迎提交 Pull Request
- **改進文檔**：協助改善說明文檔
- **分享經驗**：在 Discussions 中分享使用心得
- **測試新功能**：協助測試 Beta 版本

---

**🎉 安裝完成！現在就開始享受高效的 Cursor 開發體驗吧！**

> **💡 小提示**：建議在非關鍵專案中先熟悉各項功能，確認符合工作流程後再用於重要開發工作。
