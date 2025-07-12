// Constants and configuration for Cursor Auto Accept Extension v2.2.0

import { SelectorConfig, ButtonPattern, ButtonType } from '../types';

/**
 * 彈性選擇器配置 - 降低頁面結構耦合
 */
export const SELECTORS: SelectorConfig = {
  // 輸入框選擇器（多重備選）
  inputBox: [
    'div.full-input-box',
    '.composer-input-container',
    '[data-testid="composer-input"]',
    '.input-container',
  ],

  // 按鈕容器選擇器
  buttonContainers: [
    '.composer-code-block-container',
    '.composer-tool-former-message',
    '.composer-diff-block',
    '[class*="code-block"]',
    '[class*="diff-container"]',
  ],

  // 檔名選擇器
  filename: [
    '.composer-code-block-filename span[style*="direction: ltr"]',
    '.composer-code-block-filename span',
    '.composer-code-block-filename',
    '[class*="filename"]',
    '[data-filename]',
  ],

  // 狀態選擇器
  status: [
    '.composer-code-block-status span',
    'span[style*="color"]',
    '[class*="status"]',
    '[class*="diff-stat"]',
  ],

  // Resume 連結選擇器
  resumeLinks: [
    '.markdown-link[data-link="command:composer.resumeCurrentChat"]',
    '.markdown-link[data-link*="resume"]',
    'span.markdown-link[data-link="command:composer.resumeCurrentChat"]',
    '[data-command*="resume"]',
  ],

  // Resume 按鈕選擇器（彈出式下拉選單）
  resumeButtons: [
    'div[class*="anysphere-secondary-button"]',
    'div[class*="anysphere-text-button"]',
    '.markdown-link[data-link*="resume"]',
  ],

  // Try Again 按鈕選擇器（彈出式下拉選單）
  tryAgainButtons: [
    'div[class*="anysphere-secondary-button"]',
    'div[class*="anysphere-text-button"]',
    '.anysphere-secondary-button',
    '.anysphere-text-button',
    'div.anysphere-secondary-button',
    'div.anysphere-text-button',
  ],

  // 下拉選單容器選擇器
  dropdownContainers: [
    '.bg-dropdown-background',
    '[class*="dropdown"]',
    '[class*="popup"]',
    '[style*="box-shadow"]',
  ],

  // Move to Background 按鈕選擇器
  moveToBackgroundButtons: [
    'div:contains("Move to background")',
    'span:contains("Move to background")',
    '[class*="anysphere-text-button"]:contains("Move to background")',
    '.flex.flex-nowrap.items-center.justify-center span:contains("Move to background")',
    '[style*="font-size: 11px"]:contains("Move to background")',
  ],

  // 終端容器選擇器
  terminalContainers: [
    '.terminal-instance-component',
    '.xterm-screen',
    '.terminal-wrapper',
    '.composer-terminal-static-render',
    '[class*="terminal"]',
    '.terminal-widget-container',
  ],
};

/**
 * 按鈕模式配置 - 支援語義化識別
 */
export const BUTTON_PATTERNS: Record<ButtonType, ButtonPattern> = {
  [ButtonType.ACCEPT_ALL]: {
    keywords: ['accept all', 'accept-all', 'acceptall'],
    priority: 1,
    extraTime: 5000,
  },
  [ButtonType.ACCEPT]: {
    keywords: ['accept'],
    priority: 2,
    extraTime: 0,
  },
  [ButtonType.RUN_COMMAND]: {
    keywords: ['run command', 'run-command'],
    priority: 3,
    extraTime: 2000,
  },
  [ButtonType.RUN]: {
    keywords: ['run'],
    priority: 4,
    extraTime: 2000,
  },
  [ButtonType.APPLY]: {
    keywords: ['apply'],
    priority: 5,
    extraTime: 0,
  },
  [ButtonType.EXECUTE]: {
    keywords: ['execute'],
    priority: 6,
    extraTime: 2000,
  },
  [ButtonType.RESUME]: {
    keywords: ['resume', 'continue'],
    priority: 7,
    extraTime: 3000,
  },
  [ButtonType.TRY_AGAIN]: {
    keywords: ['try again', 'try-again', 'tryagain', 'retry', '重新嘗試', '再試一次'],
    priority: 3,
    extraTime: 3000,
  },
  [ButtonType.MOVE_TO_BACKGROUND]: {
    keywords: [
      'move to background',
      'move-to-background',
      'movetobackground',
      '移至背景',
      '移到背景',
    ],
    priority: 8,
    extraTime: 1000,
  },
};

/**
 * 預設配置值
 */
export const DEFAULT_CONFIG = {
  enableAcceptAll: true,
  enableAccept: true,
  enableRun: true,
  enableRunCommand: true,
  enableApply: true,
  enableExecute: true,
  enableResume: true,
  enableTryAgain: false, // 暫時禁用 - 偵測到功能異常，等待修正
  enableMoveToBackground: false, // 預設關閉，需要用戶手動啟用
  interval: 2000,
  debugMode: false,
  averageCompleteWorkflow: 30000, // 30 秒預設手動工作流程時間
  averageAutomatedWorkflow: 100, // 100ms 預設自動化時間
};

/**
 * 快取超時設定
 */
export const CACHE_TIMEOUT = 5000; // 5秒快取

/**
 * 防抖延遲設定
 */
export const DEBOUNCE_DELAY = 300; // 300ms 防抖

/**
 * 點擊間隔設定
 */
export const MIN_CLICK_INTERVAL = 1000; // 最小點擊間隔 1 秒
export const CLICK_COOLDOWN_PERIOD = 3000; // 同一按鈕冷卻期 3 秒
export const MAX_RETRY_DURATION = 60000; // 1分鐘後停止重試
export const CLICK_VALIDATION_TIMEOUT = 2000; // 點擊後2秒驗證是否有效

/**
 * 背景移動器預設配置
 */
export const DEFAULT_BACKGROUND_MOVER_CONFIG = {
  enabled: false,
  checkInterval: 30000, // 30秒檢查間隔
  debounceDelay: 2000, // 2秒防抖延遲
  maxIdleTime: 30000, // 30秒最大閒置時間
  requireBothButtons: true, // 需要兩個按鈕同時存在
};

/**
 * 儲存鍵值
 */
export const STORAGE_KEYS = {
  ANALYTICS_DATA: 'cursor-auto-accept-v2-analytics',
  CONFIG: 'cursor-auto-accept-v2-config',
  BACKGROUND_MOVER_CONFIG: 'cursor-auto-accept-v2-background-mover',
  ROI_METRICS: 'cursor-auto-accept-v2-roi-metrics',
};

/**
 * 擴展命令
 */
export const COMMANDS = {
  TOGGLE: 'cursorAutoAccept.toggle',
  START: 'cursorAutoAccept.start',
  STOP: 'cursorAutoAccept.stop',
  SHOW_CONTROL_PANEL: 'cursorAutoAccept.showControlPanel',
  SHOW_ANALYTICS: 'cursorAutoAccept.showAnalytics',
  EXPORT_ANALYTICS: 'cursorAutoAccept.exportAnalytics',
  CLEAR_ANALYTICS: 'cursorAutoAccept.clearAnalytics',
  CONFIGURE: 'cursorAutoAccept.configure',
  DEBUG_SEARCH: 'cursorAutoAccept.debugSearch',
  ENABLE_DEBUG: 'cursorAutoAccept.enableDebug',
  DISABLE_DEBUG: 'cursorAutoAccept.disableDebug',
};

/**
 * 事件名稱
 */
export const EVENTS = {
  DOM_CHANGED: 'dom-changed',
  BUTTON_CLICKED: 'button-clicked',
  CONFIG_UPDATED: 'config-updated',
  ANALYTICS_UPDATED: 'analytics-updated',
  MOVE_TO_BACKGROUND_CLICKED: 'move-to-background-clicked',
  SERVICE_STARTED: 'service-started',
  SERVICE_STOPPED: 'service-stopped',
};

/**
 * Webview 類型
 */
export const WEBVIEW_TYPES = {
  CONTROL_PANEL: 'cursorAutoAccept.controlPanel',
  ANALYTICS: 'cursorAutoAccept.analytics',
};

/**
 * 版本資訊
 */
export const VERSION = '2.2.0';
export const EXTENSION_NAME = 'cursor-auto-accept';
export const EXTENSION_DISPLAY_NAME = 'Cursor Auto Accept';
export const EXTENSION_DESCRIPTION = 'Automatically accept code suggestions in Cursor IDE';

/**
 * ROI 計算常數
 */
export const ROI_CALCULATION_CONSTANTS = {
  // 各按鈕類型節省時間 (毫秒)
  ACCEPT_TIME_SAVED: 2000,
  ACCEPT_ALL_TIME_SAVED: 3000,
  RUN_TIME_SAVED: 1500,
  RUN_COMMAND_TIME_SAVED: 2500,
  APPLY_TIME_SAVED: 1800,
  EXECUTE_TIME_SAVED: 2200,
  RESUME_TIME_SAVED: 1000,
  TRY_AGAIN_TIME_SAVED: 1200,
  MOVE_TO_BACKGROUND_TIME_SAVED: 800,
  DEFAULT_TIME_SAVED: 1500,

  // 開發者時薪 (USD)
  DEVELOPER_HOURLY_RATE: 75,

  // 計算係數
  PRODUCTIVITY_COEFFICIENT: 1.2,
  SATISFACTION_WEIGHT: 0.7,
  FREQUENCY_WEIGHT: 0.3,
};
