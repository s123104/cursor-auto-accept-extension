/**
 * 📦 模組：分析功能測試
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：測試分析管理器的功能
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { AnalyticsManager } from '../../analytics';

suite('Analytics Manager Test Suite', () => {
  let analyticsManager: AnalyticsManager;
  let mockContext: vscode.ExtensionContext;

  setup(() => {
    // 創建模擬的擴展上下文
    mockContext = {
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve(),
        keys: () => [],
      },
      subscriptions: [],
    } as any;

    analyticsManager = new AnalyticsManager(mockContext);
  });

  teardown(() => {
    analyticsManager.dispose();
  });

  test('Analytics Manager should initialize', () => {
    assert.ok(analyticsManager, '分析管理器應該被創建');
  });

  test('Should track file acceptance', () => {
    const filename = 'test.ts';
    const buttonType = 'accept';
    const addedLines = 5;
    const deletedLines = 2;

    analyticsManager.trackFileAcceptance(filename, buttonType, addedLines, deletedLines);

    const analytics = analyticsManager.getAnalytics();
    assert.strictEqual(analytics.totalAccepts, 1, '總接受次數應該是 1');
    assert.ok(analytics.files.has(filename), '檔案應該被追蹤');

    const fileData = analytics.files.get(filename);
    assert.strictEqual(fileData?.acceptCount, 1, '檔案接受次數應該是 1');
    assert.strictEqual(fileData?.totalAdded, addedLines, '總增加行數應該正確');
    assert.strictEqual(fileData?.totalDeleted, deletedLines, '總刪除行數應該正確');
  });

  test('Should export data correctly', () => {
    analyticsManager.trackFileAcceptance('test1.ts', 'accept', 3, 1);
    analyticsManager.trackFileAcceptance('test2.js', 'apply', 7, 0);

    const exportData = analyticsManager.exportData();

    assert.ok(exportData.analytics, '匯出資料應該包含分析資料');
    assert.ok(exportData.roiTracking, '匯出資料應該包含 ROI 追蹤');
    assert.ok(exportData.exportedAt, '匯出資料應該包含匯出時間');
    assert.strictEqual(exportData.analytics.totalAccepts, 2, '匯出的總接受次數應該正確');
  });

  test('Should clear all data', () => {
    // 先添加一些資料
    analyticsManager.trackFileAcceptance('test.ts', 'accept', 5, 2);

    let analytics = analyticsManager.getAnalytics();
    assert.strictEqual(analytics.totalAccepts, 1, '清除前應該有資料');

    // 清除資料
    analyticsManager.clearAllData();

    analytics = analyticsManager.getAnalytics();
    assert.strictEqual(analytics.totalAccepts, 0, '清除後總接受次數應該是 0');
    assert.strictEqual(analytics.files.size, 0, '清除後檔案清單應該為空');
  });

  test('Should format time duration correctly', () => {
    const oneSecond = 1000;
    const oneMinute = 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    assert.strictEqual(analyticsManager.formatTimeDuration(oneSecond), '1秒', '1秒應該格式化正確');

    assert.strictEqual(
      analyticsManager.formatTimeDuration(oneMinute),
      '1分鐘 0秒',
      '1分鐘應該格式化正確'
    );

    assert.strictEqual(
      analyticsManager.formatTimeDuration(oneHour),
      '1小時 0分鐘',
      '1小時應該格式化正確'
    );

    assert.strictEqual(
      analyticsManager.formatTimeDuration(oneDay),
      '1天 0小時 0分鐘',
      '1天應該格式化正確'
    );
  });

  test('Should calculate time saved', () => {
    const initialTimeSaved = analyticsManager.getAnalytics().roiTracking.totalTimeSaved;

    analyticsManager.trackFileAcceptance('test.ts', 'accept', 1, 0);

    const finalTimeSaved = analyticsManager.getAnalytics().roiTracking.totalTimeSaved;
    assert.ok(finalTimeSaved > initialTimeSaved, '應該計算並累加節省的時間');
  });

  test('Should handle multiple file acceptances for same file', () => {
    const filename = 'repeated.ts';

    analyticsManager.trackFileAcceptance(filename, 'accept', 3, 1);
    analyticsManager.trackFileAcceptance(filename, 'apply', 2, 0);

    const analytics = analyticsManager.getAnalytics();
    const fileData = analytics.files.get(filename);

    assert.strictEqual(fileData?.acceptCount, 2, '同一檔案的接受次數應該累加');
    assert.strictEqual(fileData?.totalAdded, 5, '同一檔案的增加行數應該累加');
    assert.strictEqual(fileData?.totalDeleted, 1, '同一檔案的刪除行數應該累加');
  });
});
