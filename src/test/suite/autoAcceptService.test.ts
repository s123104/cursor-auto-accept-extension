/**
 * AutoAcceptService 單元測試套件
 * 測試自動接受服務的核心功能
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { AutoAcceptService } from '../../services/AutoAcceptService';
import { ButtonType, ExtensionConfig } from '../../types';

suite('AutoAcceptService Tests', () => {
  let service: AutoAcceptService;
  let sandbox: sinon.SinonSandbox;
  let mockContext: vscode.ExtensionContext;

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

    service = new AutoAcceptService(mockContext);
  });

  teardown(() => {
    sandbox.restore();
    if (service) {
      try {
        service.dispose();
      } catch (error) {
        // 忽略 dispose 過程中的錯誤，特別是 DisposableStore 相關錯誤
        console.warn('Warning during service disposal:', error);
      }
    }
  });

  suite('Constructor and Initialization', () => {
    test('應該正確初始化服務', () => {
      expect(service).to.be.instanceOf(AutoAcceptService);
    });

    test('應該有預設配置', () => {
      const status = service.getStatus();
      expect(status.config).to.have.property('enableAcceptAll');
      expect(status.config).to.have.property('enableAccept');
      expect(status.config).to.have.property('enableRun');
      expect(status.config).to.have.property('interval');
    });
  });

  suite('Configuration Management', () => {
    test('應該能夠更新配置', () => {
      const newConfig: Partial<ExtensionConfig> = {
        enableAcceptAll: false,
        interval: 5000,
      };

      service.updateConfiguration(newConfig);
      const status = service.getStatus();

      expect(status.config.enableAcceptAll).to.be.false;
      expect(status.config.interval).to.equal(5000);
    });

    test('應該能夠啟用特定按鈕類型', () => {
      service.enableOnly([ButtonType.ACCEPT, ButtonType.RUN]);
      const status = service.getStatus();

      expect(status.config.enableAccept).to.be.true;
      expect(status.config.enableRun).to.be.true;
      expect(status.config.enableAcceptAll).to.be.false;
    });

    test('應該能夠啟用所有按鈕類型', () => {
      service.disableAll();
      service.enableAll();
      const status = service.getStatus();

      expect(status.config.enableAcceptAll).to.be.true;
      expect(status.config.enableAccept).to.be.true;
      expect(status.config.enableRun).to.be.true;
    });

    test('應該能夠禁用所有按鈕類型', () => {
      service.disableAll();
      const status = service.getStatus();

      expect(status.config.enableAcceptAll).to.be.false;
      expect(status.config.enableAccept).to.be.false;
      expect(status.config.enableRun).to.be.false;
    });
  });

  suite('Service Lifecycle', () => {
    test('應該能夠啟動服務', async () => {
      await service.start();
      const status = service.getStatus();
      expect(status.isRunning).to.be.true;
    });

    test('應該能夠停止服務', async () => {
      await service.start();
      service.stop();
      const status = service.getStatus();
      expect(status.isRunning).to.be.false;
    });

    test('應該能夠重新啟動服務', async () => {
      await service.start();
      await service.restart();
      const status = service.getStatus();
      expect(status.isRunning).to.be.true;
    });

    test('應該能夠切換服務狀態', async () => {
      // 從停止狀態切換到啟動
      await service.toggle();
      let status = service.getStatus();
      expect(status.isRunning).to.be.true;

      // 從啟動狀態切換到停止
      await service.toggle();
      status = service.getStatus();
      expect(status.isRunning).to.be.false;
    });
  });

  suite('Button Type Management', () => {
    test('應該能夠設定個別按鈕狀態', () => {
      service.setButtonEnabled(ButtonType.ACCEPT, false);
      const status = service.getStatus();
      expect(status.config.enableAccept).to.be.false;
    });

    test('應該能夠處理無效的按鈕類型', () => {
      // 這應該不會拋出錯誤
      service.setButtonEnabled('invalid' as ButtonType, true);
      const status = service.getStatus();
      expect(status).to.exist;
    });
  });

  suite('Service Status', () => {
    test('應該返回完整的服務狀態', () => {
      const status = service.getStatus();

      expect(status).to.have.property('isRunning');
      expect(status).to.have.property('totalClicks');
      expect(status).to.have.property('config');
      expect(status).to.have.property('analytics');
      expect(status).to.have.property('roiStats');
    });

    test('應該追蹤總點擊次數', async () => {
      const initialStatus = service.getStatus();
      const initialClicks = initialStatus.totalClicks;

      // 模擬一些點擊活動
      await service.start();

      // 由於我們無法直接觸發點擊，我們只檢查結構
      const finalStatus = service.getStatus();
      expect(finalStatus.totalClicks).to.be.a('number');
      expect(finalStatus.totalClicks).to.be.greaterThanOrEqual(initialClicks);
    });
  });

  suite('Event Handling', () => {
    test('應該能夠監聽事件', done => {
      let eventReceived = false;

      service.onEvent(event => {
        if (eventReceived) return; // 防止多次調用 done()

        eventReceived = true;
        expect(event).to.have.property('event');
        expect(event).to.have.property('data');
        done();
      });

      // 啟動服務應該觸發事件
      service.start();
    });
  });

  suite('Resource Management', () => {
    test('應該能夠正確清理資源', () => {
      // 這應該不會拋出錯誤
      expect(() => service.dispose()).to.not.throw();
    });

    test('應該能夠多次清理資源', () => {
      service.dispose();
      // 第二次清理應該也不會拋出錯誤
      expect(() => service.dispose()).to.not.throw();
    });
  });

  suite('Error Handling', () => {
    test('應該處理配置更新錯誤', () => {
      // 傳入無效配置應該不會崩潰
      expect(() => {
        service.updateConfiguration({} as any);
      }).to.not.throw();
    });

    test('應該處理服務啟動錯誤', async () => {
      // 多次啟動應該不會出錯
      await service.start();
      await service.start();

      const status = service.getStatus();
      expect(status.isRunning).to.be.true;
    });
  });

  suite('Integration Tests', () => {
    test('應該能夠處理複雜的配置變更', () => {
      // 複雜的配置變更場景
      service.enableAll();
      service.setButtonEnabled(ButtonType.ACCEPT, false);
      service.updateConfiguration({ interval: 1000 });

      const status = service.getStatus();
      expect(status.config.enableAccept).to.be.false;
      expect(status.config.enableRun).to.be.true;
      expect(status.config.interval).to.equal(1000);
    });

    test('應該能夠處理服務生命週期', async () => {
      // 完整的生命週期測試
      await service.start();
      service.updateConfiguration({ enableAcceptAll: false });
      await service.restart();
      service.stop();

      const status = service.getStatus();
      expect(status.isRunning).to.be.false;
      expect(status.config.enableAcceptAll).to.be.false;
    });
  });
});
