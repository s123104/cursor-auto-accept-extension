const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

/**
 * 企業級 esbuild 配置
 * 支援開發和生產環境的現代化建置流程
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */

// 命令行參數解析
const args = process.argv.slice(2);
const isProduction = args.includes('--production');
const isWatch = args.includes('--watch');
const isDev = args.includes('--dev');

// 建置配置
const buildConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !isProduction,
  minify: isProduction,
  keepNames: true,
  metafile: true,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
    'process.env.EXTENSION_VERSION': `"${getPackageVersion()}"`,
    'process.env.BUILD_TIME': `"${new Date().toISOString()}"`,
  },
  banner: {
    js: `/*
 * Cursor Auto Accept Extension v${getPackageVersion()}
 * Built at ${new Date().toISOString()}
 * Environment: ${isProduction ? 'production' : 'development'}
 */`,
  },
  plugins: [
    // 清理輸出目錄插件
    {
      name: 'clean-dist',
      setup(build) {
        build.onStart(() => {
          if (fs.existsSync('dist')) {
            fs.rmSync('dist', { recursive: true, force: true });
          }
          fs.mkdirSync('dist', { recursive: true });
        });
      },
    },
    // 複製資源文件插件
    {
      name: 'copy-assets',
      setup(build) {
        build.onEnd(() => {
          copyAssets();
        });
      },
    },
    // 建置統計插件
    {
      name: 'build-stats',
      setup(build) {
        build.onEnd(result => {
          if (result.metafile) {
            const stats = analyzeBuildStats(result.metafile);
            console.log('\n📊 Build Statistics:');
            console.log(`   Bundle size: ${formatBytes(stats.bundleSize)}`);
            console.log(`   Modules: ${stats.moduleCount}`);
            console.log(`   Build time: ${stats.buildTime}ms`);

            if (isProduction) {
              // 生產環境下生成詳細報告
              generateBuildReport(result.metafile, stats);
            }
          }
        });
      },
    },
    // 錯誤處理插件
    {
      name: 'error-handler',
      setup(build) {
        build.onEnd(result => {
          if (result.errors.length > 0) {
            console.error('❌ Build failed with errors:');
            result.errors.forEach(error => {
              console.error(`   ${error.location?.file}:${error.location?.line} - ${error.text}`);
            });
            process.exit(1);
          }

          if (result.warnings.length > 0) {
            console.warn('⚠️  Build completed with warnings:');
            result.warnings.forEach(warning => {
              console.warn(
                `   ${warning.location?.file}:${warning.location?.line} - ${warning.text}`
              );
            });
          }
        });
      },
    },
  ],
};

// 開發環境特定配置
if (isDev || !isProduction) {
  buildConfig.define['process.env.DEBUG'] = 'true';
  buildConfig.sourcemap = 'inline';
  buildConfig.minify = false;
}

// 生產環境特定配置
if (isProduction) {
  buildConfig.drop = ['console', 'debugger'];
  buildConfig.legalComments = 'none';
  buildConfig.treeShaking = true;
  buildConfig.define['process.env.DEBUG'] = 'false';
}

/**
 * 獲取 package.json 版本號
 */
function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Warning: Could not read package.json version');
    return '0.0.0';
  }
}

/**
 * 複製資源文件
 */
function copyAssets() {
  const assetsDir = 'assets';
  const distAssetsDir = 'dist/assets';

  if (fs.existsSync(assetsDir)) {
    if (!fs.existsSync(distAssetsDir)) {
      fs.mkdirSync(distAssetsDir, { recursive: true });
    }

    const files = fs.readdirSync(assetsDir);
    files.forEach(file => {
      const srcPath = path.join(assetsDir, file);
      const destPath = path.join(distAssetsDir, file);

      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied: ${file}`);
      }
    });
  }
}

/**
 * 分析建置統計
 */
function analyzeBuildStats(metafile) {
  const bundleSize = Object.values(metafile.outputs)[0]?.bytes || 0;
  const moduleCount = Object.keys(metafile.inputs).length;
  const buildTime = Date.now() - startTime;

  return {
    bundleSize,
    moduleCount,
    buildTime,
  };
}

/**
 * 格式化字節大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成建置報告
 */
function generateBuildReport(metafile, stats) {
  const reportPath = 'dist/build-report.json';
  const report = {
    version: getPackageVersion(),
    buildTime: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
    stats,
    metafile,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📋 Build report generated: ${reportPath}`);
}

/**
 * 主要建置函數
 */
async function build() {
  const startTime = Date.now();

  try {
    console.log(`🚀 Starting build...`);
    console.log(`   Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(`   Watch mode: ${isWatch ? 'enabled' : 'disabled'}`);

    if (isWatch) {
      // 監視模式
      const context = await esbuild.context(buildConfig);
      await context.watch();
      console.log('👀 Watching for changes...');
    } else {
      // 單次建置
      const result = await esbuild.build(buildConfig);

      if (result.errors.length === 0) {
        const buildTime = Date.now() - startTime;
        console.log(`✅ Build completed successfully in ${buildTime}ms`);
      }
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// 全域變數用於計算建置時間
const startTime = Date.now();

// 如果直接執行此腳本，則開始建置
if (require.main === module) {
  build().catch(error => {
    console.error('❌ Build script failed:', error);
    process.exit(1);
  });
}

module.exports = { build, buildConfig };
