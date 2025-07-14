// WebviewPanelManager - VS Code Webview 面板管理器 v2.2.0

import * as vscode from 'vscode';
import * as path from 'path';
import {
  ExtensionConfig,
  ReportData,
  AnalyticsData,
  ROIMetrics,
  PerformanceMetrics,
  WebviewMessage,
  LogLevel,
} from '../types';
import { WEBVIEW_TYPES, COMMANDS, VERSION } from '../utils/constants';

/**
 * WebviewPanelManager - VS Code Webview 面板管理器
 *
 * 負責：
 * - 創建和管理 Webview 面板
 * - 控制面板 UI 顯示
 * - 分析報告面板顯示
 * - Webview 與擴展間的通信
 * - HTML 內容生成
 */
export class WebviewPanelManager {
  private context: vscode.ExtensionContext;
  private outputChannel: vscode.OutputChannel;

  // Webview 面板實例
  private controlPanel: vscode.WebviewPanel | undefined;
  private analyticsPanel: vscode.WebviewPanel | undefined;

  // 數據提供者
  private configProvider: () => ExtensionConfig;
  private analyticsProvider: () => AnalyticsData;
  private roiProvider: () => ROIMetrics;
  private performanceProvider: () => PerformanceMetrics;
  private reportProvider: () => ReportData;

  constructor(
    context: vscode.ExtensionContext,
    configProvider: () => ExtensionConfig,
    analyticsProvider: () => AnalyticsData,
    roiProvider: () => ROIMetrics,
    performanceProvider: () => PerformanceMetrics,
    reportProvider: () => ReportData
  ) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel('Cursor Auto Accept WebView');
    this.configProvider = configProvider;
    this.analyticsProvider = analyticsProvider;
    this.roiProvider = roiProvider;
    this.performanceProvider = performanceProvider;
    this.reportProvider = reportProvider;

    this.log('WebviewPanelManager 已初始化', LogLevel.INFO);
  }

  /**
   * 顯示控制面板
   */
  public showControlPanel(): void {
    if (this.controlPanel) {
      this.controlPanel.reveal();
      return;
    }

    this.controlPanel = vscode.window.createWebviewPanel(
      WEBVIEW_TYPES.CONTROL_PANEL,
      'Cursor Auto Accept - 控制面板',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'resources'))],
      }
    );

    this.controlPanel.webview.html = this.generateControlPanelHTML();
    this.setupControlPanelMessageHandler();

    this.controlPanel.onDidDispose(() => {
      this.controlPanel = undefined;
    });

    this.log('控制面板已顯示', LogLevel.INFO);
  }

  /**
   * 顯示分析報告面板
   */
  public showAnalyticsPanel(): void {
    if (this.analyticsPanel) {
      this.analyticsPanel.reveal();
      return;
    }

    this.analyticsPanel = vscode.window.createWebviewPanel(
      WEBVIEW_TYPES.ANALYTICS,
      'Cursor Auto Accept - 分析報告',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'resources'))],
      }
    );

    this.analyticsPanel.webview.html = this.generateAnalyticsPanelHTML();
    this.setupAnalyticsPanelMessageHandler();

    this.analyticsPanel.onDidDispose(() => {
      this.analyticsPanel = undefined;
    });

    this.log('分析報告面板已顯示', LogLevel.INFO);
  }

  /**
   * 更新控制面板數據
   */
  public updateControlPanel(): void {
    if (this.controlPanel) {
      this.controlPanel.webview.postMessage({
        command: 'updateConfig',
        data: this.configProvider(),
      });
    }
  }

  /**
   * 更新分析面板數據
   */
  public updateAnalyticsPanel(): void {
    if (this.analyticsPanel) {
      this.analyticsPanel.webview.postMessage({
        command: 'updateReport',
        data: this.reportProvider(),
      });
    }
  }

  /**
   * 生成控制面板 HTML
   */
  private generateControlPanelHTML(): string {
    const config = this.configProvider();
    const analytics = this.analyticsProvider();
    const roi = this.roiProvider();

    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursor Auto Accept - 控制面板</title>
    <style>
        ${this.getCommonStyles()}
        
        .control-panel {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
        }
        
        .section h2 {
            margin-top: 0;
            color: var(--vscode-foreground);
            border-bottom: 2px solid var(--vscode-textLink-foreground);
            padding-bottom: 10px;
        }
        
        .toggle-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .toggle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
        }
        
        .toggle-item label {
            font-weight: 500;
            color: var(--vscode-foreground);
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            transition: .4s;
            border-radius: 24px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background-color: var(--vscode-foreground);
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: var(--vscode-textLink-foreground);
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .stat-card {
            padding: 15px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .btn-primary:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .btn-secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .btn-secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .interval-control {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }
        
        .interval-control input {
            width: 80px;
            padding: 5px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="control-panel">
        <h1 title="v${VERSION}">🎯 Cursor Auto Accept 控制面板</h1>
        
        <div class="section">
            <h2>📊 即時統計</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${analytics.totalClicks}</div>
                    <div class="stat-label">總點擊次數</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round((analytics.successfulClicks / Math.max(analytics.totalClicks, 1)) * 100)}%</div>
                    <div class="stat-label">成功率</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round(roi.totalTimeSaved / 1000)}s</div>
                    <div class="stat-label">節省時間</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$${Math.round(roi.estimatedCostSaving)}</div>
                    <div class="stat-label">估算節省成本</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>⚙️ 功能設定</h2>
            <div class="toggle-group">
                <div class="toggle-item">
                    <label>Accept All</label>
                    <label class="switch">
                        <input type="checkbox" id="enableAcceptAll" ${config.enableAcceptAll ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Accept</label>
                    <label class="switch">
                        <input type="checkbox" id="enableAccept" ${config.enableAccept ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Run Command</label>
                    <label class="switch">
                        <input type="checkbox" id="enableRunCommand" ${config.enableRunCommand ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Run</label>
                    <label class="switch">
                        <input type="checkbox" id="enableRun" ${config.enableRun ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Apply</label>
                    <label class="switch">
                        <input type="checkbox" id="enableApply" ${config.enableApply ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Execute</label>
                    <label class="switch">
                        <input type="checkbox" id="enableExecute" ${config.enableExecute ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Resume</label>
                    <label class="switch">
                        <input type="checkbox" id="enableResume" ${config.enableResume ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Try Again</label>
                    <label class="switch">
                        <input type="checkbox" id="enableTryAgain" ${config.enableTryAgain ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle-item">
                    <label>Move to Background</label>
                    <label class="switch">
                        <input type="checkbox" id="enableMoveToBackground" ${config.enableMoveToBackground ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="interval-control">
                <label>檢查間隔 (毫秒):</label>
                <input type="number" id="interval" value="${config.interval}" min="500" max="10000" step="100">
                <span>建議值: 1000-3000ms</span>
            </div>
            
            <div class="toggle-item" style="margin-top: 15px;">
                <label>偵錯模式</label>
                <label class="switch">
                    <input type="checkbox" id="debugMode" ${config.debugMode ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        
        <div class="section">
            <h2>🎮 控制操作</h2>
            <div class="button-group">
                <button class="btn btn-primary" onclick="sendCommand('start')">▶️ 開始</button>
                <button class="btn btn-secondary" onclick="sendCommand('stop')">⏸️ 停止</button>
                <button class="btn btn-secondary" onclick="sendCommand('toggle')">🔄 切換</button>
                <button class="btn btn-secondary" onclick="sendCommand('showAnalytics')">📊 分析報告</button>
                <button class="btn btn-secondary" onclick="sendCommand('exportAnalytics')">📤 匯出數據</button>
                <button class="btn btn-secondary" onclick="sendCommand('clearAnalytics')">🗑️ 清除數據</button>
            </div>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        // 發送命令到擴展
        function sendCommand(command, data = null) {
            vscode.postMessage({
                command: command,
                data: data
            });
        }
        
        // 監聽所有開關變化
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const config = {};
                config[this.id] = this.checked;
                sendCommand('updateConfig', config);
            });
        });
        
        // 監聽間隔變化
        document.getElementById('interval').addEventListener('change', function() {
            sendCommand('updateConfig', {
                interval: parseInt(this.value)
            });
        });
        
        // 監聽來自擴展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateConfig':
                    updateConfigUI(message.data);
                    break;
                case 'updateStats':
                    updateStatsUI(message.data);
                    break;
            }
        });
        
        function updateConfigUI(config) {
            Object.keys(config).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = config[key];
                    } else {
                        element.value = config[key];
                    }
                }
            });
        }
        
        function updateStatsUI(stats) {
            // 更新統計數據顯示
            const statCards = document.querySelectorAll('.stat-card');
            // 實現統計更新邏輯
        }
    </script>
</body>
</html>`;
  }

  /**
   * 生成分析報告面板 HTML
   */
  private generateAnalyticsPanelHTML(): string {
    const report = this.reportProvider();

    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursor Auto Accept - 分析報告</title>
    <style>
        ${this.getCommonStyles()}
        
        .analytics-panel {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            padding: 20px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            text-align: center;
        }
        
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: var(--vscode-foreground);
            font-size: 14px;
        }
        
        .summary-card .value {
            font-size: 28px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 5px;
        }
        
        .summary-card .unit {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        
        .chart-container {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .chart-title {
            font-size: 18px;
            font-weight: bold;
            color: var(--vscode-foreground);
            margin-bottom: 15px;
        }
        
        .button-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .button-stat-item {
            padding: 15px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
        }
        
        .button-stat-item h4 {
            margin: 0 0 10px 0;
            color: var(--vscode-foreground);
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .stat-row .label {
            color: var(--vscode-descriptionForeground);
        }
        
        .stat-row .value {
            color: var(--vscode-foreground);
            font-weight: 500;
        }
        
        .recommendations {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
        }
        
        .recommendations h3 {
            margin: 0 0 15px 0;
            color: var(--vscode-foreground);
        }
        
        .recommendations ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .recommendations li {
            margin-bottom: 8px;
            color: var(--vscode-foreground);
        }
        
        .trend-indicator {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
        }
        
        .trend-up {
            background-color: #28a745;
            color: white;
        }
        
        .trend-down {
            background-color: #dc3545;
            color: white;
        }
        
        .trend-neutral {
            background-color: #6c757d;
            color: white;
        }
    </style>
</head>
<body>
    <div class="analytics-panel">
        <h1>📊 Cursor Auto Accept 分析報告</h1>
        <p style="color: var(--vscode-descriptionForeground); margin-bottom: 30px;">
            報告生成時間: ${new Date(report.generatedAt).toLocaleString('zh-TW')}
        </p>
        
        <div class="summary-grid">
            <div class="summary-card">
                <h3>總點擊次數</h3>
                <div class="value">${report.summary.totalClicks}</div>
                <div class="unit">次</div>
            </div>
            <div class="summary-card">
                <h3>成功率</h3>
                <div class="value">${Math.round(report.summary.successRate)}%</div>
                <div class="unit">
                    <span class="trend-indicator ${this.getTrendClass(report.trends.successTrend)}">
                        ${report.trends.successTrend > 0 ? '↗' : report.trends.successTrend < 0 ? '↘' : '→'} 
                        ${Math.abs(Math.round(report.trends.successTrend))}%
                    </span>
                </div>
            </div>
            <div class="summary-card">
                <h3>節省時間</h3>
                <div class="value">${Math.round(report.summary.totalTimeSaved / 1000)}</div>
                <div class="unit">秒</div>
            </div>
            <div class="summary-card">
                <h3>估算節省成本</h3>
                <div class="value">$${Math.round(report.summary.estimatedCostSaving)}</div>
                <div class="unit">USD</div>
            </div>
            <div class="summary-card">
                <h3>會話數量</h3>
                <div class="value">${report.summary.sessionsCount}</div>
                <div class="unit">次</div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-title">🎯 按鈕類型統計</div>
            <div class="button-stats">
                ${Object.entries(report.buttonTypeStats)
                  .map(
                    ([buttonType, stats]) => `
                    <div class="button-stat-item">
                        <h4>${buttonType}</h4>
                        <div class="stat-row">
                            <span class="label">點擊次數:</span>
                            <span class="value">${stats.clicks}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">成功次數:</span>
                            <span class="value">${stats.successes}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">失敗次數:</span>
                            <span class="value">${stats.failures}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">平均時間:</span>
                            <span class="value">${Math.round(stats.averageTime)}ms</span>
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-title">⚡ 性能指標</div>
            <div class="button-stats">
                <div class="button-stat-item">
                    <h4>響應時間</h4>
                    <div class="stat-row">
                        <span class="label">平均點擊時間:</span>
                        <span class="value">${Math.round(report.performance.averageClickTime)}ms</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">會話持續時間:</span>
                        <span class="value">${Math.round(report.performance.sessionDuration / 1000)}s</span>
                    </div>
                </div>
                <div class="button-stat-item">
                    <h4>系統效率</h4>
                    <div class="stat-row">
                        <span class="label">錯誤率:</span>
                        <span class="value">${Math.round(report.performance.errorRate)}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">吞吐量:</span>
                        <span class="value">${Math.round(report.performance.throughput * 100) / 100}/min</span>
                    </div>
                </div>
                <div class="button-stat-item">
                    <h4>資源使用</h4>
                    <div class="stat-row">
                        <span class="label">記憶體使用:</span>
                        <span class="value">${Math.round(report.performance.memoryUsage)}MB</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">CPU 使用:</span>
                        <span class="value">${Math.round(report.performance.cpuUsage)}%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-title">💰 ROI 分析</div>
            <div class="button-stats">
                <div class="button-stat-item">
                    <h4>生產力提升</h4>
                    <div class="stat-row">
                        <span class="label">生產力增益:</span>
                        <span class="value">${Math.round(report.roi.productivityGain)}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">自動化效率:</span>
                        <span class="value">${Math.round(report.roi.automationEfficiency)}%</span>
                    </div>
                </div>
                <div class="button-stat-item">
                    <h4>用戶體驗</h4>
                    <div class="stat-row">
                        <span class="label">滿意度分數:</span>
                        <span class="value">${Math.round(report.roi.userSatisfactionScore)}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">採用率:</span>
                        <span class="value">${Math.round(report.roi.adoptionRate)}%</span>
                    </div>
                </div>
                <div class="button-stat-item">
                    <h4>價值實現</h4>
                    <div class="stat-row">
                        <span class="label">價值實現時間:</span>
                        <span class="value">${Math.round(report.roi.timeToValue / 1000)}s</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">總節省時間:</span>
                        <span class="value">${Math.round(report.roi.totalTimeSaved / 1000)}s</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${
          report.recommendations.length > 0
            ? `
        <div class="recommendations">
            <h3>💡 優化建議</h3>
            <ul>
                ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        `
            : ''
        }
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        // 監聽來自擴展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateReport':
                    location.reload(); // 簡單重新載入更新數據
                    break;
            }
        });
    </script>
</body>
</html>`;
  }

  /**
   * 獲取趨勢指示器的 CSS 類別
   */
  private getTrendClass(trend: number): string {
    if (trend > 5) return 'trend-up';
    if (trend < -5) return 'trend-down';
    return 'trend-neutral';
  }

  /**
   * 獲取通用樣式
   */
  private getCommonStyles(): string {
    return `
        :root {
            --vscode-font-family: var(--vscode-font-family);
            --vscode-font-size: var(--vscode-font-size);
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-foreground);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin: 0 0 15px 0;
            color: var(--vscode-foreground);
        }
        
        h1 {
            font-size: 24px;
            border-bottom: 2px solid var(--vscode-textLink-foreground);
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        p {
            margin: 0 0 15px 0;
            color: var(--vscode-foreground);
        }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
        }
        
        .section h2 {
            margin-top: 0;
            color: var(--vscode-foreground);
            border-bottom: 2px solid var(--vscode-textLink-foreground);
            padding-bottom: 10px;
        }
    `;
  }

  /**
   * 設置控制面板訊息處理器
   */
  private setupControlPanelMessageHandler(): void {
    if (!this.controlPanel) return;

    this.controlPanel.webview.onDidReceiveMessage((message: WebviewMessage) => {
      switch (message.command) {
        case 'updateConfig':
          this.handleConfigUpdate(message.data);
          break;
        case 'start':
          vscode.commands.executeCommand(COMMANDS.START);
          break;
        case 'stop':
          vscode.commands.executeCommand(COMMANDS.STOP);
          break;
        case 'toggle':
          vscode.commands.executeCommand(COMMANDS.TOGGLE);
          break;
        case 'showAnalytics':
          this.showAnalyticsPanel();
          break;
        case 'exportAnalytics':
          vscode.commands.executeCommand(COMMANDS.EXPORT_ANALYTICS);
          break;
        case 'clearAnalytics':
          vscode.commands.executeCommand(COMMANDS.CLEAR_ANALYTICS);
          break;
        default:
          this.log(`未知的控制面板命令: ${message.command}`, LogLevel.WARNING);
      }
    });
  }

  /**
   * 設置分析面板訊息處理器
   */
  private setupAnalyticsPanelMessageHandler(): void {
    if (!this.analyticsPanel) return;

    this.analyticsPanel.webview.onDidReceiveMessage((message: WebviewMessage) => {
      switch (message.command) {
        case 'refresh':
          this.updateAnalyticsPanel();
          break;
        case 'export':
          vscode.commands.executeCommand(COMMANDS.EXPORT_ANALYTICS);
          break;
        default:
          this.log(`未知的分析面板命令: ${message.command}`, LogLevel.WARNING);
      }
    });
  }

  /**
   * 處理配置更新
   */
  private handleConfigUpdate(configUpdate: Partial<ExtensionConfig>): void {
    // 透過命令系統更新配置
    vscode.commands.executeCommand(COMMANDS.CONFIGURE, configUpdate);
    this.log(`配置已更新: ${JSON.stringify(configUpdate)}`, LogLevel.INFO);
  }

  /**
   * 關閉所有面板
   */
  public closeAllPanels(): void {
    if (this.controlPanel) {
      this.controlPanel.dispose();
      this.controlPanel = undefined;
    }
    if (this.analyticsPanel) {
      this.analyticsPanel.dispose();
      this.analyticsPanel = undefined;
    }
    this.log('所有面板已關閉', LogLevel.INFO);
  }

  /**
   * 日誌記錄
   */
  private log(message: string, level: LogLevel = LogLevel.INFO): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    this.outputChannel.appendLine(logMessage);

    if (level === LogLevel.ERROR) {
      console.error(logMessage);
    } else if (level === LogLevel.WARNING) {
      console.warn(logMessage);
    } else if (level === LogLevel.DEBUG) {
      console.debug(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * 清理資源
   */
  public dispose(): void {
    this.closeAllPanels();
    this.outputChannel.dispose();
    this.log('WebviewPanelManager 已清理', LogLevel.INFO);
  }
}
