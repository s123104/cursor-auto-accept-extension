// AnalyticsManager - 分析數據收集和 ROI 計算 v2.2.0

import * as vscode from 'vscode';
import {
  AnalyticsData,
  ButtonType,
  FileInfo,
  ROIMetrics,
  PerformanceMetrics,
  LogLevel,
  AnalyticsEvent,
  ReportData,
} from '../types';
import { STORAGE_KEYS, ROI_CALCULATION_CONSTANTS } from '../utils/constants';

/**
 * AnalyticsManager - 分析數據收集和 ROI 計算管理器
 *
 * 負責：
 * - 收集用戶行為數據
 * - 計算 ROI 指標
 * - 生成性能報告
 * - 追蹤使用模式
 * - 數據持久化
 */
export class AnalyticsManager {
  private context: vscode.ExtensionContext;
  private outputChannel: vscode.OutputChannel;
  private analyticsData!: AnalyticsData;
  private sessionStartTime: number;
  private eventEmitter = new vscode.EventEmitter<AnalyticsEvent>();

  // 性能監控
  private performanceMetrics!: PerformanceMetrics;
  private clickHistory: Array<{
    timestamp: number;
    buttonType: ButtonType;
    fileInfo: FileInfo;
    success: boolean;
    duration: number;
  }> = [];

  // ROI 計算相關
  private roiMetrics!: ROIMetrics;
  private lastROICalculation: number = 0;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel('Cursor Auto Accept Analytics');
    this.sessionStartTime = Date.now();

    this.initializeAnalyticsData();
    this.initializePerformanceMetrics();
    this.initializeROIMetrics();

    this.log('AnalyticsManager 已初始化', LogLevel.INFO);
  }

  /**
   * 初始化分析數據
   */
  private initializeAnalyticsData(): void {
    const storedData = this.context.globalState.get<AnalyticsData>(STORAGE_KEYS.ANALYTICS_DATA);

    this.analyticsData = {
      totalClicks: storedData?.totalClicks || 0,
      successfulClicks: storedData?.successfulClicks || 0,
      failedClicks: storedData?.failedClicks || 0,
      totalTimeSaved: storedData?.totalTimeSaved || 0,
      sessionsCount: (storedData?.sessionsCount || 0) + 1,
      buttonTypeStats: storedData?.buttonTypeStats || {},
      dailyStats: storedData?.dailyStats || {},
      weeklyStats: storedData?.weeklyStats || {},
      monthlyStats: storedData?.monthlyStats || {},
      averageResponseTime: storedData?.averageResponseTime || 0,
      lastUpdated: Date.now(),
    };

    // 初始化按鈕類型統計
    Object.values(ButtonType).forEach(buttonType => {
      if (!this.analyticsData.buttonTypeStats[buttonType]) {
        this.analyticsData.buttonTypeStats[buttonType] = {
          clicks: 0,
          successes: 0,
          failures: 0,
          totalTime: 0,
          averageTime: 0,
        };
      }
    });
  }

  /**
   * 初始化性能指標
   */
  private initializePerformanceMetrics(): void {
    this.performanceMetrics = {
      averageClickTime: 0,
      successRate: 0,
      errorRate: 0,
      throughput: 0,
      peakUsageTime: '',
      mostUsedButtonType: ButtonType.ACCEPT,
      sessionDuration: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    };
  }

  /**
   * 初始化 ROI 指標
   */
  private initializeROIMetrics(): void {
    const storedROI = this.context.globalState.get<ROIMetrics>(STORAGE_KEYS.ROI_METRICS);

    this.roiMetrics = {
      totalTimeSaved: storedROI?.totalTimeSaved || 0,
      estimatedCostSaving: storedROI?.estimatedCostSaving || 0,
      productivityGain: storedROI?.productivityGain || 0,
      automationEfficiency: storedROI?.automationEfficiency || 0,
      userSatisfactionScore: storedROI?.userSatisfactionScore || 0,
      adoptionRate: storedROI?.adoptionRate || 0,
      timeToValue: storedROI?.timeToValue || 0,
      lastCalculated: Date.now(),
    };
  }

  /**
   * 記錄點擊事件
   */
  public recordClick(
    buttonType: ButtonType,
    fileInfo: FileInfo,
    success: boolean,
    duration: number
  ): void {
    const timestamp = Date.now();
    const dateKey = new Date(timestamp).toISOString().split('T')[0];

    // 更新總體統計
    this.analyticsData.totalClicks++;
    if (success) {
      this.analyticsData.successfulClicks++;
    } else {
      this.analyticsData.failedClicks++;
    }

    // 更新按鈕類型統計
    const buttonStats = this.analyticsData.buttonTypeStats[buttonType];
    buttonStats.clicks++;
    buttonStats.totalTime += duration;
    buttonStats.averageTime = buttonStats.totalTime / buttonStats.clicks;

    if (success) {
      buttonStats.successes++;
    } else {
      buttonStats.failures++;
    }

    // 更新每日統計
    if (!this.analyticsData.dailyStats[dateKey]) {
      this.analyticsData.dailyStats[dateKey] = {
        clicks: 0,
        successes: 0,
        failures: 0,
        timeSaved: 0,
      };
    }
    this.analyticsData.dailyStats[dateKey].clicks++;
    if (success) {
      this.analyticsData.dailyStats[dateKey].successes++;
      this.analyticsData.dailyStats[dateKey].timeSaved += this.calculateTimeSaved(buttonType);
    } else {
      this.analyticsData.dailyStats[dateKey].failures++;
    }

    // 記錄點擊歷史
    this.clickHistory.push({
      timestamp,
      buttonType,
      fileInfo,
      success,
      duration,
    });

    // 限制歷史記錄大小
    if (this.clickHistory.length > 1000) {
      this.clickHistory = this.clickHistory.slice(-500);
    }

    // 更新性能指標
    this.updatePerformanceMetrics();

    // 發送事件
    this.eventEmitter.fire({
      type: 'click-recorded',
      data: { buttonType, fileInfo, success, duration, timestamp },
    });

    // 持久化數據
    this.saveAnalyticsData();

    this.log(`記錄點擊事件: ${buttonType}, 成功: ${success}, 耗時: ${duration}ms`, LogLevel.DEBUG);
  }

  /**
   * 計算節省的時間
   */
  private calculateTimeSaved(buttonType: ButtonType): number {
    const timeMap = {
      [ButtonType.ACCEPT]: ROI_CALCULATION_CONSTANTS.ACCEPT_TIME_SAVED,
      [ButtonType.ACCEPT_ALL]: ROI_CALCULATION_CONSTANTS.ACCEPT_ALL_TIME_SAVED,
      [ButtonType.RUN]: ROI_CALCULATION_CONSTANTS.RUN_TIME_SAVED,
      [ButtonType.RUN_COMMAND]: ROI_CALCULATION_CONSTANTS.RUN_COMMAND_TIME_SAVED,
      [ButtonType.APPLY]: ROI_CALCULATION_CONSTANTS.APPLY_TIME_SAVED,
      [ButtonType.EXECUTE]: ROI_CALCULATION_CONSTANTS.EXECUTE_TIME_SAVED,
      [ButtonType.RESUME]: ROI_CALCULATION_CONSTANTS.RESUME_TIME_SAVED,
      [ButtonType.TRY_AGAIN]: ROI_CALCULATION_CONSTANTS.TRY_AGAIN_TIME_SAVED,
      [ButtonType.MOVE_TO_BACKGROUND]: ROI_CALCULATION_CONSTANTS.MOVE_TO_BACKGROUND_TIME_SAVED,
    };

    return timeMap[buttonType] || ROI_CALCULATION_CONSTANTS.DEFAULT_TIME_SAVED;
  }

  /**
   * 更新性能指標
   */
  private updatePerformanceMetrics(): void {
    const totalClicks = this.analyticsData.totalClicks;
    const successfulClicks = this.analyticsData.successfulClicks;

    // 計算平均點擊時間
    if (this.clickHistory.length > 0) {
      const totalDuration = this.clickHistory.reduce((sum, click) => sum + click.duration, 0);
      this.performanceMetrics.averageClickTime = totalDuration / this.clickHistory.length;
    }

    // 計算成功率
    this.performanceMetrics.successRate =
      totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0;
    this.performanceMetrics.errorRate = 100 - this.performanceMetrics.successRate;

    // 計算吞吐量 (每分鐘點擊數)
    const sessionDurationMinutes = (Date.now() - this.sessionStartTime) / (1000 * 60);
    this.performanceMetrics.throughput =
      sessionDurationMinutes > 0 ? totalClicks / sessionDurationMinutes : 0;

    // 更新會話持續時間
    this.performanceMetrics.sessionDuration = Date.now() - this.sessionStartTime;

    // 找出最常用的按鈕類型
    let maxClicks = 0;
    let mostUsedType = ButtonType.ACCEPT;
    Object.entries(this.analyticsData.buttonTypeStats).forEach(([type, stats]) => {
      if (stats.clicks > maxClicks) {
        maxClicks = stats.clicks;
        mostUsedType = type as ButtonType;
      }
    });
    this.performanceMetrics.mostUsedButtonType = mostUsedType;

    // 更新系統資源使用情況
    this.updateResourceUsage();
  }

  /**
   * 更新系統資源使用情況
   */
  private updateResourceUsage(): void {
    // 簡化的資源監控
    if (process.memoryUsage) {
      const memUsage = process.memoryUsage();
      this.performanceMetrics.memoryUsage = memUsage.heapUsed / 1024 / 1024; // MB
    }

    // CPU 使用率需要更複雜的計算，這裡設置為估算值
    this.performanceMetrics.cpuUsage = Math.min(this.performanceMetrics.throughput * 0.1, 100);
  }

  /**
   * 計算 ROI 指標
   */
  public calculateROI(): ROIMetrics {
    const now = Date.now();

    // 計算總節省時間
    this.roiMetrics.totalTimeSaved = Object.values(this.analyticsData.buttonTypeStats).reduce(
      (total, stats) => {
        return total + stats.successes * this.calculateTimeSaved(ButtonType.ACCEPT);
      },
      0
    );

    // 計算估算成本節省 (基於時薪)
    const hourlyRate = ROI_CALCULATION_CONSTANTS.DEVELOPER_HOURLY_RATE;
    const timeSavedHours = this.roiMetrics.totalTimeSaved / (1000 * 60 * 60);
    this.roiMetrics.estimatedCostSaving = timeSavedHours * hourlyRate;

    // 計算生產力提升
    const totalWorkingTime = this.performanceMetrics.sessionDuration;
    this.roiMetrics.productivityGain =
      totalWorkingTime > 0 ? (this.roiMetrics.totalTimeSaved / totalWorkingTime) * 100 : 0;

    // 計算自動化效率
    this.roiMetrics.automationEfficiency = this.performanceMetrics.successRate;

    // 計算用戶滿意度分數 (基於成功率和使用頻率)
    const usageFrequency = this.analyticsData.totalClicks / this.analyticsData.sessionsCount;
    this.roiMetrics.userSatisfactionScore = Math.min(
      this.performanceMetrics.successRate * 0.7 + usageFrequency * 0.3,
      100
    );

    // 計算採用率 (基於啟用的功能數量)
    const enabledFeatures = Object.values(this.analyticsData.buttonTypeStats).filter(
      stats => stats.clicks > 0
    ).length;
    const totalFeatures = Object.keys(ButtonType).length;
    this.roiMetrics.adoptionRate = (enabledFeatures / totalFeatures) * 100;

    // 計算價值實現時間
    this.roiMetrics.timeToValue =
      this.analyticsData.sessionsCount > 0
        ? this.roiMetrics.totalTimeSaved / this.analyticsData.sessionsCount
        : 0;

    this.roiMetrics.lastCalculated = now;
    this.lastROICalculation = now;

    // 保存 ROI 指標
    this.context.globalState.update(STORAGE_KEYS.ROI_METRICS, this.roiMetrics);

    this.log('ROI 指標已更新', LogLevel.INFO);
    return this.roiMetrics;
  }

  /**
   * 生成報告數據
   */
  public generateReport(): ReportData {
    this.calculateROI();

    return {
      summary: {
        totalClicks: this.analyticsData.totalClicks,
        successRate: this.performanceMetrics.successRate,
        totalTimeSaved: this.roiMetrics.totalTimeSaved,
        estimatedCostSaving: this.roiMetrics.estimatedCostSaving,
        sessionsCount: this.analyticsData.sessionsCount,
      },
      performance: this.performanceMetrics,
      roi: this.roiMetrics,
      buttonTypeStats: this.analyticsData.buttonTypeStats,
      dailyStats: this.analyticsData.dailyStats,
      trends: this.calculateTrends(),
      recommendations: this.generateRecommendations(),
      generatedAt: Date.now(),
    };
  }

  /**
   * 計算趨勢數據
   */
  private calculateTrends(): {
    clickTrend: number;
    successTrend: number;
    productivityTrend: number;
  } {
    const last7Days = this.getLast7DaysStats();
    const previous7Days = this.getPrevious7DaysStats();

    const clickTrend = this.calculatePercentageChange(
      previous7Days.totalClicks,
      last7Days.totalClicks
    );

    const successTrend = this.calculatePercentageChange(
      previous7Days.successRate,
      last7Days.successRate
    );

    const productivityTrend = this.calculatePercentageChange(
      previous7Days.productivity,
      last7Days.productivity
    );

    return {
      clickTrend,
      successTrend,
      productivityTrend,
    };
  }

  /**
   * 獲取最近 7 天統計
   */
  private getLast7DaysStats(): {
    totalClicks: number;
    successRate: number;
    productivity: number;
  } {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const stats = last7Days.reduce(
      (acc, dateKey) => {
        const dayStats = this.analyticsData.dailyStats[dateKey];
        if (dayStats) {
          acc.totalClicks += dayStats.clicks;
          acc.totalSuccesses += dayStats.successes;
          acc.totalTimeSaved += dayStats.timeSaved;
        }
        return acc;
      },
      { totalClicks: 0, totalSuccesses: 0, totalTimeSaved: 0 }
    );

    return {
      totalClicks: stats.totalClicks,
      successRate: stats.totalClicks > 0 ? (stats.totalSuccesses / stats.totalClicks) * 100 : 0,
      productivity: stats.totalTimeSaved,
    };
  }

  /**
   * 獲取前 7 天統計
   */
  private getPrevious7DaysStats(): {
    totalClicks: number;
    successRate: number;
    productivity: number;
  } {
    const now = new Date();
    const previous7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - 7 - i);
      return date.toISOString().split('T')[0];
    });

    const stats = previous7Days.reduce(
      (acc, dateKey) => {
        const dayStats = this.analyticsData.dailyStats[dateKey];
        if (dayStats) {
          acc.totalClicks += dayStats.clicks;
          acc.totalSuccesses += dayStats.successes;
          acc.totalTimeSaved += dayStats.timeSaved;
        }
        return acc;
      },
      { totalClicks: 0, totalSuccesses: 0, totalTimeSaved: 0 }
    );

    return {
      totalClicks: stats.totalClicks,
      successRate: stats.totalClicks > 0 ? (stats.totalSuccesses / stats.totalClicks) * 100 : 0,
      productivity: stats.totalTimeSaved,
    };
  }

  /**
   * 計算百分比變化
   */
  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * 生成建議
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // 基於成功率的建議
    if (this.performanceMetrics.successRate < 80) {
      recommendations.push('考慮調整自動接受間隔以提高成功率');
    }

    // 基於使用模式的建議
    const leastUsedButtons = Object.entries(this.analyticsData.buttonTypeStats)
      .filter(([, stats]) => stats.clicks === 0)
      .map(([type]) => type);

    if (leastUsedButtons.length > 0) {
      recommendations.push(`考慮啟用未使用的功能: ${leastUsedButtons.join(', ')}`);
    }

    // 基於 ROI 的建議
    if (this.roiMetrics.productivityGain < 10) {
      recommendations.push('增加使用頻率以提高生產力收益');
    }

    if (this.roiMetrics.adoptionRate < 50) {
      recommendations.push('探索更多自動化功能以提高採用率');
    }

    return recommendations;
  }

  /**
   * 保存分析數據
   */
  private saveAnalyticsData(): void {
    this.analyticsData.lastUpdated = Date.now();
    this.context.globalState.update(STORAGE_KEYS.ANALYTICS_DATA, this.analyticsData);
  }

  /**
   * 重置分析數據
   */
  public resetAnalytics(): void {
    this.analyticsData = {
      totalClicks: 0,
      successfulClicks: 0,
      failedClicks: 0,
      totalTimeSaved: 0,
      sessionsCount: 1,
      buttonTypeStats: {},
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      averageResponseTime: 0,
      lastUpdated: Date.now(),
    };

    this.clickHistory = [];
    this.initializePerformanceMetrics();
    this.initializeROIMetrics();

    this.saveAnalyticsData();
    this.context.globalState.update(STORAGE_KEYS.ROI_METRICS, this.roiMetrics);

    this.log('分析數據已重置', LogLevel.INFO);
  }

  /**
   * 獲取分析數據
   */
  public getAnalyticsData(): AnalyticsData {
    return { ...this.analyticsData };
  }

  /**
   * 獲取性能指標
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    this.updatePerformanceMetrics();
    return { ...this.performanceMetrics };
  }

  /**
   * 獲取 ROI 指標
   */
  public getROIMetrics(): ROIMetrics {
    // 如果距離上次計算超過 1 小時，重新計算
    if (Date.now() - this.lastROICalculation > 60 * 60 * 1000) {
      return this.calculateROI();
    }
    return { ...this.roiMetrics };
  }

  /**
   * 事件監聽器
   */
  public get onEvent(): vscode.Event<AnalyticsEvent> {
    return this.eventEmitter.event;
  }

  /**
   * 日誌記錄
   */
  private log(message: string, level: LogLevel = LogLevel.INFO): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    this.outputChannel.appendLine(logMessage);

    if (level === LogLevel.ERROR) {
      console.error(logMessage);
    } else if (level === LogLevel.WARNING) {
      console.warn(logMessage);
    } else if (level === LogLevel.DEBUG) {
      console.debug(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * 清理資源
   */
  public dispose(): void {
    this.saveAnalyticsData();
    this.context.globalState.update(STORAGE_KEYS.ROI_METRICS, this.roiMetrics);
    this.eventEmitter.dispose();
    this.outputChannel.dispose();
    this.log('AnalyticsManager 已清理', LogLevel.INFO);
  }
}
