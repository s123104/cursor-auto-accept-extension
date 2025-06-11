#!/usr/bin/env node
/**
 * 📦 模組：跨平台清理腳本
 * 🕒 最後更新：2025-06-11T14:54:36+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：清理建置產出和快取檔案
 */

const fs = require('fs');
const path = require('path');

const foldersToClean = ['dist', 'out', 'coverage', '.nyc_output'];
const extensionsToClean = ['.vsix', '.tsbuildinfo'];

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`🗑️  刪除資料夾: ${folderPath}`);
  }
}

function deleteFilesByExtension(dir, extensions) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const ext = path.extname(file);

      if (extensions.includes(ext)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  刪除檔案: ${filePath}`);
      }
    });
  } catch (error) {
    // 忽略錯誤，可能是目錄不存在
  }
}

console.log('🧹 開始清理...');

// 清理資料夾
foldersToClean.forEach(deleteFolder);

// 清理特定副檔名的檔案
deleteFilesByExtension('.', extensionsToClean);

console.log('✅ 清理完成！');
