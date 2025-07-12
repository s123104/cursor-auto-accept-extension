// Core type definitions for Cursor Auto Accept Extension v2.2.0

import * as vscode from 'vscode';

/**
 * 按鈕類型枚舉
 */
export enum ButtonType {
  ACCEPT_ALL = 'acceptAll',
  ACCEPT = 'accept',
  RUN_COMMAND = 'runCommand',
  RUN = 'run',
  APPLY = 'apply',
  EXECUTE = 'execute',
  RESUME = 'resume',
  TRY_AGAIN = 'tryAgain',
  MOVE_TO_BACKGROUND = 'moveToBackground',
}

/**
 * 按鈕模式配置
 */
export interface ButtonPattern {
  keywords: string[];
  priority: number;
  extraTime: number;
}

/**
 * 選擇器配置
 */
export interface SelectorConfig {
  inputBox: string[];
  buttonContainers: string[];
  filename: string[];
  status: string[];
  resumeLinks: string[];
  resumeButtons: string[];
  tryAgainButtons: string[];
  dropdownContainers: string[];
  moveToBackgroundButtons: string[];
  terminalContainers: string[];
}

/**
 * 擴展配置
 */
export interface ExtensionConfig {
  enableAcceptAll: boolean;
  enableAccept: boolean;
  enableRun: boolean;
  enableRunCommand: boolean;
  enableApply: boolean;
  enableExecute: boolean;
  enableResume: boolean;
  enableTryAgain: boolean;
  enableMoveToBackground: boolean;
  interval: number;
  debugMode: boolean;
  averageCompleteWorkflow: number;
  averageAutomatedWorkflow: number;
}

/**
 * 檔案資訊
 */
export interface FileInfo {
  filename: string;
  addedLines: number;
  deletedLines: number;
  timestamp: Date;
}

/**
 * 分析資料
 */
export interface AnalyticsData {
  totalClicks: number;
  successfulClicks: number;
  failedClicks: number;
  totalTimeSaved: number;
  sessionsCount: number;
  buttonTypeStats: Record<string, ButtonTypeStats>;
  dailyStats: Record<string, DailyStats>;
  weeklyStats: Record<string, WeeklyStats>;
  monthlyStats: Record<string, MonthlyStats>;
  averageResponseTime: number;
  lastUpdated: number;
}

/**
 * 舊版分析資料 (保留向後相容)
 */
export interface LegacyAnalyticsData {
  files: Map<string, FileStats>;
  sessions: SessionRecord[];
  buttonTypes: Map<string, number>;
  totalAccepts: number;
  sessionStart: Date;
  roiData: ROIData;
}

/**
 * 檔案統計
 */
export interface FileStats {
  acceptCount: number;
  firstAccepted: Date;
  lastAccepted: Date;
  totalAdded: number;
  totalDeleted: number;
  buttonTypes: Map<string, number>;
  totalExecutionTime?: number;
  averageExecutionTime?: number;
}

/**
 * 會話記錄
 */
export interface SessionRecord {
  filename: string;
  addedLines: number;
  deletedLines: number;
  timestamp: Date;
  buttonType: string;
  timeSaved: number;
  actualExecutionTime: number;
}

/**
 * ROI 資料
 */
export interface ROIData {
  totalTimeSaved: number;
  workflowSessions: WorkflowSession[];
}

/**
 * 工作流程會話
 */
export interface WorkflowSession {
  timestamp: Date;
  buttonType: string;
  timeSaved: number;
  filename: string;
  actualExecutionTime: number;
}

/**
 * ROI 統計
 */
export interface ROIStatistics {
  totalMeasurements: number;
  manualCount: number;
  autoCount: number;
  averageManualTime: number;
  averageAutoTime: number;
  efficiency: number;
}

/**
 * 工作流程上下文
 */
export interface WorkflowContext {
  type: 'auto' | 'manual';
  buttonType?: string;
  [key: string]: any;
}

/**
 * 工作流程結果
 */
export interface WorkflowResult {
  success: boolean;
  fileInfo?: FileInfo;
  actualTime?: number;
  buttonType?: string;
  error?: string;
}

/**
 * 服務狀態
 */
export interface ServiceStatus {
  isRunning: boolean;
  totalClicks: number;
  config: ExtensionConfig;
  analytics: AnalyticsData;
  roiStats: ROIStatistics;
}

/**
 * Webview 訊息
 */
export interface WebviewMessage {
  command: string;
  data?: any;
}

/**
 * 背景移動器統計
 */
export interface BackgroundMoverStats {
  totalMoves: number;
  lastMoveTime: Date | null;
  averageIdleTime: number;
  contentChanges: number;
  buttonsDetected: number;
  skipDetections: number;
  isWatching: boolean;
  config: BackgroundMoverConfig;
  currentIdleTime: number;
  currentButtonsIdleTime: number;
  currentButtonsState: ButtonsState;
  shouldAttemptClick: boolean;
}

/**
 * 背景移動器配置
 */
export interface BackgroundMoverConfig {
  enabled: boolean;
  checkInterval: number;
  debounceDelay: number;
  maxIdleTime: number;
  requireBothButtons: boolean;
}

/**
 * 按鈕狀態
 */
export interface ButtonsState {
  hasMove: boolean;
  hasSkip: boolean;
  moveClickable: boolean;
  skipVisible: boolean;
}

/**
 * 事件資料
 */
export interface EventData {
  [key: string]: any;
}

/**
 * 日誌等級
 */
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

/**
 * ROI 指標
 */
export interface ROIMetrics {
  totalTimeSaved: number;
  estimatedCostSaving: number;
  productivityGain: number;
  automationEfficiency: number;
  userSatisfactionScore: number;
  adoptionRate: number;
  timeToValue: number;
  lastCalculated: number;
}

/**
 * 性能指標
 */
export interface PerformanceMetrics {
  averageClickTime: number;
  successRate: number;
  errorRate: number;
  throughput: number;
  peakUsageTime: string;
  mostUsedButtonType: ButtonType;
  sessionDuration: number;
  memoryUsage: number;
  cpuUsage: number;
}

/**
 * 分析事件
 */
export interface AnalyticsEvent {
  type: string;
  data: any;
}

/**
 * 報告資料
 */
export interface ReportData {
  summary: {
    totalClicks: number;
    successRate: number;
    totalTimeSaved: number;
    estimatedCostSaving: number;
    sessionsCount: number;
  };
  performance: PerformanceMetrics;
  roi: ROIMetrics;
  buttonTypeStats: Record<string, ButtonTypeStats>;
  dailyStats: Record<string, DailyStats>;
  trends: {
    clickTrend: number;
    successTrend: number;
    productivityTrend: number;
  };
  recommendations: string[];
  generatedAt: number;
}

/**
 * 按鈕類型統計
 */
export interface ButtonTypeStats {
  clicks: number;
  successes: number;
  failures: number;
  totalTime: number;
  averageTime: number;
}

/**
 * 每日統計
 */
export interface DailyStats {
  clicks: number;
  successes: number;
  failures: number;
  timeSaved: number;
}

/**
 * 每週統計
 */
export interface WeeklyStats {
  clicks: number;
  successes: number;
  failures: number;
  timeSaved: number;
}

/**
 * 每月統計
 */
export interface MonthlyStats {
  clicks: number;
  successes: number;
  failures: number;
  timeSaved: number;
}

/**
 * 可匯出的分析資料
 */
export interface ExportableAnalyticsData {
  files: Record<string, Omit<FileStats, 'buttonTypes'> & { buttonTypes: Record<string, number> }>;
  sessions: SessionRecord[];
  buttonTypes: Record<string, number>;
  totalAccepts: number;
  sessionStart: Date;
  roiData: ROIData;
  exportedAt: Date;
}

/**
 * VS Code 命令參數
 */
export interface CommandArgs {
  [key: string]: any;
}

/**
 * 擴展上下文介面
 */
export interface ExtensionContext extends vscode.ExtensionContext {
  // 擴展特定的上下文屬性可以在這裡添加
}
