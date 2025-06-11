/**
 * 📦 模組：分析資料管理器
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：管理檔案分析、ROI 追蹤和資料持久化
 */

import * as vscode from 'vscode';

export interface FileAnalytics {
  acceptCount: number;
  lastAccepted: Date;
  totalAdded: number;
  totalDeleted: number;
}

export interface SessionData {
  filename: string;
  addedLines: number;
  deletedLines: number;
  buttonType: string;
  timestamp: Date;
}

export interface ROIData {
  totalTimeSaved: number;
  codeGenerationSessions: any[];
  averageCompleteWorkflow: number;
  averageAutomatedWorkflow: number;
  workflowSessions: any[];
}

export interface AnalyticsData {
  files: Map<string, FileAnalytics>;
  sessions: SessionData[];
  totalAccepts: number;
  sessionStart: Date;
  roiTracking: ROIData;
}

export class AnalyticsManager implements vscode.Disposable {
  private analytics: AnalyticsData;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.analytics = {
      files: new Map(),
      sessions: [],
      totalAccepts: 0,
      sessionStart: new Date(),
      roiTracking: {
        totalTimeSaved: 0,
        codeGenerationSessions: [],
        averageCompleteWorkflow: 30000,
        averageAutomatedWorkflow: 100,
        workflowSessions: [],
      },
    };

    this.loadFromStorage();
  }

  /**
   * 記錄檔案接受事件
   */
  trackFileAcceptance(
    filename: string,
    buttonType: string,
    addedLines: number = 0,
    deletedLines: number = 0
  ): void {
    // 更新檔案統計
    const fileStats = this.analytics.files.get(filename) || {
      acceptCount: 0,
      lastAccepted: new Date(),
      totalAdded: 0,
      totalDeleted: 0,
    };

    fileStats.acceptCount++;
    fileStats.lastAccepted = new Date();
    fileStats.totalAdded += addedLines;
    fileStats.totalDeleted += deletedLines;

    this.analytics.files.set(filename, fileStats);

    // 記錄會話資料
    this.analytics.sessions.push({
      filename,
      addedLines,
      deletedLines,
      buttonType,
      timestamp: new Date(),
    });

    this.analytics.totalAccepts++;

    // 計算節省時間
    this.calculateTimeSaved();

    // 儲存到持久化存儲
    this.saveToStorage();
  }

  /**
   * 計算節省的時間
   */
  private calculateTimeSaved(): void {
    const timeSaved =
      this.analytics.roiTracking.averageCompleteWorkflow -
      this.analytics.roiTracking.averageAutomatedWorkflow;
    this.analytics.roiTracking.totalTimeSaved += timeSaved;
  }

  /**
   * 獲取統計資料
   */
  getAnalytics(): AnalyticsData {
    return { ...this.analytics };
  }

  /**
   * 匯出分析資料
   */
  exportData(): any {
    return {
      analytics: {
        files: Array.from(this.analytics.files.entries()),
        sessions: this.analytics.sessions,
        totalAccepts: this.analytics.totalAccepts,
        sessionStart: this.analytics.sessionStart,
      },
      roiTracking: this.analytics.roiTracking,
      exportedAt: new Date(),
    };
  }

  /**
   * 清除所有資料
   */
  clearAllData(): void {
    this.analytics.files.clear();
    this.analytics.sessions = [];
    this.analytics.totalAccepts = 0;
    this.analytics.sessionStart = new Date();
    this.analytics.roiTracking.totalTimeSaved = 0;
    this.analytics.roiTracking.codeGenerationSessions = [];
    this.analytics.roiTracking.workflowSessions = [];

    this.context.globalState.update('cursor-auto-accept-data', undefined);
  }

  /**
   * 儲存資料到 VS Code 持久化存儲
   */
  private saveToStorage(): void {
    const data = {
      files: Array.from(this.analytics.files.entries()),
      sessions: this.analytics.sessions.slice(-100), // 只保留最近 100 次會話
      totalAccepts: this.analytics.totalAccepts,
      sessionStart: this.analytics.sessionStart,
      roiTracking: this.analytics.roiTracking,
      savedAt: new Date(),
    };

    this.context.globalState.update('cursor-auto-accept-data', data);
  }

  /**
   * 從 VS Code 持久化存儲載入資料
   */
  private loadFromStorage(): void {
    const saved = this.context.globalState.get<any>('cursor-auto-accept-data');

    if (saved) {
      try {
        this.analytics.files = new Map(saved.files || []);
        this.analytics.sessions = saved.sessions || [];
        this.analytics.totalAccepts = saved.totalAccepts || 0;
        this.analytics.sessionStart = saved.sessionStart
          ? new Date(saved.sessionStart)
          : new Date();

        if (saved.roiTracking) {
          this.analytics.roiTracking = {
            ...this.analytics.roiTracking,
            ...saved.roiTracking,
          };
        }

        console.log('Analytics data loaded from storage');
      } catch (error) {
        console.warn('Failed to load analytics data:', error);
      }
    }
  }

  /**
   * 格式化時間長度
   */
  formatTimeDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}天 ${hours % 24}小時 ${minutes % 60}分鐘`;
    } else if (hours > 0) {
      return `${hours}小時 ${minutes % 60}分鐘`;
    } else if (minutes > 0) {
      return `${minutes}分鐘 ${seconds % 60}秒`;
    } else {
      return `${seconds}秒`;
    }
  }

  dispose(): void {
    this.saveToStorage();
  }
}
