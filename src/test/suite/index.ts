/**
 * 📦 模組：測試套件索引
 * 🕒 最後更新：2025-06-11T13:16:37+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：整合所有測試套件
 */

import * as path from 'path';
import * as fs from 'fs';

// 使用動態導入來處理 Mocha
export async function run(): Promise<void> {
  // 動態導入 Mocha
  const { default: Mocha } = await import('mocha');

  // 創建 Mocha 測試實例
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000,
  });

  const testsRoot = path.resolve(__dirname, '..');

  try {
    // 手動查找測試文件
    const findTestFiles = (dir: string): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findTestFiles(fullPath));
        } else if (item.endsWith('.test.js')) {
          files.push(fullPath);
        }
      }

      return files;
    };

    const testFiles = findTestFiles(testsRoot);

    // 添加檔案到測試套件
    testFiles.forEach((file: string) => mocha.addFile(file));

    // 運行 Mocha 測試
    return new Promise<void>((resolve, reject) => {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
