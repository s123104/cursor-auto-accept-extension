// AutoAcceptService - Core auto-accept logic for VS Code Extension v2.2.0

import * as vscode from 'vscode';
import { ExtensionConfig, ButtonType, FileInfo, ServiceStatus, LogLevel } from '../types';
import {
  DEFAULT_CONFIG,
  MIN_CLICK_INTERVAL,
  CLICK_COOLDOWN_PERIOD,
  MAX_RETRY_DURATION,
  EVENTS,
} from '../utils/constants';

/**
 * AutoAcceptService - 核心自動接受服務
 *
 * 負責：
 * - 監控檔案變更事件
 * - 自動執行 VS Code 命令模擬按鈕點擊
 * - 管理服務狀態和配置
 * - 防重複點擊機制
 * - 錯誤處理和日誌記錄
 */
export class AutoAcceptService {
  private isRunning = false;
  private totalClicks = 0;
  private config: ExtensionConfig;
  private context: vscode.ExtensionContext;
  private outputChannel: vscode.OutputChannel;

  // 防重複點擊機制
  private recentClicks = new Map<string, number>();
  private lastClickTime = 0;
  private processedDocuments = new WeakSet<vscode.TextDocument>();
  private ineffectiveClicks = new Map<
    string,
    {
      firstAttempt: number;
      lastAttempt: number;
      attemptCount: number;
      isIneffective: boolean;
      buttonType: string;
    }
  >();

  // 事件監聽器
  private disposables: vscode.Disposable[] = [];
  private eventEmitter = new vscode.EventEmitter<{ event: string; data: any }>();

  // 定時器
  private monitorTimer?: NodeJS.Timeout;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel('Cursor Auto Accept');
    this.config = this.loadConfiguration();

    this.setupEventListeners();
    this.log('AutoAcceptService 已初始化', LogLevel.INFO);
  }

  /**
   * 載入配置
   */
  private loadConfiguration(): ExtensionConfig {
    const workspaceConfig = vscode.workspace.getConfiguration('cursorAutoAccept');

    return {
      enableAcceptAll: workspaceConfig.get('enableAcceptAll', DEFAULT_CONFIG.enableAcceptAll),
      enableAccept: workspaceConfig.get('enableAccept', DEFAULT_CONFIG.enableAccept),
      enableRun: workspaceConfig.get('enableRun', DEFAULT_CONFIG.enableRun),
      enableRunCommand: workspaceConfig.get('enableRunCommand', DEFAULT_CONFIG.enableRunCommand),
      enableApply: workspaceConfig.get('enableApply', DEFAULT_CONFIG.enableApply),
      enableExecute: workspaceConfig.get('enableExecute', DEFAULT_CONFIG.enableExecute),
      enableResume: workspaceConfig.get('enableResume', DEFAULT_CONFIG.enableResume),
      enableTryAgain: workspaceConfig.get('enableTryAgain', DEFAULT_CONFIG.enableTryAgain),
      enableMoveToBackground: workspaceConfig.get(
        'enableMoveToBackground',
        DEFAULT_CONFIG.enableMoveToBackground
      ),
      interval: workspaceConfig.get('interval', DEFAULT_CONFIG.interval),
      debugMode: workspaceConfig.get('debugMode', DEFAULT_CONFIG.debugMode),
      averageCompleteWorkflow: workspaceConfig.get(
        'averageCompleteWorkflow',
        DEFAULT_CONFIG.averageCompleteWorkflow
      ),
      averageAutomatedWorkflow: workspaceConfig.get(
        'averageAutomatedWorkflow',
        DEFAULT_CONFIG.averageAutomatedWorkflow
      ),
    };
  }

  /**
   * 設置事件監聽器
   */
  private setupEventListeners(): void {
    // 監聽檔案變更
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
      this.onDocumentChanged.bind(this)
    );
    this.disposables.push(onDidChangeTextDocument);

    // 監聽檔案保存
    const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(
      this.onDocumentSaved.bind(this)
    );
    this.disposables.push(onDidSaveTextDocument);

    // 監聽配置變更
    const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(
      this.onConfigurationChanged.bind(this)
    );
    this.disposables.push(onDidChangeConfiguration);

    // 監聽編輯器變更
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(
      this.onActiveEditorChanged.bind(this)
    );
    this.disposables.push(onDidChangeActiveTextEditor);
  }

  /**
   * 文檔變更處理
   */
  private async onDocumentChanged(event: vscode.TextDocumentChangeEvent): Promise<void> {
    if (!this.isRunning) return;

    const document = event.document;

    // 避免處理已處理的文檔
    if (this.processedDocuments.has(document)) return;

    // 檢查是否有未保存的變更
    if (document.isDirty) {
      await this.handleAutoAcceptOpportunity(document, ButtonType.ACCEPT);
    }
  }

  /**
   * 文檔保存處理
   */
  private async onDocumentSaved(document: vscode.TextDocument): Promise<void> {
    if (!this.isRunning) return;

    this.processedDocuments.delete(document); // 重置處理狀態
    this.log(`文檔已保存: ${document.fileName}`, LogLevel.INFO);
  }

  /**
   * 配置變更處理
   */
  private onConfigurationChanged(event: vscode.ConfigurationChangeEvent): void {
    if (event.affectsConfiguration('cursorAutoAccept')) {
      const oldConfig = this.config;
      this.config = this.loadConfiguration();

      this.log('配置已更新', LogLevel.INFO);
      this.eventEmitter.fire({
        event: EVENTS.CONFIG_UPDATED,
        data: { oldConfig, newConfig: this.config },
      });

      // 如果服務正在運行，重新啟動以應用新配置
      if (this.isRunning) {
        this.restart();
      }
    }
  }

  /**
   * 活動編輯器變更處理
   */
  private async onActiveEditorChanged(editor: vscode.TextEditor | undefined): Promise<void> {
    if (!this.isRunning || !editor) return;

    // 檢查新的活動編輯器是否有自動接受機會
    await this.checkForAutoAcceptOpportunities(editor);
  }

  /**
   * 處理自動接受機會
   */
  private async handleAutoAcceptOpportunity(
    document: vscode.TextDocument,
    buttonType: ButtonType
  ): Promise<void> {
    const now = Date.now();
    const documentKey = this.getDocumentKey(document);

    // 檢查是否可以點擊
    if (!this.canPerformAction(documentKey, buttonType, now)) {
      return;
    }

    // 記錄點擊狀態
    this.recordClick(documentKey, now);
    this.processedDocuments.add(document);

    const startTime = performance.now();

    try {
      // 根據按鈕類型執行對應的 VS Code 命令
      const success = await this.executeButtonAction(document, buttonType);

      if (success) {
        const endTime = performance.now();
        const actualTime = endTime - startTime;

        // 提取檔案資訊
        const fileInfo = this.extractFileInfo(document);

        // 發送成功事件
        this.eventEmitter.fire({
          event: EVENTS.BUTTON_CLICKED,
          data: {
            buttonType,
            fileInfo,
            actualTime,
            success: true,
          },
        });

        this.totalClicks++;
        this.log(
          `✓ 成功執行 ${buttonType} 操作: ${document.fileName} (${actualTime.toFixed(1)}ms)`,
          LogLevel.INFO
        );
      } else {
        this.log(`✗ 執行 ${buttonType} 操作失敗: ${document.fileName}`, LogLevel.WARNING);
      }
    } catch (error) {
      this.log(`執行 ${buttonType} 操作時發生錯誤: ${error}`, LogLevel.ERROR);
    }
  }

  /**
   * 執行按鈕動作
   */
  private async executeButtonAction(
    document: vscode.TextDocument,
    buttonType: ButtonType
  ): Promise<boolean> {
    try {
      switch (buttonType) {
        case ButtonType.ACCEPT:
        case ButtonType.ACCEPT_ALL:
          // 模擬接受：保存文檔
          if (document.isDirty) {
            await document.save();
            return true;
          }
          break;

        case ButtonType.APPLY:
          // 模擬應用：格式化文檔
          await vscode.commands.executeCommand('editor.action.formatDocument');
          return true;

        case ButtonType.RUN:
        case ButtonType.EXECUTE:
          // 模擬執行：自動修復
          await vscode.commands.executeCommand('editor.action.autoFix');
          return true;

        case ButtonType.RUN_COMMAND:
          // 模擬運行命令：執行工作區命令
          await vscode.commands.executeCommand('workbench.action.tasks.runTask');
          return true;

        case ButtonType.RESUME:
          // 模擬繼續：嘗試執行 Cursor 特定命令
          try {
            await vscode.commands.executeCommand('composer.resumeCurrentChat');
            return true;
          } catch {
            // 如果命令不存在，記錄但不視為錯誤
            this.log('Resume 命令不可用，可能需要在 Cursor IDE 中執行', LogLevel.WARNING);
            return false;
          }

        case ButtonType.TRY_AGAIN:
          // 模擬重試：重新載入視窗
          await vscode.commands.executeCommand('workbench.action.reloadWindow');
          return true;

        case ButtonType.MOVE_TO_BACKGROUND:
          // 模擬移至背景：最小化視窗（如果支援）
          try {
            await vscode.commands.executeCommand('workbench.action.minimizeWindow');
            return true;
          } catch {
            this.log('移至背景命令不可用', LogLevel.WARNING);
            return false;
          }

        default:
          this.log(`未知的按鈕類型: ${buttonType}`, LogLevel.WARNING);
          return false;
      }
    } catch (error) {
      this.log(`執行 ${buttonType} 命令時發生錯誤: ${error}`, LogLevel.ERROR);
      return false;
    }

    return false;
  }

  /**
   * 檢查自動接受機會
   */
  private async checkForAutoAcceptOpportunities(editor: vscode.TextEditor): Promise<void> {
    const document = editor.document;

    // 檢查不同類型的自動接受機會
    if (this.config.enableAccept && document.isDirty) {
      await this.handleAutoAcceptOpportunity(document, ButtonType.ACCEPT);
    }

    // 可以添加更多檢查邏輯...
  }

  /**
   * 提取檔案資訊
   */
  private extractFileInfo(document: vscode.TextDocument): FileInfo {
    return {
      filename: document.fileName,
      addedLines: 0, // VS Code API 中難以精確計算，設為 0
      deletedLines: 0, // VS Code API 中難以精確計算，設為 0
      timestamp: new Date(),
    };
  }

  /**
   * 生成文檔鍵值
   */
  private getDocumentKey(document: vscode.TextDocument): string {
    return `${document.uri.toString()}-${document.version}`;
  }

  /**
   * 檢查是否可以執行操作
   */
  private canPerformAction(documentKey: string, buttonType: ButtonType, now: number): boolean {
    // 檢查全域點擊間隔
    if (now - this.lastClickTime < MIN_CLICK_INTERVAL) {
      return false;
    }

    // 檢查按鈕類型是否啟用
    if (!this.isButtonTypeEnabled(buttonType)) {
      return false;
    }

    // 檢查冷卻期
    if (this.recentClicks.has(documentKey)) {
      const lastClickTime = this.recentClicks.get(documentKey)!;
      if (now - lastClickTime < CLICK_COOLDOWN_PERIOD) {
        return false;
      }
    }

    // 檢查無效點擊記錄
    if (this.ineffectiveClicks.has(documentKey)) {
      const clickHistory = this.ineffectiveClicks.get(documentKey)!;
      if (now - clickHistory.firstAttempt < MAX_RETRY_DURATION && clickHistory.isIneffective) {
        return false;
      }
      // 如果超過最大重試時間，清除記錄
      if (now - clickHistory.firstAttempt >= MAX_RETRY_DURATION) {
        this.ineffectiveClicks.delete(documentKey);
      }
    }

    return true;
  }

  /**
   * 記錄點擊
   */
  private recordClick(documentKey: string, now: number): void {
    this.lastClickTime = now;
    this.recentClicks.set(documentKey, now);
  }

  /**
   * 檢查按鈕類型是否啟用
   */
  private isButtonTypeEnabled(buttonType: ButtonType): boolean {
    switch (buttonType) {
      case ButtonType.ACCEPT_ALL:
        return this.config.enableAcceptAll;
      case ButtonType.ACCEPT:
        return this.config.enableAccept;
      case ButtonType.RUN:
        return this.config.enableRun;
      case ButtonType.RUN_COMMAND:
        return this.config.enableRunCommand;
      case ButtonType.APPLY:
        return this.config.enableApply;
      case ButtonType.EXECUTE:
        return this.config.enableExecute;
      case ButtonType.RESUME:
        return this.config.enableResume;
      case ButtonType.TRY_AGAIN:
        return this.config.enableTryAgain;
      case ButtonType.MOVE_TO_BACKGROUND:
        return this.config.enableMoveToBackground;
      default:
        return false;
    }
  }

  /**
   * 清理過期記錄
   */
  private cleanupExpiredRecords(): void {
    const now = Date.now();

    // 清理過期點擊記錄
    for (const [key, time] of this.recentClicks.entries()) {
      if (now - time > CLICK_COOLDOWN_PERIOD) {
        this.recentClicks.delete(key);
      }
    }

    // 清理過期無效點擊記錄
    for (const [key, record] of this.ineffectiveClicks.entries()) {
      if (now - record.firstAttempt > MAX_RETRY_DURATION) {
        this.ineffectiveClicks.delete(key);
      }
    }
  }

  /**
   * 日誌記錄
   */
  private log(message: string, level: LogLevel = LogLevel.INFO): void {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;

    if (this.config.debugMode || level === LogLevel.ERROR) {
      this.outputChannel.appendLine(logMessage);
    }

    if (level === LogLevel.ERROR) {
      console.error(logMessage);
    } else if (this.config.debugMode) {
      console.log(logMessage);
    }
  }

  // 公共方法

  /**
   * 啟動服務
   */
  public async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;

    // 啟動定期清理
    this.monitorTimer = setInterval(() => {
      this.cleanupExpiredRecords();
    }, this.config.interval);

    // 檢查當前活動編輯器
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      await this.checkForAutoAcceptOpportunities(activeEditor);
    }

    this.eventEmitter.fire({ event: EVENTS.SERVICE_STARTED, data: {} });
    this.log('AutoAcceptService 已啟動', LogLevel.INFO);
  }

  /**
   * 停止服務
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = undefined;
    }

    this.eventEmitter.fire({ event: EVENTS.SERVICE_STOPPED, data: {} });
    this.log('AutoAcceptService 已停止', LogLevel.INFO);
  }

  /**
   * 重新啟動服務
   */
  public async restart(): Promise<void> {
    this.stop();
    await this.start();
  }

  /**
   * 切換服務狀態
   */
  public async toggle(): Promise<void> {
    if (this.isRunning) {
      this.stop();
    } else {
      await this.start();
    }
  }

  /**
   * 更新配置
   */
  public updateConfiguration(newConfig: Partial<ExtensionConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // 保存到 VS Code 設定
    const workspaceConfig = vscode.workspace.getConfiguration('cursorAutoAccept');
    for (const [key, value] of Object.entries(newConfig)) {
      workspaceConfig.update(key, value, vscode.ConfigurationTarget.Global);
    }
  }

  /**
   * 只啟用指定的按鈕類型
   */
  public enableOnly(buttonTypes: ButtonType[]): void {
    const newConfig: Partial<ExtensionConfig> = {
      enableAcceptAll: buttonTypes.includes(ButtonType.ACCEPT_ALL),
      enableAccept: buttonTypes.includes(ButtonType.ACCEPT),
      enableRun: buttonTypes.includes(ButtonType.RUN),
      enableRunCommand: buttonTypes.includes(ButtonType.RUN_COMMAND),
      enableApply: buttonTypes.includes(ButtonType.APPLY),
      enableExecute: buttonTypes.includes(ButtonType.EXECUTE),
      enableResume: buttonTypes.includes(ButtonType.RESUME),
      enableTryAgain: buttonTypes.includes(ButtonType.TRY_AGAIN),
      enableMoveToBackground: buttonTypes.includes(ButtonType.MOVE_TO_BACKGROUND),
    };

    this.updateConfiguration(newConfig);
  }

  /**
   * 啟用所有按鈕類型
   */
  public enableAll(): void {
    this.updateConfiguration({
      enableAcceptAll: true,
      enableAccept: true,
      enableRun: true,
      enableRunCommand: true,
      enableApply: true,
      enableExecute: true,
      enableResume: true,
      enableTryAgain: true,
      enableMoveToBackground: true,
    });
  }

  /**
   * 禁用所有按鈕類型
   */
  public disableAll(): void {
    this.updateConfiguration({
      enableAcceptAll: false,
      enableAccept: false,
      enableRun: false,
      enableRunCommand: false,
      enableApply: false,
      enableExecute: false,
      enableResume: false,
      enableTryAgain: false,
      enableMoveToBackground: false,
    });
  }

  /**
   * 設置按鈕啟用狀態
   */
  public setButtonEnabled(buttonType: ButtonType, enabled: boolean): void {
    const configKey = this.getConfigKeyForButtonType(buttonType);
    if (configKey) {
      this.updateConfiguration({ [configKey]: enabled } as Partial<ExtensionConfig>);
    }
  }

  /**
   * 獲取按鈕類型對應的配置鍵
   */
  private getConfigKeyForButtonType(buttonType: ButtonType): keyof ExtensionConfig | null {
    switch (buttonType) {
      case ButtonType.ACCEPT_ALL:
        return 'enableAcceptAll';
      case ButtonType.ACCEPT:
        return 'enableAccept';
      case ButtonType.RUN:
        return 'enableRun';
      case ButtonType.RUN_COMMAND:
        return 'enableRunCommand';
      case ButtonType.APPLY:
        return 'enableApply';
      case ButtonType.EXECUTE:
        return 'enableExecute';
      case ButtonType.RESUME:
        return 'enableResume';
      case ButtonType.TRY_AGAIN:
        return 'enableTryAgain';
      case ButtonType.MOVE_TO_BACKGROUND:
        return 'enableMoveToBackground';
      default:
        return null;
    }
  }

  /**
   * 獲取服務狀態
   */
  public getStatus(): ServiceStatus {
    return {
      isRunning: this.isRunning,
      totalClicks: this.totalClicks,
      config: this.config,
      analytics: {
        totalClicks: this.totalClicks,
        successfulClicks: this.totalClicks,
        failedClicks: 0,
        totalTimeSaved: 0,
        sessionsCount: 0,
        buttonTypeStats: {},
        dailyStats: {},
        weeklyStats: {},
        monthlyStats: {},
        averageResponseTime: 0,
        lastUpdated: Date.now(),
      },
      roiStats: {
        totalMeasurements: 0,
        manualCount: 0,
        autoCount: 0,
        averageManualTime: this.config.averageCompleteWorkflow,
        averageAutoTime: this.config.averageAutomatedWorkflow,
        efficiency: 0,
      },
    };
  }

  /**
   * 獲取事件發射器
   */
  public get onEvent(): vscode.Event<{ event: string; data: any }> {
    return this.eventEmitter.event;
  }

  /**
   * 釋放資源
   */
  public dispose(): void {
    this.stop();

    // 清理事件監聽器
    this.disposables.forEach(disposable => disposable.dispose());
    this.disposables = [];

    // 清理事件發射器
    this.eventEmitter.dispose();

    // 清理輸出通道
    this.outputChannel.dispose();

    this.log('AutoAcceptService 已釋放資源', LogLevel.INFO);
  }
}
