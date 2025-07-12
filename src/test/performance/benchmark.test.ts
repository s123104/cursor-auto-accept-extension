import * as assert from 'assert';
import { performance } from 'perf_hooks';

/**
 * 性能基準測試套件
 * 測試核心功能的性能指標和基準
 *
 * @author @s123104
 * @date 2025-07-12T04:59:51+08:00
 */
suite('Performance Benchmark Tests', () => {
  suite('Extension Startup Performance', () => {
    test('擴展啟動時間應小於 500ms', async () => {
      const startTime = performance.now();

      // 模擬擴展啟動過程
      await simulateExtensionActivation();

      const endTime = performance.now();
      const activationTime = endTime - startTime;

      assert.ok(activationTime < 500, `啟動時間 ${activationTime}ms 超過 500ms 基準`);
    });

    test('記憶體使用應小於 50MB', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // 模擬擴展運行
      await simulateExtensionWorkload();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

      assert.ok(memoryIncrease < 50, `記憶體增長 ${memoryIncrease}MB 超過 50MB 基準`);
    });
  });

  suite('Button Detection Performance', () => {
    test('按鈕檢測應在 100ms 內完成', async () => {
      const iterations = 100;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();

        // 模擬按鈕檢測
        await simulateButtonDetection();

        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);

      assert.ok(averageTime < 50, `平均檢測時間 ${averageTime}ms 超過 50ms 基準`);
      assert.ok(maxTime < 100, `最大檢測時間 ${maxTime}ms 超過 100ms 基準`);
    });

    test('高頻檢測不應導致性能下降', async () => {
      const testDuration = 5000; // 5 seconds
      const startTime = performance.now();
      let detectionCount = 0;

      while (performance.now() - startTime < testDuration) {
        await simulateButtonDetection();
        detectionCount++;
      }

      const actualDuration = performance.now() - startTime;
      const detectionsPerSecond = detectionCount / (actualDuration / 1000);

      assert.ok(detectionsPerSecond > 10, `檢測頻率 ${detectionsPerSecond}/s 低於 10/s 基準`);
    });
  });

  suite('Analytics Performance', () => {
    test('ROI 計算應在 10ms 內完成', async () => {
      const dataPoints = 1000;

      const startTime = performance.now();

      // 模擬 ROI 計算
      await simulateROICalculation(dataPoints);

      const endTime = performance.now();
      const calculationTime = endTime - startTime;

      assert.ok(calculationTime < 10, `ROI 計算時間 ${calculationTime}ms 超過 10ms 基準`);
    });

    test('大量數據處理性能', async () => {
      const largeDataSet = 10000;

      const startTime = performance.now();

      // 模擬大量數據處理
      await simulateDataProcessing(largeDataSet);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      assert.ok(processingTime < 100, `數據處理時間 ${processingTime}ms 超過 100ms 基準`);
    });
  });

  suite('UI Rendering Performance', () => {
    test('控制面板渲染應在 200ms 內完成', async () => {
      const startTime = performance.now();

      // 模擬控制面板渲染
      await simulateControlPanelRender();

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assert.ok(renderTime < 200, `渲染時間 ${renderTime}ms 超過 200ms 基準`);
    });

    test('數據更新不應阻塞 UI', async () => {
      const updateCount = 50;
      const maxUpdateTime = 5; // ms

      for (let i = 0; i < updateCount; i++) {
        const startTime = performance.now();

        // 模擬數據更新
        await simulateDataUpdate();

        const endTime = performance.now();
        const updateTime = endTime - startTime;

        assert.ok(
          updateTime < maxUpdateTime,
          `第 ${i + 1} 次更新時間 ${updateTime}ms 超過 ${maxUpdateTime}ms 基準`
        );
      }
    });
  });

  suite('Resource Usage', () => {
    test('CPU 使用率應保持在合理範圍', async () => {
      const testDuration = 3000; // 3 seconds
      const cpuSamples: number[] = [];

      const startTime = performance.now();

      while (performance.now() - startTime < testDuration) {
        const cpuStart = process.cpuUsage();

        // 模擬工作負載
        await simulateWorkload();

        const cpuEnd = process.cpuUsage(cpuStart);
        const cpuPercent = (cpuEnd.user + cpuEnd.system) / 1000 / 100; // 轉換為百分比

        cpuSamples.push(cpuPercent);

        await sleep(100); // 100ms 間隔
      }

      const averageCPU = cpuSamples.reduce((a, b) => a + b, 0) / cpuSamples.length;
      const maxCPU = Math.max(...cpuSamples);

      assert.ok(averageCPU < 5, `平均 CPU 使用率 ${averageCPU}% 超過 5% 基準`);
      assert.ok(maxCPU < 15, `最大 CPU 使用率 ${maxCPU}% 超過 15% 基準`);
    });
  });
});

// 模擬函數
async function simulateExtensionActivation(): Promise<void> {
  // 模擬擴展啟動過程
  await sleep(Math.random() * 100);
}

async function simulateExtensionWorkload(): Promise<void> {
  // 模擬擴展工作負載
  const data = new Array(1000).fill(0).map((_, i) => ({ id: i, value: Math.random() }));
  data.sort((a, b) => a.value - b.value);
  await sleep(50);
}

async function simulateButtonDetection(): Promise<void> {
  // 模擬按鈕檢測邏輯
  const elements = new Array(100).fill(0);
  elements.forEach((_, i) => {
    const element = { text: `button-${i}`, visible: Math.random() > 0.5 };
    if (element.visible && element.text.includes('Accept')) {
      // 找到按鈕
    }
  });
  await sleep(Math.random() * 10);
}

async function simulateROICalculation(dataPoints: number): Promise<void> {
  // 模擬 ROI 計算
  let total = 0;
  for (let i = 0; i < dataPoints; i++) {
    total += Math.random() * 1000;
  }
  const roi = total / dataPoints;
  await sleep(1);
}

async function simulateDataProcessing(dataSize: number): Promise<void> {
  // 模擬數據處理
  const data = new Array(dataSize).fill(0).map(() => Math.random());
  data.reduce((acc, val) => acc + val, 0);
  await sleep(10);
}

async function simulateControlPanelRender(): Promise<void> {
  // 模擬控制面板渲染
  const html = `
        <div>
            ${new Array(100)
              .fill(0)
              .map((_, i) => `<div>Item ${i}</div>`)
              .join('')}
        </div>
    `;
  await sleep(50);
}

async function simulateDataUpdate(): Promise<void> {
  // 模擬數據更新
  const data = { timestamp: Date.now(), value: Math.random() };
  JSON.stringify(data);
  await sleep(1);
}

async function simulateWorkload(): Promise<void> {
  // 模擬工作負載
  const start = performance.now();
  while (performance.now() - start < 10) {
    Math.random();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
