/**
 * 📦 模組：自動接受服務
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：核心自動接受邏輯服務，通過 VS Code API 間接實現自動點擊
 */

import * as vscode from 'vscode';
import { AnalyticsManager } from './analytics';

export interface ButtonConfig {
  enableAcceptAll: boolean;
  enableAccept: boolean;
  enableRun: boolean;
  enableRunCommand: boolean;
  enableApply: boolean;
  enableExecute: boolean;
  enableResume: boolean;
}

export class AutoAcceptService implements vscode.Disposable {
  private isRunning: boolean = false;
  private monitorInterval: NodeJS.Timeout | null = null;
  private interval: number = 2000;
  private config: ButtonConfig;
  private analyticsManager: AnalyticsManager;
  private debugMode: boolean = false;

  constructor(analyticsManager: AnalyticsManager) {
    this.analyticsManager = analyticsManager;
    this.config = {
      enableAcceptAll: true,
      enableAccept: true,
      enableRun: true,
      enableRunCommand: true,
      enableApply: true,
      enableExecute: true,
      enableResume: true,
    };

    this.updateConfiguration();
  }

  /**
   * 更新配置從 VS Code 設定
   */
  updateConfiguration(): void {
    const vsConfig = vscode.workspace.getConfiguration('cursorAutoAccept');

    this.interval = vsConfig.get('interval', 2000);
    this.debugMode = vsConfig.get('debugMode', false);

    this.config = {
      enableAcceptAll: vsConfig.get('enableAcceptAll', true),
      enableAccept: vsConfig.get('enableAccept', true),
      enableRun: vsConfig.get('enableRun', true),
      enableRunCommand: vsConfig.get('enableRunCommand', true),
      enableApply: vsConfig.get('enableApply', true),
      enableExecute: vsConfig.get('enableExecute', true),
      enableResume: vsConfig.get('enableResume', true),
    };

    // 如果正在運行，重新啟動以應用新配置
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * 啟動自動接受服務
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.log('Auto Accept Service started');

    // 由於 VS Code 擴展無法直接操作 DOM，我們使用替代方案
    this.monitorInterval = setInterval(() => {
      this.checkForAutoAcceptOpportunities();
    }, this.interval);
  }

  /**
   * 停止自動接受服務
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.log('Auto Accept Service stopped');

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  /**
   * 切換服務狀態
   */
  toggle(): boolean {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  /**
   * 檢查自動接受機會
   * 注意：由於 VS Code 擴展 API 限制，這裡使用替代方案
   */
  private async checkForAutoAcceptOpportunities(): Promise<void> {
    try {
      // 方案 1: 監聽編輯器變更並自動保存
      if (this.config.enableAccept || this.config.enableAcceptAll) {
        await this.handleEditorChanges();
      }

      // 方案 2: 執行相關命令
      if (this.config.enableRun || this.config.enableExecute) {
        await this.handleRunCommands();
      }
    } catch (error) {
      this.log(`Error in auto accept check: ${error}`);
    }
  }

  /**
   * 處理編輯器變更
   */
  private async handleEditorChanges(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    const document = activeEditor.document;

    // 檢查是否有未保存的變更
    if (document.isDirty) {
      // 模擬接受行為：自動保存文件
      try {
        await document.save();

        // 記錄到分析系統
        const filename = document.fileName;
        this.analyticsManager.trackFileAcceptance(filename, 'auto-save', 1, 0);

        this.log(`Auto-saved file: ${filename}`);
      } catch (error) {
        this.log(`Failed to auto-save: ${error}`);
      }
    }
  }

  /**
   * 處理運行命令
   */
  private async handleRunCommands(): Promise<void> {
    // 檢查是否有可用的代碼動作
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    try {
      // 執行格式化命令（模擬 Apply 行為）
      if (this.config.enableApply) {
        await vscode.commands.executeCommand('editor.action.formatDocument');
        this.log('Auto-formatted document');
      }

      // 執行代碼修復（模擬 Fix 行為）
      if (this.config.enableExecute) {
        await vscode.commands.executeCommand('editor.action.autoFix');
        this.log('Auto-fixed code issues');
      }
    } catch (error) {
      // 某些命令可能不可用，這是正常的
      this.log(`Command execution info: ${error}`, 'debug');
    }
  }

  /**
   * 獲取服務狀態
   */
  getStatus(): {
    isRunning: boolean;
    config: ButtonConfig;
    interval: number;
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      interval: this.interval,
    };
  }

  /**
   * 設置特定按鈕類型的啟用狀態
   */
  setButtonEnabled(buttonType: keyof ButtonConfig, enabled: boolean): void {
    this.config[buttonType] = enabled;

    // 更新 VS Code 設定
    const vsConfig = vscode.workspace.getConfiguration('cursorAutoAccept');
    vsConfig.update(buttonType, enabled, vscode.ConfigurationTarget.Global);
  }

  /**
   * 啟用所有按鈕類型
   */
  enableAll(): void {
    Object.keys(this.config).forEach(key => {
      this.setButtonEnabled(key as keyof ButtonConfig, true);
    });
  }

  /**
   * 停用所有按鈕類型
   */
  disableAll(): void {
    Object.keys(this.config).forEach(key => {
      this.setButtonEnabled(key as keyof ButtonConfig, false);
    });
  }

  /**
   * 記錄訊息
   */
  private log(message: string, level: 'info' | 'debug' | 'error' = 'info'): void {
    if (level === 'debug' && !this.debugMode) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] AutoAcceptService: ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'debug':
        console.debug(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  dispose(): void {
    this.stop();
  }
}
