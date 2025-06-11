/**
 * 📦 模組：esbuild 建置配置
 * 🕒 最後更新：2025-06-11T14:54:36+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v1.0.0
 * 📝 摘要：現代化 esbuild 配置，支援開發、生產和監視模式
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// 解析命令行參數
const args = process.argv.slice(2);
const isProduction = args.includes('--production');
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');

console.log(`🚀 建置模式: ${isProduction ? '生產' : isDev ? '開發' : '標準'}`);

// 基本配置
const baseConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !isProduction,
  minify: isProduction,
  keepNames: !isProduction,
  metafile: true,
  treeShaking: true,
  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
  },
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.js': 'js',
    '.jsx': 'jsx',
    '.json': 'json',
  },
  tsconfig: 'tsconfig.json',
  logLevel: 'info',
  color: true,
};

// 開發模式額外配置
if (isDev) {
  baseConfig.define['process.env.DEBUG'] = 'true';
  baseConfig.banner = {
    js: '// Development Build - ' + new Date().toISOString(),
  };
}

// 生產模式額外配置
if (isProduction) {
  baseConfig.drop = ['console', 'debugger'];
  baseConfig.legalComments = 'none';
  baseConfig.banner = {
    js: '// Production Build - Cursor Auto Accept Extension',
  };
}

// 自定義插件：建置統計
const buildStatsPlugin = {
  name: 'build-stats',
  setup(build) {
    let startTime;

    build.onStart(() => {
      startTime = Date.now();
      console.log('📦 開始建置...');
    });

    build.onEnd((result) => {
      const duration = Date.now() - startTime;
      const errors = result.errors.length;
      const warnings = result.warnings.length;

      console.log(`✅ 建置完成 (${duration}ms)`);
      
      if (errors > 0) {
        console.log(`❌ ${errors} 個錯誤`);
      }
      
      if (warnings > 0) {
        console.log(`⚠️  ${warnings} 個警告`);
      }

      // 如果有 metafile，輸出建置統計
      if (result.metafile) {
        const outfile = path.join(__dirname, '..', 'dist', 'build-meta.json');
        fs.writeFileSync(outfile, JSON.stringify(result.metafile, null, 2));
        
        // 計算 bundle 大小
        const bundleSize = fs.statSync(baseConfig.outfile).size;
        const sizeInKB = (bundleSize / 1024).toFixed(2);
        console.log(`📊 Bundle 大小: ${sizeInKB} KB`);
      }
    });
  },
};

// 自定義插件：清理輸出目錄
const cleanPlugin = {
  name: 'clean',
  setup(build) {
    build.onStart(() => {
      const distDir = path.join(__dirname, '..', 'dist');
      if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
      fs.mkdirSync(distDir, { recursive: true });
    });
  },
};

// 添加插件
baseConfig.plugins = [cleanPlugin, buildStatsPlugin];

// 執行建置
async function build() {
  try {
    if (isWatch) {
      console.log('👀 啟動監視模式...');
      const context = await esbuild.context(baseConfig);
      await context.watch();
      console.log('👀 監視中，檔案變更時將自動重建...');
      
      // 保持程序運行
      process.on('SIGINT', async () => {
        console.log('\n⏹️  停止監視...');
        await context.dispose();
        process.exit(0);
      });
    } else {
      await esbuild.build(baseConfig);
      
      if (isProduction) {
        console.log('🎉 生產建置完成！');
      } else {
        console.log('🎉 建置完成！');
      }
    }
  } catch (error) {
    console.error('❌ 建置失敗:', error);
    process.exit(1);
  }
}

// 確保 dist 目錄存在
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

build(); 