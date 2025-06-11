/**
 * 📦 模組：Cursor Auto Accept Extension 主要入口
 * 🕒 最後更新：2025-06-11T14:45:35+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：VS Code 擴展主要邏輯，管理自動接受功能和資料分析
 */

import * as vscode from 'vscode';
import { AnalyticsManager } from './analytics';
import { AutoAcceptService } from './autoAcceptService';
import { WebviewPanelManager } from './webviewPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Cursor Auto Accept Extension 已啟動');

  // 初始化核心服務
  const analyticsManager = new AnalyticsManager(context);
  const autoAcceptService = new AutoAcceptService(analyticsManager);
  const webviewManager = new WebviewPanelManager(context, analyticsManager, autoAcceptService);

  // 註冊命令：切換自動接受功能
  const toggleCommand = vscode.commands.registerCommand('cursorAutoAccept.toggle', () => {
    const isEnabled = autoAcceptService.toggle();
    vscode.window.showInformationMessage(`自動接受功能已${isEnabled ? '啟用' : '停用'}`);
  });

  // 註冊命令：顯示控制面板
  const showPanelCommand = vscode.commands.registerCommand('cursorAutoAccept.showPanel', () => {
    webviewManager.showControlPanel();
  });

  // 註冊命令：顯示分析報告
  const showAnalyticsCommand = vscode.commands.registerCommand(
    'cursorAutoAccept.showAnalytics',
    () => {
      webviewManager.showAnalyticsPanel();
    }
  );

  // 註冊命令：匯出分析資料
  const exportDataCommand = vscode.commands.registerCommand(
    'cursorAutoAccept.exportData',
    async () => {
      try {
        const data = analyticsManager.exportData();
        const uri = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file(
            `cursor-auto-accept-extension-${new Date().toISOString().split('T')[0]}.json`
          ),
          filters: {
            'JSON Files': ['json'],
          },
        });

        if (uri) {
          await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(data, null, 2)));
          vscode.window.showInformationMessage('分析資料已匯出');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`匯出失敗: ${error}`);
      }
    }
  );

  // 註冊命令：清除所有資料
  const clearDataCommand = vscode.commands.registerCommand(
    'cursorAutoAccept.clearData',
    async () => {
      const result = await vscode.window.showWarningMessage(
        '確定要清除所有分析資料嗎？此操作無法復原。',
        { modal: true },
        '確定清除'
      );

      if (result === '確定清除') {
        analyticsManager.clearAllData();
        vscode.window.showInformationMessage('所有資料已清除');
      }
    }
  );

  // 監聽設定變更
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('cursorAutoAccept')) {
      autoAcceptService.updateConfiguration();
      vscode.window.showInformationMessage('設定已更新');
    }
  });

  // 狀態列項目
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'cursorAutoAccept.showPanel';
  statusBarItem.text = '$(zap) Auto Accept';
  statusBarItem.tooltip = 'Cursor Auto Accept - 點擊開啟控制面板';
  statusBarItem.show();

  // 啟動時自動啟用功能（如果設定中啟用）
  const config = vscode.workspace.getConfiguration('cursorAutoAccept');
  if (config.get('enabled', true)) {
    autoAcceptService.start();
  }

  // 添加到擴展上下文
  context.subscriptions.push(
    toggleCommand,
    showPanelCommand,
    showAnalyticsCommand,
    exportDataCommand,
    clearDataCommand,
    configChangeListener,
    statusBarItem,
    analyticsManager,
    autoAcceptService,
    webviewManager
  );

  console.log('Cursor Auto Accept Extension 完全啟動');
}

export function deactivate() {
  console.log('Cursor Auto Accept Extension 已停用');
}
