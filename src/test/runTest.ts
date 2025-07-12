/**
 * VS Code 擴展測試運行器
 * 配置和執行整合測試
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */

import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // 擴展開發目錄路徑
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // 測試套件路徑
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // 下載並運行測試
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions', '--disable-gpu', '--no-sandbox'],
    });
  } catch (err) {
    console.error('Failed to run tests:', err);
    process.exit(1);
  }
}

main();
