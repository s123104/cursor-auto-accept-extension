/**
 * 📦 模組：自動接受服務測試
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：測試自動接受服務的核心功能
 */

import * as assert from 'assert';
import { AutoAcceptService } from '../../autoAcceptService';
import { AnalyticsManager } from '../../analytics';

// 模擬 VS Code 環境
const mockVscode = {
  workspace: {
    getConfiguration: (section: string) => ({
      get: (key: string, defaultValue?: any) => {
        const configs: { [key: string]: any } = {
          interval: 2000,
          debugMode: false,
          enableAcceptAll: true,
          enableAccept: true,
          enableRun: true,
          enableRunCommand: true,
          enableApply: true,
          enableExecute: true,
          enableResume: true,
        };
        return configs[key] !== undefined ? configs[key] : defaultValue;
      },
      update: () => Promise.resolve(),
    }),
  },
  commands: {
    executeCommand: () => Promise.resolve(),
  },
  window: {
    activeTextEditor: null,
  },
  ConfigurationTarget: {
    Global: 1,
  },
};

// 為測試設置全域模擬
(global as any).vscode = mockVscode;

suite('AutoAccept Service Test Suite', () => {
  let autoAcceptService: AutoAcceptService;
  let analyticsManager: AnalyticsManager;

  setup(() => {
    const mockContext = {
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve(),
        keys: () => [],
      },
      subscriptions: [],
    } as any;

    analyticsManager = new AnalyticsManager(mockContext);
    autoAcceptService = new AutoAcceptService(analyticsManager);
  });

  teardown(() => {
    autoAcceptService.dispose();
    analyticsManager.dispose();
  });

  test('AutoAccept Service should initialize', () => {
    assert.ok(autoAcceptService, '自動接受服務應該被創建');
  });

  test('Should start and stop service', () => {
    // 初始狀態應該是停止的
    let status = autoAcceptService.getStatus();
    assert.strictEqual(status.isRunning, false, '初始狀態應該是停止的');

    // 啟動服務
    autoAcceptService.start();
    status = autoAcceptService.getStatus();
    assert.strictEqual(status.isRunning, true, '啟動後服務應該正在運行');

    // 停止服務
    autoAcceptService.stop();
    status = autoAcceptService.getStatus();
    assert.strictEqual(status.isRunning, false, '停止後服務應該不再運行');
  });

  test('Should toggle service state', () => {
    // 初始狀態是停止的
    let status = autoAcceptService.getStatus();
    assert.strictEqual(status.isRunning, false, '初始狀態應該是停止的');

    // 第一次切換應該啟動
    let isRunning = autoAcceptService.toggle();
    assert.strictEqual(isRunning, true, '第一次切換應該啟動服務');

    // 第二次切換應該停止
    isRunning = autoAcceptService.toggle();
    assert.strictEqual(isRunning, false, '第二次切換應該停止服務');
  });

  test('Should configure button types', () => {
    const status = autoAcceptService.getStatus();

    // 檢查預設配置
    assert.strictEqual(status.config.enableAcceptAll, true, 'Accept All 應該預設啟用');
    assert.strictEqual(status.config.enableAccept, true, 'Accept 應該預設啟用');
    assert.strictEqual(status.config.enableRun, true, 'Run 應該預設啟用');

    // 測試設置特定按鈕類型
    autoAcceptService.setButtonEnabled('enableAcceptAll', false);
    const updatedStatus = autoAcceptService.getStatus();
    assert.strictEqual(updatedStatus.config.enableAcceptAll, false, 'Accept All 應該被停用');
  });

  test('Should enable all button types', () => {
    // 先停用一些按鈕
    autoAcceptService.setButtonEnabled('enableAcceptAll', false);
    autoAcceptService.setButtonEnabled('enableAccept', false);

    // 啟用所有按鈕
    autoAcceptService.enableAll();

    const status = autoAcceptService.getStatus();
    assert.strictEqual(status.config.enableAcceptAll, true, 'Accept All 應該被啟用');
    assert.strictEqual(status.config.enableAccept, true, 'Accept 應該被啟用');
    assert.strictEqual(status.config.enableRun, true, 'Run 應該被啟用');
  });

  test('Should disable all button types', () => {
    // 停用所有按鈕
    autoAcceptService.disableAll();

    const status = autoAcceptService.getStatus();
    assert.strictEqual(status.config.enableAcceptAll, false, 'Accept All 應該被停用');
    assert.strictEqual(status.config.enableAccept, false, 'Accept 應該被停用');
    assert.strictEqual(status.config.enableRun, false, 'Run 應該被停用');
  });

  test('Should update configuration from VS Code settings', () => {
    // 這個測試驗證配置更新功能
    autoAcceptService.updateConfiguration();

    const status = autoAcceptService.getStatus();
    assert.strictEqual(status.interval, 2000, '間隔時間應該從配置中讀取');
  });

  test('Should handle service restart when running', () => {
    // 啟動服務
    autoAcceptService.start();
    assert.strictEqual(autoAcceptService.getStatus().isRunning, true, '服務應該正在運行');

    // 更新配置（應該重新啟動服務）
    autoAcceptService.updateConfiguration();

    // 服務應該仍然在運行
    assert.strictEqual(autoAcceptService.getStatus().isRunning, true, '配置更新後服務應該仍在運行');
  });

  test('Should get correct status information', () => {
    const status = autoAcceptService.getStatus();

    assert.ok(typeof status.isRunning === 'boolean', 'isRunning 應該是布林值');
    assert.ok(typeof status.interval === 'number', 'interval 應該是數字');
    assert.ok(typeof status.config === 'object', 'config 應該是物件');
    assert.ok(status.config.hasOwnProperty('enableAcceptAll'), 'config 應該包含 enableAcceptAll');
  });
});
