/**
 * 📦 模組：Webview 面板管理器
 * 🕒 最後更新：2025-06-11T14:23:18+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：管理控制面板和分析面板的 Webview 介面，仿照 autoAccept.js 的豐富設計
 */

import * as vscode from 'vscode';
import { AnalyticsManager } from './analytics';
import { AutoAcceptService } from './autoAcceptService';

export class WebviewPanelManager implements vscode.Disposable {
  private _context: vscode.ExtensionContext;
  private _analyticsManager: AnalyticsManager;
  private _autoAcceptService: AutoAcceptService;
  private controlPanel: vscode.WebviewPanel | null = null;
  private currentTab: 'main' | 'analytics' | 'roi' = 'main';

  constructor(
    context: vscode.ExtensionContext,
    analyticsManager: AnalyticsManager,
    autoAcceptService: AutoAcceptService
  ) {
    this._context = context;
    this._analyticsManager = analyticsManager;
    this._autoAcceptService = autoAcceptService;
  }

  /**
   * 顯示控制面板
   */
  showControlPanel(): void {
    if (this.controlPanel) {
      this.controlPanel.reveal();
      return;
    }

    this.controlPanel = vscode.window.createWebviewPanel(
      'cursorAutoAcceptControl',
      'Cursor Auto Accept 控制面板',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.controlPanel.webview.html = this.getControlPanelHtml();

    // 處理來自 webview 的訊息
    this.controlPanel.webview.onDidReceiveMessage(message => {
      this.handleWebviewMessage(message);
    });

    this.controlPanel.onDidDispose(() => {
      this.controlPanel = null;
    });

    // 定期更新面板數據
    const updateInterval = setInterval(() => {
      if (this.controlPanel) {
        this.updatePanelData();
      } else {
        clearInterval(updateInterval);
      }
    }, 1000);
  }

  /**
   * 顯示分析面板
   */
  showAnalyticsPanel(): void {
    this.showControlPanel();
    this.switchTab('analytics');
  }

  /**
   * 切換標籤頁
   */
  private switchTab(tab: 'main' | 'analytics' | 'roi'): void {
    this.currentTab = tab;
    if (this.controlPanel) {
      this.controlPanel.webview.postMessage({
        command: 'switchTab',
        tab: tab,
      });
    }
  }

  /**
   * 處理來自 webview 的訊息
   */
  private handleWebviewMessage(message: any): void {
    switch (message.command) {
      case 'toggle': {
        const isRunning = this._autoAcceptService.toggle();
        vscode.window.showInformationMessage(`自動接受功能已${isRunning ? '啟用' : '停用'}`);
        break;
      }

      case 'start':
        this._autoAcceptService.start();
        vscode.window.showInformationMessage('自動接受功能已啟用');
        break;

      case 'stop':
        this._autoAcceptService.stop();
        vscode.window.showInformationMessage('自動接受功能已停用');
        break;

      case 'switchTab':
        this.currentTab = message.tab;
        break;

      case 'updateConfig':
        this.updateButtonConfig(message.config);
        break;

      case 'exportData':
        vscode.commands.executeCommand('cursorAutoAccept.exportData');
        break;

      case 'clearData':
        vscode.commands.executeCommand('cursorAutoAccept.clearData');
        break;

      case 'requestUpdate':
        this.updatePanelData();
        break;
    }
  }

  /**
   * 更新按鈕配置
   */
  private updateButtonConfig(config: any): void {
    const vsConfig = vscode.workspace.getConfiguration('cursorAutoAccept');
    for (const [key, value] of Object.entries(config)) {
      vsConfig.update(key, value, vscode.ConfigurationTarget.Workspace);
    }
  }

  /**
   * 更新面板數據
   */
  private updatePanelData(): void {
    if (!this.controlPanel) return;

    const status = this._autoAcceptService.getStatus();
    const analytics = this._analyticsManager.getAnalytics();

    this.controlPanel.webview.postMessage({
      command: 'updateData',
      data: {
        status,
        analytics: {
          totalAccepts: analytics.totalAccepts,
          sessionStart: analytics.sessionStart,
          files: Array.from(analytics.files.entries()),
          sessions: analytics.sessions.slice(-10), // 最近 10 次會話
          roiTracking: analytics.roiTracking,
        },
      },
    });
  }

  /**
   * 生成控制面板 HTML
   */
  private getControlPanelHtml(): string {
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursor Auto Accept 控制面板</title>
    <style>
        ${this.getControlPanelStyles()}
    </style>
</head>
<body>
    <div id="auto-accept-control-panel">
        <!-- 標頭區域 -->
        <div class="aa-header">
            <div class="aa-tabs">
                <button class="aa-tab aa-tab-active" data-tab="main">主面板</button>
                <button class="aa-tab" data-tab="analytics">分析</button>
                <button class="aa-tab" data-tab="roi">ROI</button>
            </div>
            <div class="aa-header-controls">
                <button class="aa-minimize" title="最小化">−</button>
            </div>
        </div>

        <!-- 主內容區域 -->
        <div class="aa-content aa-main-content">
            <!-- 狀態部分 -->
            <div class="aa-status">
                <span class="aa-status-text">載入中...</span>
                <span class="aa-clicks">0 次操作</span>
            </div>

            <!-- 控制部分 -->
            <div class="aa-controls">
                <button class="aa-btn aa-start">開始</button>
                <button class="aa-btn aa-stop" disabled>停止</button>
                <button class="aa-btn aa-config">設定</button>
            </div>

            <!-- 設定面板 -->
            <div class="aa-config-panel" style="display: none;">
                <label><input type="checkbox" id="enableAcceptAll" checked> 全部接受</label>
                <label><input type="checkbox" id="enableAccept" checked> 接受</label>
                <label><input type="checkbox" id="enableRun" checked> 執行</label>
                <label><input type="checkbox" id="enableApply" checked> 套用</label>
                <label><input type="checkbox" id="enableResume" checked> 繼續對話</label>
            </div>

            <!-- 日誌部分 -->
            <div class="aa-log">
                <div class="aa-log-entry info">
                    <span class="aa-log-time">${new Date().toLocaleTimeString()}</span>: 
                    控制面板已載入
                </div>
            </div>

            <!-- ROI 頁腳 -->
            <div class="aa-roi-footer">
                <div class="aa-roi-footer-title">⚡ 工作流程 ROI</div>
                <div class="aa-roi-footer-stats">
                    <span>節省時間：載入中...</span>
                    <span>工作流程效率：載入中...</span>
                </div>
            </div>

            <!-- 鳴謝部分 -->
            <div class="aa-credits">
                <small>基於 <a href="https://linkedin.com/in/ivalsaraj" target="_blank">@ivalsaraj</a> 的設計</small>
            </div>
        </div>

        <!-- 分析內容區域 -->
        <div class="aa-content aa-analytics-content" style="display: none;">
            <div class="aa-analytics-summary">
                <h4>📊 會話分析</h4>
                <div class="aa-stat">
                    <span class="aa-stat-label">會話時長：</span>
                    <span class="aa-stat-value">載入中...</span>
                </div>
            </div>

            <div class="aa-analytics-files">
                <h4>📁 檔案活動</h4>
                <div class="aa-files-list">
                    <div class="aa-no-files">載入中...</div>
                </div>
            </div>

            <div class="aa-analytics-actions">
                <button class="aa-btn aa-btn-small" id="exportBtn">匯出資料</button>
                <button class="aa-btn aa-btn-small" id="clearBtn">清除資料</button>
            </div>

            <div class="aa-credits">
                <small>分析功能 by <a href="https://linkedin.com/in/ivalsaraj" target="_blank">@ivalsaraj</a></small>
            </div>
        </div>

        <!-- ROI 內容區域 -->
        <div class="aa-content aa-roi-content" style="display: none;">
            <div class="aa-roi-summary">
                <h4>⚡ 完整工作流程 ROI</h4>
                <div class="aa-roi-explanation">
                    衡量完整的 AI 工作流程：使用者提示 → Cursor 生成 → 手動觀看/點擊 vs 自動接受
                </div>
            </div>

            <div class="aa-roi-impact">
                <h4>📈 影響分析</h4>
                <div class="aa-roi-text">載入中...</div>
            </div>

            <div class="aa-roi-comparison">
                <h4>🔄 完整工作流程比較</h4>
                <div class="aa-workflow-breakdown">
                    <div>手動：觀看生成 + 找按鈕 + 點擊 + 切換 (~30秒)</div>
                    <div>自動：在您編碼時即時偵測和點擊 (~0.1秒)</div>
                </div>
            </div>

            <div class="aa-credits">
                <small>ROI 計算 by <a href="https://linkedin.com/in/ivalsaraj" target="_blank">@ivalsaraj</a></small>
            </div>
        </div>
    </div>

    <script>
        ${this.getControlPanelScript()}
    </script>
</body>
</html>`;
  }

  /**
   * 生成控制面板樣式
   */
  private getControlPanelStyles(): string {
    return `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #1e1e1e;
            color: #ccc;
            font-size: 12px;
            overflow: hidden;
        }

        #auto-accept-control-panel {
            width: 100%;
            height: 100vh;
            background: #1e1e1e;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            user-select: none;
        }

        .aa-header {
            background: #2d2d2d;
            padding: 6px 10px;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
        }

        .aa-tabs {
            display: flex;
            gap: 4px;
        }

        .aa-tab {
            background: #444;
            border: none;
            color: #ccc;
            font-size: 11px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 3px;
            transition: all 0.2s;
        }

        .aa-tab:hover {
            background: #555;
        }

        .aa-tab-active {
            background: #0d7377 !important;
            color: white !important;
        }

        .aa-header-controls {
            display: flex;
            gap: 4px;
        }

        .aa-minimize {
            background: #444;
            border: none;
            color: #ccc;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            padding: 2px 5px;
            border-radius: 2px;
            line-height: 1;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .aa-minimize:hover {
            background: #555;
        }

        .aa-content {
            padding: 12px;
            overflow-y: auto;
            flex: 1;
        }

        .aa-status {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 6px 8px;
            background: #252525;
            border-radius: 4px;
            font-size: 11px;
        }

        .aa-status-text.running {
            color: #4CAF50;
            font-weight: 500;
        }

        .aa-status-text.stopped {
            color: #f44336;
        }

        .aa-clicks {
            color: #888;
        }

        .aa-controls {
            display: flex;
            gap: 6px;
            margin-bottom: 10px;
        }

        .aa-btn {
            flex: 1;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .aa-btn-small {
            flex: none;
            padding: 4px 8px;
            font-size: 10px;
        }

        .aa-start {
            background: #4CAF50;
            color: white;
        }

        .aa-start:hover:not(:disabled) {
            background: #45a049;
        }

        .aa-stop {
            background: #f44336;
            color: white;
        }

        .aa-stop:hover:not(:disabled) {
            background: #da190b;
        }

        .aa-config {
            background: #2196F3;
            color: white;
        }

        .aa-config:hover:not(:disabled) {
            background: #1976D2;
        }

        .aa-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .aa-config-panel {
            background: #252525;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 10px;
        }

        .aa-config-panel label {
            display: block;
            margin-bottom: 4px;
            font-size: 11px;
            cursor: pointer;
        }

        .aa-config-panel input[type="checkbox"] {
            margin-right: 6px;
        }

        .aa-log {
            background: #252525;
            border-radius: 4px;
            padding: 8px;
            height: 120px;
            overflow-y: auto;
            font-size: 10px;
            line-height: 1.3;
            margin-bottom: 10px;
        }

        .aa-log-entry {
            margin-bottom: 2px;
            padding: 2px 4px;
            border-radius: 2px;
        }

        .aa-log-entry.info {
            color: #4CAF50;
        }

        .aa-log-entry.warning {
            color: #FF9800;
        }

        .aa-log-entry.error {
            color: #f44336;
        }

        .aa-log-entry.file {
            color: #2196F3;
            background: rgba(33, 150, 243, 0.1);
        }

        .aa-log-time {
            color: #888;
            font-size: 9px;
        }

        /* ROI 頁腳樣式 */
        .aa-roi-footer {
            margin-top: 8px;
            padding: 6px 8px;
            background: #2d2d2d;
            border-radius: 4px;
            border-top: 1px solid #444;
            margin-bottom: 10px;
        }

        .aa-roi-footer-title {
            font-size: 10px;
            color: #fff;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .aa-roi-footer-stats {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #888;
        }

        .aa-roi-footer-stats span {
            color: #4CAF50;
        }

        /* 分析頁面樣式 */
        .aa-analytics-summary, .aa-analytics-files {
            background: #252525;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 10px;
        }

        .aa-analytics-summary h4, .aa-analytics-files h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #fff;
        }

        .aa-stat {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            font-size: 11px;
        }

        .aa-stat-label {
            color: #888;
        }

        .aa-stat-value {
            color: #fff;
            font-weight: 500;
        }

        .aa-files-list {
            max-height: 200px;
            overflow-y: auto;
        }

        .aa-file-item {
            padding: 4px 0;
            border-bottom: 1px solid #333;
        }

        .aa-file-item:last-child {
            border-bottom: none;
        }

        .aa-file-name {
            font-size: 11px;
            color: #fff;
            font-weight: 500;
            margin-bottom: 2px;
            word-break: break-all;
        }

        .aa-file-stats {
            display: flex;
            gap: 8px;
            font-size: 10px;
            color: #888;
        }

        .aa-no-files {
            color: #888;
            font-size: 11px;
            text-align: center;
            padding: 20px;
        }

        .aa-analytics-actions {
            display: flex;
            gap: 6px;
            margin-bottom: 10px;
        }

        .aa-analytics-actions .aa-btn {
            background: #444;
            color: #ccc;
        }

        .aa-analytics-actions .aa-btn:hover {
            background: #555;
        }

        /* ROI 標籤頁樣式 */
        .aa-roi-summary, .aa-roi-impact, .aa-roi-comparison {
            margin-bottom: 12px;
            padding: 8px;
            background: #252525;
            border-radius: 4px;
        }

        .aa-roi-explanation {
            font-size: 10px;
            color: #888;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .aa-workflow-breakdown {
            font-size: 10px;
            color: #888;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .aa-workflow-breakdown div {
            margin-bottom: 2px;
        }

        /* 鳴謝部分 */
        .aa-credits {
            text-align: center;
            padding: 8px;
            border-top: 1px solid #333;
            color: #666;
            margin-top: auto;
        }

        .aa-credits a {
            color: #2196F3;
            text-decoration: none;
        }

        .aa-credits a:hover {
            text-decoration: underline;
        }

        /* 最小化功能 */
        #auto-accept-control-panel.aa-minimized .aa-content {
            display: none;
        }

        #auto-accept-control-panel.aa-minimized {
            height: auto;
            max-height: none;
        }
    `;
  }

  /**
   * 生成控制面板腳本
   */
  private getControlPanelScript(): string {
    return `
        const vscode = acquireVsCodeApi();
        let currentTab = 'main';
        let panelData = null;

        // 初始化事件監聽器
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            requestUpdate();
        });

        function initializeEventListeners() {
            // 標籤頁切換
            document.querySelectorAll('.aa-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    switchTab(this.dataset.tab);
                });
            });

            // 控制按鈕
            document.querySelector('.aa-start').addEventListener('click', () => {
                vscode.postMessage({ command: 'start' });
                logMessage('啟動自動接受服務', 'info');
            });

            document.querySelector('.aa-stop').addEventListener('click', () => {
                vscode.postMessage({ command: 'stop' });
                logMessage('停止自動接受服務', 'warning');
            });

            document.querySelector('.aa-config').addEventListener('click', () => {
                const configPanel = document.querySelector('.aa-config-panel');
                configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
            });

            // 設定複選框
            document.querySelectorAll('.aa-config-panel input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    updateConfiguration();
                });
            });

            // 分析按鈕
            document.getElementById('exportBtn').addEventListener('click', () => {
                vscode.postMessage({ command: 'exportData' });
                logMessage('匯出分析資料', 'info');
            });

            document.getElementById('clearBtn').addEventListener('click', () => {
                if (confirm('確定要清除所有資料嗎？此操作無法復原。')) {
                    vscode.postMessage({ command: 'clearData' });
                    logMessage('清除所有資料', 'warning');
                }
            });

            // 最小化按鈕
            document.querySelector('.aa-minimize').addEventListener('click', () => {
                document.getElementById('auto-accept-control-panel').classList.toggle('aa-minimized');
            });
        }

        function switchTab(tab) {
            currentTab = tab;
            
            // 更新標籤頁按鈕樣式
            document.querySelectorAll('.aa-tab').forEach(t => {
                t.classList.remove('aa-tab-active');
            });
            document.querySelector('[data-tab="' + tab + '"]').classList.add('aa-tab-active');

            // 切換內容區域
            document.querySelectorAll('.aa-content').forEach(content => {
                content.style.display = 'none';
            });

            if (tab === 'main') {
                document.querySelector('.aa-main-content').style.display = 'block';
            } else if (tab === 'analytics') {
                document.querySelector('.aa-analytics-content').style.display = 'block';
                updateAnalyticsContent();
            } else if (tab === 'roi') {
                document.querySelector('.aa-roi-content').style.display = 'block';
                updateROIContent();
            }

            vscode.postMessage({ command: 'switchTab', tab: tab });
        }

        function updateConfiguration() {
            const config = {};
            document.querySelectorAll('.aa-config-panel input[type="checkbox"]').forEach(checkbox => {
                config[checkbox.id] = checkbox.checked;
            });
            vscode.postMessage({ command: 'updateConfig', config: config });
        }

        function requestUpdate() {
            vscode.postMessage({ command: 'requestUpdate' });
        }

        function logMessage(message, type = 'info') {
            const logContainer = document.querySelector('.aa-log');
            const logEntry = document.createElement('div');
            logEntry.className = 'aa-log-entry ' + type;
            
            const time = new Date().toLocaleTimeString();
            logEntry.innerHTML = '<span class="aa-log-time">' + time + '</span>: ' + message;

            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;

            // 只保留最後 20 個條目
            while (logContainer.children.length > 20) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }

        function formatTimeDuration(milliseconds) {
            if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) return '0秒';

            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (hours > 0) {
                return hours + '小時 ' + minutes + '分 ' + seconds + '秒';
            } else if (minutes > 0) {
                return minutes + '分 ' + seconds + '秒';
            } else {
                return seconds + '秒';
            }
        }

        function updateAnalyticsContent() {
            if (!panelData) return;

            const analytics = panelData.analytics;
            const sessionDuration = new Date() - new Date(analytics.sessionStart);
            const sessionMinutes = Math.round(sessionDuration / 1000 / 60);

            // 更新會話統計
            const summaryDiv = document.querySelector('.aa-analytics-summary');
            summaryDiv.innerHTML = '<h4>📊 會話分析</h4>' +
                '<div class="aa-stat">' +
                    '<span class="aa-stat-label">會話時長：</span>' +
                    '<span class="aa-stat-value">' + sessionMinutes + '分鐘</span>' +
                '</div>' +
                '<div class="aa-stat">' +
                    '<span class="aa-stat-label">總接受次數：</span>' +
                    '<span class="aa-stat-value">' + analytics.totalAccepts + '</span>' +
                '</div>' +
                '<div class="aa-stat">' +
                    '<span class="aa-stat-label">已修改檔案：</span>' +
                    '<span class="aa-stat-value">' + analytics.files.length + '</span>' +
                '</div>';

            // 更新檔案列表
            const filesList = document.querySelector('.aa-files-list');
            if (analytics.files.length === 0) {
                filesList.innerHTML = '<div class="aa-no-files">尚無檔案被修改</div>';
            } else {
                filesList.innerHTML = analytics.files.map(function(fileData) {
                    const filename = fileData[0];
                    const data = fileData[1];
                    return '<div class="aa-file-item">' +
                        '<div class="aa-file-name">' + filename + '</div>' +
                        '<div class="aa-file-stats">' +
                            '<span class="aa-file-count">' + data.acceptCount + '次</span>' +
                            '<span class="aa-file-changes">+' + data.totalAdded + '/-' + data.totalDeleted + '</span>' +
                        '</div>' +
                    '</div>';
                }).join('');
            }
        }

        function updateROIContent() {
            if (!panelData) return;

            const analytics = panelData.analytics;
            const roi = analytics.roiTracking;

            document.querySelector('.aa-roi-text').innerHTML = 
                '<div class="aa-roi-scenario">總節省時間：' + formatTimeDuration(roi.totalTimeSaved) + '</div>' +
                '<div class="aa-roi-scenario">平均每次節省：' + formatTimeDuration(roi.totalTimeSaved / Math.max(analytics.totalAccepts, 1)) + '</div>' +
                '<div class="aa-roi-scenario">工作流程效率提升：' + (analytics.totalAccepts > 0 ? '99.7%' : '0%') + '</div>';
        }

        function updatePanelData(data) {
            panelData = data;
            const status = data.status;
            const analytics = data.analytics;

            // 更新狀態
            const statusText = document.querySelector('.aa-status-text');
            const clicksText = document.querySelector('.aa-clicks');
            const startBtn = document.querySelector('.aa-start');
            const stopBtn = document.querySelector('.aa-stop');

            if (status.isRunning) {
                statusText.textContent = '執行中';
                statusText.className = 'aa-status-text running';
                startBtn.disabled = true;
                stopBtn.disabled = false;
            } else {
                statusText.textContent = '已停止';
                statusText.className = 'aa-status-text stopped';
                startBtn.disabled = false;
                stopBtn.disabled = true;
            }

            clicksText.textContent = analytics.totalAccepts + ' 次操作';

            // 更新配置
            const config = status.config;
            Object.keys(config).forEach(function(key) {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    checkbox.checked = config[key];
                }
            });

            // 更新 ROI 頁腳
            const roiFooter = document.querySelector('.aa-roi-footer-stats');
            if (roiFooter) {
                const totalTimeSaved = analytics.roiTracking.totalTimeSaved;
                const efficiency = analytics.totalAccepts > 0 ? '99.7%' : '0%';
                roiFooter.innerHTML = 
                    '<span>節省時間：' + formatTimeDuration(totalTimeSaved) + '</span>' +
                    '<span>工作流程效率：' + efficiency + '</span>';
            }

            // 如果當前在分析或 ROI 標籤頁，更新內容
            if (currentTab === 'analytics') {
                updateAnalyticsContent();
            } else if (currentTab === 'roi') {
                updateROIContent();
            }
        }

        // 監聽來自 VS Code 的訊息
        window.addEventListener('message', function(event) {
            const message = event.data;
            switch (message.command) {
                case 'updateData':
                    updatePanelData(message.data);
                    break;
                case 'switchTab':
                    switchTab(message.tab);
                    break;
            }
        });

        // 定期請求更新
        setInterval(function() {
            requestUpdate();
        }, 2000);
    `;
  }

  dispose(): void {
    this.controlPanel?.dispose();
  }
}
