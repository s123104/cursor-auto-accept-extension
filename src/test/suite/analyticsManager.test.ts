import { expect } from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { AnalyticsManager } from '../../managers/AnalyticsManager';
import { ButtonType, FileInfo } from '../../types';

suite('AnalyticsManager Tests', () => {
  let manager: AnalyticsManager;
  let mockContext: vscode.ExtensionContext;
  let sandbox: sinon.SinonSandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    // Mock VS Code ExtensionContext
    mockContext = {
      subscriptions: [],
      workspaceState: {
        get: sandbox.stub().returns(undefined),
        update: sandbox.stub().resolves(),
        keys: sandbox.stub().returns([]),
      },
      globalState: {
        get: sandbox.stub().returns(undefined),
        update: sandbox.stub().resolves(),
        keys: sandbox.stub().returns([]),
        setKeysForSync: sandbox.stub(),
      },
      extensionPath: '/test/path',
      storagePath: '/test/storage',
      globalStoragePath: '/test/global',
      logPath: '/test/logs',
      extensionUri: vscode.Uri.file('/test/path'),
      environmentVariableCollection: {} as any,
      asAbsolutePath: sandbox.stub().returns('/test/absolute'),
      storageUri: vscode.Uri.file('/test/storage'),
      globalStorageUri: vscode.Uri.file('/test/global'),
      logUri: vscode.Uri.file('/test/logs'),
      extensionMode: vscode.ExtensionMode.Test,
      secrets: {} as any,
      extension: {} as any,
      languageModelAccessInformation: {
        onDidChange: sandbox.stub(),
        canSendRequest: sandbox.stub().returns(true),
      },
    };

    manager = new AnalyticsManager(mockContext);
  });

  teardown(() => {
    sandbox.restore();
    if (manager) {
      try {
        manager.dispose();
      } catch (error) {
        // 忽略 dispose 過程中的錯誤，特別是 channel 關閉錯誤
        console.warn('Warning during manager disposal:', error);
      }
    }
  });

  suite('Initialization', () => {
    test('應該正確初始化分析管理器', () => {
      expect(manager).to.be.instanceOf(AnalyticsManager);
    });

    test('應該有預設的分析數據結構', () => {
      const data = manager.getAnalyticsData();
      expect(data).to.have.property('totalClicks');
      expect(data).to.have.property('successfulClicks');
      expect(data).to.have.property('failedClicks');
      expect(data).to.have.property('buttonTypeStats');
      expect(data.totalClicks).to.equal(0);
    });
  });

  suite('Click Recording', () => {
    test('應該記錄基本點擊事件', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);

      const data = manager.getAnalyticsData();
      expect(data.totalClicks).to.equal(1);
      expect(data.successfulClicks).to.equal(1);
      expect(data.buttonTypeStats[ButtonType.ACCEPT].clicks).to.equal(1);
    });

    test('應該記錄失敗的點擊事件', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, false, 1000);

      const data = manager.getAnalyticsData();
      expect(data.totalClicks).to.equal(1);
      expect(data.successfulClicks).to.equal(0);
      expect(data.failedClicks).to.equal(1);
      expect(data.buttonTypeStats[ButtonType.ACCEPT].clicks).to.equal(1);
      expect(data.buttonTypeStats[ButtonType.ACCEPT].failures).to.equal(1);
    });

    test('應該累積多次點擊統計', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1200);
      manager.recordClick(ButtonType.ACCEPT_ALL, fileInfo, true, 800);

      const data = manager.getAnalyticsData();
      expect(data.totalClicks).to.equal(3);
      expect(data.successfulClicks).to.equal(3);
      expect(data.buttonTypeStats[ButtonType.ACCEPT].clicks).to.equal(2);
      expect(data.buttonTypeStats[ButtonType.ACCEPT_ALL].clicks).to.equal(1);
    });
  });

  suite('ROI Calculations', () => {
    test('應該計算總節省時間', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT_ALL, fileInfo, true, 2000);

      const roiData = manager.calculateROI();
      expect(roiData.totalTimeSaved).to.be.greaterThan(0);
    });

    test('應該計算生產力提升百分比', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);

      const roiData = manager.calculateROI();
      expect(roiData.productivityGain).to.be.greaterThanOrEqual(0);
    });

    test('應該處理零點擊的情況', () => {
      const roiData = manager.calculateROI();
      expect(roiData.totalTimeSaved).to.equal(0);
      expect(roiData.productivityGain).to.equal(0);
    });
  });

  suite('Performance Metrics', () => {
    test('應該計算成功率', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1200);
      manager.recordClick(ButtonType.ACCEPT, fileInfo, false, 800);

      const metrics = manager.getPerformanceMetrics();
      expect(metrics.successRate).to.be.approximately(66.67, 0.1);
    });

    test('應該計算平均點擊時間', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1200);

      const metrics = manager.getPerformanceMetrics();
      expect(metrics.averageClickTime).to.equal(1100);
    });

    test('應該追蹤按鈕類型的吞吐量', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT_ALL, fileInfo, true, 2000);

      const metrics = manager.getPerformanceMetrics();
      expect(metrics.throughput).to.be.greaterThanOrEqual(0);
    });
  });

  suite('Report Generation', () => {
    test('應該生成完整的報告', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
      manager.recordClick(ButtonType.ACCEPT_ALL, fileInfo, true, 2000);

      const report = manager.generateReport();
      expect(report).to.have.property('summary');
      expect(report).to.have.property('performance');
      expect(report).to.have.property('roi');
      expect(report).to.have.property('buttonTypeStats');
      expect(report).to.have.property('generatedAt');
      expect(report.summary.totalClicks).to.equal(2);
    });
  });

  suite('Event Handling', () => {
    test('應該發送事件當記錄點擊時', done => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.onEvent(event => {
        expect(event.type).to.equal('click-recorded');
        expect(event.data.buttonType).to.equal(ButtonType.ACCEPT);
        done();
      });

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);
    });
  });

  suite('Data Reset', () => {
    test('應該重置所有分析數據', () => {
      const fileInfo: FileInfo = {
        filename: 'test.ts',
        addedLines: 10,
        deletedLines: 5,
        timestamp: new Date(),
      };

      manager.recordClick(ButtonType.ACCEPT, fileInfo, true, 1000);

      let data = manager.getAnalyticsData();
      expect(data.totalClicks).to.equal(1);

      manager.resetAnalytics();

      data = manager.getAnalyticsData();
      expect(data.totalClicks).to.equal(0);
    });
  });
});
