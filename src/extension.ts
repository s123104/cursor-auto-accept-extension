// Cursor Auto Accept Extension - 主擴展文件 v2.2.0

import * as vscode from 'vscode';
import { AutoAcceptService } from './services/AutoAcceptService';
import { AnalyticsManager } from './managers/AnalyticsManager';
import { WebviewPanelManager } from './ui/WebviewPanelManager';
import { ExtensionConfig, ButtonType, FileInfo, LogLevel, ServiceStatus } from './types';
import { COMMANDS, VERSION, EXTENSION_DISPLAY_NAME } from './utils/constants';

/**
 * 主擴展類別 - 企業級重構版本
 *
 * 負責：
 * - 擴展生命週期管理
 * - 服務協調和整合
 * - 命令註冊和處理
 * - 狀態管理
 * - 錯誤處理
 */
class CursorAutoAcceptExtension {
  private context: vscode.ExtensionContext;
  private outputChannel: vscode.OutputChannel;

  // 核心服務
  private autoAcceptService!: AutoAcceptService;
  private analyticsManager!: AnalyticsManager;
  private webviewManager!: WebviewPanelManager;

  // 狀態管理
  private isActivated = false;
  private statusBarItem: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel(`${EXTENSION_DISPLAY_NAME} Main`);

    // 創建狀態列項目
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = COMMANDS.SHOW_CONTROL_PANEL;

    this.log('擴展主類別已初始化', LogLevel.INFO);
  }

  /**
   * 激活擴展
   */
  public async activate(): Promise<void> {
    try {
      this.log(`正在激活 ${EXTENSION_DISPLAY_NAME} v${VERSION}...`, LogLevel.INFO);

      // 初始化核心服務
      await this.initializeServices();

      // 註冊命令
      this.registerCommands();

      // 設置事件監聽器
      this.setupEventListeners();

      // 更新狀態列
      this.updateStatusBar();

      // 顯示歡迎訊息
      this.showWelcomeMessage();

      this.isActivated = true;
      this.log('擴展激活完成', LogLevel.INFO);
    } catch (error) {
      this.log(`擴展激活失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`${EXTENSION_DISPLAY_NAME} 激活失敗: ${error}`);
      throw error;
    }
  }

  /**
   * 初始化核心服務
   */
  private async initializeServices(): Promise<void> {
    this.log('正在初始化核心服務...', LogLevel.INFO);

    // 初始化分析管理器
    this.analyticsManager = new AnalyticsManager(this.context);

    // 初始化自動接受服務
    this.autoAcceptService = new AutoAcceptService(this.context);

    // 初始化 Webview 管理器
    this.webviewManager = new WebviewPanelManager(
      this.context,
      () => this.autoAcceptService.getStatus().config,
      () => this.analyticsManager.getAnalyticsData(),
      () => this.analyticsManager.getROIMetrics(),
      () => this.analyticsManager.getPerformanceMetrics(),
      () => this.analyticsManager.generateReport()
    );

    // 設置服務間的通信
    this.setupServiceIntegration();

    this.log('核心服務初始化完成', LogLevel.INFO);
  }

  /**
   * 設置服務間的整合
   */
  private setupServiceIntegration(): void {
    // 監聽自動接受服務事件，更新分析數據
    this.autoAcceptService.onEvent(event => {
      if (event.event === 'click-recorded') {
        const { buttonType, fileInfo, success, duration } = event.data;
        this.analyticsManager.recordClick(
          buttonType as ButtonType,
          fileInfo as FileInfo,
          success as boolean,
          duration as number
        );

        // 更新 Webview 面板
        this.webviewManager.updateControlPanel();
        this.webviewManager.updateAnalyticsPanel();

        // 更新狀態列
        this.updateStatusBar();
      }
    });

    // 監聽分析管理器事件
    this.analyticsManager.onEvent(event => {
      if (event.type === 'click-recorded') {
        // 可以在這裡添加額外的處理邏輯
        this.log(`分析數據已更新: ${JSON.stringify(event.data)}`, LogLevel.DEBUG);
      }
    });
  }

  /**
   * 註冊擴展命令
   */
  private registerCommands(): void {
    const commands = [
      // 基本控制命令
      {
        command: COMMANDS.TOGGLE,
        handler: () => this.handleToggle(),
      },
      {
        command: COMMANDS.START,
        handler: () => this.handleStart(),
      },
      {
        command: COMMANDS.STOP,
        handler: () => this.handleStop(),
      },

      // UI 相關命令
      {
        command: COMMANDS.SHOW_CONTROL_PANEL,
        handler: () => this.handleShowControlPanel(),
      },
      {
        command: COMMANDS.SHOW_ANALYTICS,
        handler: () => this.handleShowAnalytics(),
      },

      // 分析相關命令
      {
        command: COMMANDS.EXPORT_ANALYTICS,
        handler: () => this.handleExportAnalytics(),
      },
      {
        command: COMMANDS.CLEAR_ANALYTICS,
        handler: () => this.handleClearAnalytics(),
      },

      // 配置相關命令
      {
        command: COMMANDS.CONFIGURE,
        handler: (configUpdate: Partial<ExtensionConfig>) => this.handleConfigure(configUpdate),
      },

      // 偵錯相關命令
      {
        command: COMMANDS.DEBUG_SEARCH,
        handler: () => this.handleDebugSearch(),
      },
      {
        command: COMMANDS.ENABLE_DEBUG,
        handler: () => this.handleEnableDebug(),
      },
      {
        command: COMMANDS.DISABLE_DEBUG,
        handler: () => this.handleDisableDebug(),
      },
    ];

    commands.forEach(({ command, handler }) => {
      const disposable = vscode.commands.registerCommand(command, handler);
      this.context.subscriptions.push(disposable);
    });

    this.log(`已註冊 ${commands.length} 個命令`, LogLevel.INFO);
  }

  /**
   * 設置事件監聽器
   */
  private setupEventListeners(): void {
    // 監聽配置變更
    const onConfigChange = vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('cursorAutoAccept')) {
        this.updateStatusBar();
        this.webviewManager.updateControlPanel();
      }
    });
    this.context.subscriptions.push(onConfigChange);

    // 監聽擴展停用
    const onExtensionDeactivate = () => {
      this.deactivate();
    };
    this.context.subscriptions.push({ dispose: onExtensionDeactivate });
  }

  /**
   * 命令處理器
   */
  private async handleToggle(): Promise<void> {
    try {
      await this.autoAcceptService.toggle();
      this.updateStatusBar();
      this.webviewManager.updateControlPanel();

      const status = this.autoAcceptService.getStatus();
      const message = status.isRunning ? '自動接受已啟動' : '自動接受已停止';
      vscode.window.showInformationMessage(message);
    } catch (error) {
      this.log(`切換服務失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`切換失敗: ${error}`);
    }
  }

  private async handleStart(): Promise<void> {
    try {
      await this.autoAcceptService.start();
      this.updateStatusBar();
      this.webviewManager.updateControlPanel();
      vscode.window.showInformationMessage('自動接受已啟動');
    } catch (error) {
      this.log(`啟動服務失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`啟動失敗: ${error}`);
    }
  }

  private handleStop(): void {
    try {
      this.autoAcceptService.stop();
      this.updateStatusBar();
      this.webviewManager.updateControlPanel();
      vscode.window.showInformationMessage('自動接受已停止');
    } catch (error) {
      this.log(`停止服務失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`停止失敗: ${error}`);
    }
  }

  private handleShowControlPanel(): void {
    try {
      this.webviewManager.showControlPanel();
    } catch (error) {
      this.log(`顯示控制面板失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`顯示控制面板失敗: ${error}`);
    }
  }

  private handleShowAnalytics(): void {
    try {
      this.webviewManager.showAnalyticsPanel();
    } catch (error) {
      this.log(`顯示分析面板失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`顯示分析面板失敗: ${error}`);
    }
  }

  private async handleExportAnalytics(): Promise<void> {
    try {
      const report = this.analyticsManager.generateReport();
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(`cursor-auto-accept-report-${Date.now()}.json`),
        filters: {
          'JSON Files': ['json'],
          'All Files': ['*'],
        },
      });

      if (uri) {
        const reportData = JSON.stringify(report, null, 2);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(reportData, 'utf8'));
        vscode.window.showInformationMessage(`分析報告已匯出至: ${uri.fsPath}`);
      }
    } catch (error) {
      this.log(`匯出分析報告失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`匯出失敗: ${error}`);
    }
  }

  private async handleClearAnalytics(): Promise<void> {
    try {
      const confirm = await vscode.window.showWarningMessage(
        '確定要清除所有分析數據嗎？此操作無法復原。',
        { modal: true },
        '確定',
        '取消'
      );

      if (confirm === '確定') {
        this.analyticsManager.resetAnalytics();
        this.webviewManager.updateControlPanel();
        this.webviewManager.updateAnalyticsPanel();
        vscode.window.showInformationMessage('分析數據已清除');
      }
    } catch (error) {
      this.log(`清除分析數據失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`清除失敗: ${error}`);
    }
  }

  private handleConfigure(configUpdate: Partial<ExtensionConfig>): void {
    try {
      this.autoAcceptService.updateConfiguration(configUpdate);
      this.webviewManager.updateControlPanel();
      this.log(`配置已更新: ${JSON.stringify(configUpdate)}`, LogLevel.INFO);
    } catch (error) {
      this.log(`更新配置失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`配置更新失敗: ${error}`);
    }
  }

  private handleDebugSearch(): void {
    try {
      // 實現偵錯搜尋功能
      const status = this.autoAcceptService.getStatus();
      const debugInfo = {
        isRunning: status.isRunning,
        totalClicks: status.totalClicks,
        config: status.config,
        timestamp: new Date().toISOString(),
      };

      this.outputChannel.appendLine('=== 偵錯資訊 ===');
      this.outputChannel.appendLine(JSON.stringify(debugInfo, null, 2));
      this.outputChannel.show();
    } catch (error) {
      this.log(`偵錯搜尋失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`偵錯搜尋失敗: ${error}`);
    }
  }

  private handleEnableDebug(): void {
    try {
      this.autoAcceptService.updateConfiguration({ debugMode: true });
      vscode.window.showInformationMessage('偵錯模式已啟用');
    } catch (error) {
      this.log(`啟用偵錯模式失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`啟用偵錯模式失敗: ${error}`);
    }
  }

  private handleDisableDebug(): void {
    try {
      this.autoAcceptService.updateConfiguration({ debugMode: false });
      vscode.window.showInformationMessage('偵錯模式已停用');
    } catch (error) {
      this.log(`停用偵錯模式失敗: ${error}`, LogLevel.ERROR);
      vscode.window.showErrorMessage(`停用偵錯模式失敗: ${error}`);
    }
  }

  /**
   * 更新狀態列
   */
  private updateStatusBar(): void {
    const status = this.autoAcceptService.getStatus();
    const analytics = this.analyticsManager.getAnalyticsData();

    if (status.isRunning) {
      this.statusBarItem.text = `$(play) Auto Accept (${analytics.totalClicks})`;
      this.statusBarItem.tooltip = `Cursor Auto Accept 正在運行\n總點擊: ${analytics.totalClicks}\n成功率: ${Math.round((analytics.successfulClicks / Math.max(analytics.totalClicks, 1)) * 100)}%`;
      this.statusBarItem.backgroundColor = undefined;
    } else {
      this.statusBarItem.text = `$(debug-pause) Auto Accept`;
      this.statusBarItem.tooltip = 'Cursor Auto Accept 已停止\n點擊開啟控制面板';
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }

    this.statusBarItem.show();
  }

  /**
   * 顯示歡迎訊息
   */
  private showWelcomeMessage(): void {
    const config = vscode.workspace.getConfiguration('cursorAutoAccept');
    const showWelcome = config.get('showWelcomeMessage', true);

    if (showWelcome) {
      vscode.window
        .showInformationMessage(
          `🎉 ${EXTENSION_DISPLAY_NAME} v${VERSION} 已激活！`,
          '開啟控制面板',
          '不再顯示'
        )
        .then(selection => {
          if (selection === '開啟控制面板') {
            this.handleShowControlPanel();
          } else if (selection === '不再顯示') {
            config.update('showWelcomeMessage', false, vscode.ConfigurationTarget.Global);
          }
        });
    }
  }

  /**
   * 停用擴展
   */
  public deactivate(): void {
    if (!this.isActivated) return;

    try {
      this.log('正在停用擴展...', LogLevel.INFO);

      // 停止服務
      this.autoAcceptService?.stop();

      // 清理資源
      this.autoAcceptService?.dispose();
      this.analyticsManager?.dispose();
      this.webviewManager?.dispose();

      // 清理狀態列
      this.statusBarItem?.dispose();

      // 清理輸出通道
      this.outputChannel?.dispose();

      this.isActivated = false;
      this.log('擴展已停用', LogLevel.INFO);
    } catch (error) {
      this.log(`擴展停用時發生錯誤: ${error}`, LogLevel.ERROR);
    }
  }

  /**
   * 獲取擴展狀態
   */
  public getStatus(): ServiceStatus {
    return this.autoAcceptService.getStatus();
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
}

// 全域擴展實例
let extension: CursorAutoAcceptExtension | undefined;

/**
 * 擴展激活入口點
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    extension = new CursorAutoAcceptExtension(context);
    await extension.activate();
  } catch (error) {
    console.error('擴展激活失敗:', error);
    vscode.window.showErrorMessage(`${EXTENSION_DISPLAY_NAME} 激活失敗: ${error}`);
    throw error;
  }
}

/**
 * 擴展停用入口點
 */
export function deactivate(): void {
  try {
    extension?.deactivate();
    extension = undefined;
  } catch (error) {
    console.error('擴展停用失敗:', error);
  }
}
