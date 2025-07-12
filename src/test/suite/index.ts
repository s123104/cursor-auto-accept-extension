/**
 * 測試套件索引文件
 * 配置 Mocha 測試框架並載入所有測試文件
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */

import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

/**
 * 測試套件索引文件
 * 配置 Mocha 測試框架並載入所有測試文件
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */
export function run(): Promise<void> {
  // 創建 Mocha 實例
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000,
    reporter: 'spec',
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    // 使用 glob 查找所有測試文件（callback 形式）
    glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      // files 型別為 string[]
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));
      try {
        // 運行測試
        mocha.run((failures: number) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}
