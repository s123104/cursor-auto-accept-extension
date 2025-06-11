/**
 * 📦 模組：測試運行器
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：VS Code 擴展測試運行器
 */

import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // 擴展開發路徑
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // 測試套件路徑
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // 下載 VS Code，解壓縮並運行整合測試
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions', // 禁用其他擴展以避免干擾
        '--new-window',
      ],
    });

    console.log('✅ 所有測試通過');
  } catch (err) {
    console.error('❌ 測試失敗');
    console.error(err);
    process.exit(1);
  }
}

main();
