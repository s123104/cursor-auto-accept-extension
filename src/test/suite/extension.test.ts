/**
 * 📦 模組：擴展主要功能測試
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：測試擴展的核心功能和命令
 */

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('s123104.cursor-auto-accept-extension');
    assert.ok(extension, '擴展應該存在');
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('s123104.cursor-auto-accept-extension');
    assert.ok(extension, '擴展應該存在');

    await extension.activate();
    assert.ok(extension.isActive, '擴展應該被激活');
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);

    const expectedCommands = [
      'cursorAutoAccept.toggle',
      'cursorAutoAccept.showPanel',
      'cursorAutoAccept.showAnalytics',
      'cursorAutoAccept.exportData',
      'cursorAutoAccept.clearData',
    ];

    expectedCommands.forEach(command => {
      assert.ok(commands.includes(command), `命令 ${command} 應該被註冊`);
    });
  });

  test('Toggle command should work', async () => {
    // 執行切換命令
    try {
      await vscode.commands.executeCommand('cursorAutoAccept.toggle');
      assert.ok(true, '切換命令應該成功執行');
    } catch (error) {
      assert.fail(`切換命令執行失敗: ${error}`);
    }
  });

  test('Show panel command should work', async () => {
    try {
      await vscode.commands.executeCommand('cursorAutoAccept.showPanel');
      assert.ok(true, '顯示面板命令應該成功執行');
    } catch (error) {
      assert.fail(`顯示面板命令執行失敗: ${error}`);
    }
  });

  test('Configuration should be accessible', () => {
    const config = vscode.workspace.getConfiguration('cursorAutoAccept');

    // 測試預設配置值
    assert.strictEqual(config.get('enabled'), true, '預設應該啟用自動接受功能');

    assert.strictEqual(config.get('interval'), 2000, '預設檢查間隔應該是 2000ms');
  });

  test('Cursor compatibility warning should be displayed', async () => {
    // 這個測試檢查是否有適當的 Cursor 相容性警告
    const extension = vscode.extensions.getExtension('s123104.cursor-auto-accept-extension');
    assert.ok(extension, '擴展應該存在');

    const packageJSON = extension.packageJSON;
    assert.ok(
      packageJSON.description.includes('Cursor 更新可能導致功能失效'),
      '描述應該包含 Cursor 相容性警告'
    );
  });
});
