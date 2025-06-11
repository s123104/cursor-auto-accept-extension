/**
 * 📦 模組：Webview 面板管理器
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：管理控制面板和分析面板的 Webview 介面
 */

import * as vscode from 'vscode';
import { AnalyticsManager } from './analytics';
import { AutoAcceptService } from './autoAcceptService';

export class WebviewPanelManager implements vscode.Disposable {
  private _context: vscode.ExtensionContext;
  private _analyticsManager: AnalyticsManager;
  private _autoAcceptService: AutoAcceptService;
  private controlPanel: vscode.WebviewPanel | null = null;

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
      { enableScripts: true }
    );

    this.controlPanel.webview.html = this.getControlPanelHtml();
    this.controlPanel.onDidDispose(() => {
      this.controlPanel = null;
    });
  }

  /**
   * 顯示分析面板
   */
  showAnalyticsPanel(): void {
    const panel = vscode.window.createWebviewPanel(
      'cursorAutoAcceptAnalytics',
      'Cursor Auto Accept 分析報告',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = this.getAnalyticsHtml();
  }

  /**
   * 生成控制面板 HTML
   */
  private getControlPanelHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>控制面板</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .btn { padding: 10px 20px; margin: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Cursor Auto Accept 控制面板</h1>
    <button class="btn" onclick="toggleService()">切換服務</button>
    <div id="status">載入中...</div>
</body>
</html>`;
  }

  /**
   * 生成分析面板 HTML
   */
  private getAnalyticsHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>分析報告</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
    </style>
</head>
<body>
    <h1>分析報告</h1>
    <p>分析功能正在開發中...</p>
</body>
</html>`;
  }

  dispose(): void {
    this.controlPanel?.dispose();
  }
}
