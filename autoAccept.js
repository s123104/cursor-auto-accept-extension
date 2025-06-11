// Cursor 自動接受腳本，帶有檔案分析和投資回報率 (ROI) 追蹤功能
// 作者：@ivalsaraj (https://linkedin.com/in/ivalsaraj)
// GitHub: https://github.com/ivalsaraj/cursor-auto-accept-full-agentic-mode
(function () {
  'use strict';

  if (window.autoAcceptAndAnalytics) return; // 避免重複載入

  if (typeof globalThis.autoAcceptAndAnalytics === 'undefined') {
    class autoAcceptAndAnalytics {
      constructor(interval = 2000) {
        this.interval = interval;
        this.isRunning = false;
        this.monitorInterval = null;
        this.totalClicks = 0;
        this.controlPanel = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentTab = 'main'; // 'main' (主面板), 'analytics' (分析), 或 'roi' (投資回報率)
        this.loggedMessages = new Set(); // 追蹤已記錄的訊息以防止重複
        this.debugMode = false; // 控制除錯日誌的輸出

        // 檔案分析追蹤
        this.analytics = {
          files: new Map(), // 檔名 -> { 接受次數, 最後接受時間, 增加行數, 刪除行數 }
          sessions: [], // 追蹤會話資料
          totalAccepts: 0,
          sessionStart: new Date(),
        };

        // ROI 時間追蹤 - 完整工作流程測量
        this.roiTracking = {
          totalTimeSaved: 0, // 單位：毫秒
          codeGenerationSessions: [],
          // 完整工作流程時間 (使用者提示 → Cursor 完成)
          averageCompleteWorkflow: 30000, // 30 秒：使用者觀看 Cursor 生成 + 手動接受
          averageAutomatedWorkflow: 100, // 約 100 毫秒：腳本即時偵測並點擊
          // 手動工作流程分解：
          // - 使用者發送提示：0秒 (兩者相同)
          // - Cursor 生成：10-20秒 (兩者相同)
          // - 使用者觀看生成過程：5-15秒 (被腳本消除)
          // - 使用者尋找並點擊按鈕：2-3秒 (被腳本消除)
          // - 上下文切換：1-2秒 (被腳本消除)
          currentWorkflowStart: null,
          currentSessionButtons: 0,
          workflowSessions: [], // 追蹤單個工作流程的時間
        };

        // 按鈕類型配置
        this.config = {
          enableAcceptAll: true,
          enableAccept: true,
          enableRun: true,
          enableRunCommand: true,
          enableApply: true,
          enableExecute: true,
          enableResume: true,
        };

        // 載入持久化資料
        this.loadFromStorage();

        this.createControlPanel();
        this.log('autoAcceptAndAnalytics 已初始化，包含檔案分析與 ROI 追蹤');
      }

      // 持久化方法
      saveToStorage() {
        try {
          const data = {
            analytics: {
              files: Array.from(this.analytics.files.entries()),
              sessions: this.analytics.sessions,
              totalAccepts: this.analytics.totalAccepts,
              sessionStart: this.analytics.sessionStart,
            },
            roiTracking: this.roiTracking,
            config: this.config,
            totalClicks: this.totalClicks,
            savedAt: new Date(),
          };
          localStorage.setItem('cursor-auto-accept-data', JSON.stringify(data));
        } catch (error) {
          console.warn('儲存到 localStorage 失敗：', error);
        }
      }

      loadFromStorage() {
        try {
          const saved = localStorage.getItem('cursor-auto-accept-data');
          if (saved) {
            const data = JSON.parse(saved);

            // 恢復分析資料
            if (data.analytics) {
              this.analytics.files = new Map(data.analytics.files || []);
              this.analytics.sessions = data.analytics.sessions || [];
              this.analytics.totalAccepts = data.analytics.totalAccepts || 0;
              this.analytics.sessionStart = data.analytics.sessionStart
                ? new Date(data.analytics.sessionStart)
                : new Date();
            }

            // 恢復 ROI 追蹤資料
            if (data.roiTracking) {
              this.roiTracking = { ...this.roiTracking, ...data.roiTracking };
            }

            // 恢復設定
            if (data.config) {
              this.config = { ...this.config, ...data.config };
            }

            // 恢復點擊次數
            if (data.totalClicks) {
              this.totalClicks = data.totalClicks;
            }

            console.log('已從 localStorage 載入資料');
          }
        } catch (error) {
          console.warn('從 localStorage 載入失敗：', error);
        }
      }

      clearStorage() {
        try {
          localStorage.removeItem('cursor-auto-accept-data');
          console.log('儲存空間已清除');

          // 同時重置當前會話資料
          this.analytics.files.clear();
          this.analytics.sessions = [];
          this.analytics.totalAccepts = 0;
          this.analytics.sessionStart = new Date();
          this.roiTracking.totalTimeSaved = 0;
          this.totalClicks = 0;

          // 更新 UI
          this.updateAnalyticsContent();
          this.updateMainFooter();
          this.updatePanelStatus();

          this.logToPanel('🗑️ 所有資料已清除 (儲存空間 + 當前會話)', 'warning');
        } catch (error) {
          console.warn('清除 localStorage 失敗：', error);
        }
      }

      validateData() {
        console.log('=== 資料驗證 ===');
        console.log('會話資訊：');
        console.log(`  會話開始時間：${this.analytics.sessionStart}`);
        console.log(`  總接受次數：${this.analytics.totalAccepts}`);
        console.log(`  總點擊次數：${this.totalClicks}`);
        console.log(`  總節省時間：${this.formatTimeDuration(this.roiTracking.totalTimeSaved)}`);

        console.log('\n已追蹤檔案：');
        this.analytics.files.forEach((data, filename) => {
          console.log(`  ${filename}:`);
          console.log(`    接受次數：${data.acceptCount}`);
          console.log(`    總增加行數：+${data.totalAdded}`);
          console.log(`    總刪除行數：-${data.totalDeleted}`);
          console.log(`    最後接受時間：${data.lastAccepted}`);
        });

        console.log('\n最近會話：');
        this.analytics.sessions.slice(-5).forEach((session, i) => {
          console.log(
            `  ${i + 1}. ${session.filename} (+${session.addedLines}/-${
              session.deletedLines
            }) [${session.buttonType}] 於 ${session.timestamp}`
          );
        });

        console.log('\nLocalStorage 檢查：');
        try {
          const saved = localStorage.getItem('cursor-auto-accept-data');
          if (saved) {
            const data = JSON.parse(saved);
            console.log('  儲存空間存在，儲存於：', data.savedAt);
            console.log('  儲存空間分析總接受次數：', data.analytics?.totalAccepts || 0);
            console.log('  儲存空間總點擊次數：', data.totalClicks || 0);
          } else {
            console.log('  localStorage 中沒有資料');
          }
        } catch (error) {
          console.log('  讀取 localStorage 時出錯：', error);
        }

        console.log('=== 驗證結束 ===');
        return {
          currentSession: {
            totalAccepts: this.analytics.totalAccepts,
            totalClicks: this.totalClicks,
            timeSaved: this.roiTracking.totalTimeSaved,
            filesCount: this.analytics.files.size,
          },
          isDataConsistent: this.analytics.totalAccepts === this.analytics.sessions.length,
        };
      }

      toggleDebug() {
        this.debugMode = !this.debugMode;
        console.log(`除錯模式 ${this.debugMode ? '已啟用' : '已停用'}`);
        this.logToPanel(`除錯模式 ${this.debugMode ? '開啟' : '關閉'}`, 'info');
        return this.debugMode;
      }

      calibrateWorkflowTimes(manualWorkflowSeconds, automatedWorkflowMs = 100) {
        const oldManual = this.roiTracking.averageCompleteWorkflow;
        const oldAuto = this.roiTracking.averageAutomatedWorkflow;

        this.roiTracking.averageCompleteWorkflow = manualWorkflowSeconds * 1000;
        this.roiTracking.averageAutomatedWorkflow = automatedWorkflowMs;

        console.log(`工作流程時間已更新：`);
        console.log(`  手動：${oldManual / 1000}秒 → ${manualWorkflowSeconds}秒`);
        console.log(`  自動：${oldAuto}毫秒 → ${automatedWorkflowMs}毫秒`);

        // 重新計算所有現有的工作流程會話
        this.roiTracking.totalTimeSaved = 0;
        this.roiTracking.workflowSessions.forEach(session => {
          const timeSaved =
            this.roiTracking.averageCompleteWorkflow - this.roiTracking.averageAutomatedWorkflow;
          this.roiTracking.totalTimeSaved += timeSaved;
          session.timeSaved = timeSaved;
        });

        this.saveToStorage();
        this.updateAnalyticsContent();
        this.updateMainFooter();

        this.logToPanel(`工作流程已校準：${manualWorkflowSeconds}秒手動`, 'info');
        return {
          manual: manualWorkflowSeconds,
          automated: automatedWorkflowMs,
        };
      }

      // ROI 追蹤方法
      startCodeGenSession() {
        this.roiTracking.currentSessionStart = new Date();
        this.roiTracking.currentSessionButtons = 0;
      }

      endCodeGenSession() {
        if (this.roiTracking.currentSessionStart) {
          const sessionDuration = new Date() - this.roiTracking.currentSessionStart;
          this.roiTracking.codeGenerationSessions.push({
            start: this.roiTracking.currentSessionStart,
            duration: sessionDuration,
            buttonsClicked: this.roiTracking.currentSessionButtons,
            timeSaved: this.roiTracking.currentSessionButtons * this.roiTracking.manualClickTime,
          });
          this.roiTracking.currentSessionStart = null;
        }
      }

      calculateTimeSaved(buttonType) {
        // 基於完整工作流程自動化計算節省的時間
        // 手動工作流程：使用者觀看生成 + 尋找按鈕 + 點擊 + 上下文切換
        // 自動工作流程：腳本在使用者專注於編碼時立即偵測並點擊

        const workflowTimeSavings = {
          'accept all': this.roiTracking.averageCompleteWorkflow + 5000, // 審查所有變更的額外時間
          accept: this.roiTracking.averageCompleteWorkflow,
          run: this.roiTracking.averageCompleteWorkflow + 2000, // 執行命令時需要額外謹慎
          execute: this.roiTracking.averageCompleteWorkflow + 2000,
          apply: this.roiTracking.averageCompleteWorkflow,
          resume: this.roiTracking.averageCompleteWorkflow + 3000, // 自動繼續對話所節省的時間
        };

        const manualTime =
          workflowTimeSavings[buttonType.toLowerCase()] || this.roiTracking.averageCompleteWorkflow;
        const automatedTime = this.roiTracking.averageAutomatedWorkflow;
        const timeSaved = manualTime - automatedTime;

        this.roiTracking.totalTimeSaved += timeSaved;
        this.roiTracking.currentSessionButtons++;

        // 追蹤此工作流程會話
        this.roiTracking.workflowSessions.push({
          timestamp: new Date(),
          buttonType: buttonType,
          manualTime: manualTime,
          automatedTime: automatedTime,
          timeSaved: timeSaved,
        });

        // 每次更新後儲存到儲存空間
        this.saveToStorage();

        return timeSaved;
      }

      formatTimeDuration(milliseconds) {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) return '0秒';

        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
          return `${hours}小時 ${minutes}分 ${seconds}秒`;
        } else if (minutes > 0) {
          return `${minutes}分 ${seconds}秒`;
        } else {
          return `${seconds}秒`;
        }
      }

      // 在點擊按鈕時從程式碼區塊中提取檔案資訊
      extractFileInfo(button) {
        try {
          if (this.debugMode) {
            this.log('=== 除錯：呼叫 extractFileInfo ===');
            this.log(`按鈕文字： "${button.textContent.trim()}"`);
            this.log(`按鈕 class： ${button.className}`);
          }

          // 新方法：在 conversations div 中尋找最新的 diff 區塊
          const conversationsDiv = document.querySelector('div.conversations');
          if (!conversationsDiv) {
            if (this.debugMode) this.log('除錯：未找到 conversations div');
            return null;
          }

          // 尋找所有帶有 data-message-index 的訊息氣泡，按索引排序 (最新優先)
          const messageBubbles = Array.from(
            conversationsDiv.querySelectorAll('[data-message-index]')
          ).sort((a, b) => {
            const indexA = parseInt(a.getAttribute('data-message-index'));
            const indexB = parseInt(b.getAttribute('data-message-index'));
            return indexB - indexA; // 降序 (最新優先)
          });

          if (this.debugMode) {
            this.log(`除錯：找到 ${messageBubbles.length} 個訊息氣泡`);
            if (messageBubbles.length > 0) {
              const latestIndex = messageBubbles[0].getAttribute('data-message-index');
              this.log(`除錯：最新訊息索引：${latestIndex}`);
            }
          }

          // 在最新的幾條訊息中尋找 diff 區塊
          for (let i = 0; i < Math.min(5, messageBubbles.length); i++) {
            const bubble = messageBubbles[i];
            const messageIndex = bubble.getAttribute('data-message-index');

            if (this.debugMode) {
              this.log(`除錯：正在檢查訊息 ${messageIndex}`);
            }

            // 在此訊息中尋找程式碼區塊容器
            const codeBlocks = bubble.querySelectorAll(
              '.composer-code-block-container, .composer-tool-former-message, .composer-diff-block'
            );

            if (this.debugMode && codeBlocks.length > 0) {
              this.log(`除錯：在訊息 ${messageIndex} 中找到 ${codeBlocks.length} 個程式碼區塊`);
            }

            for (const block of codeBlocks) {
              const fileInfo = this.extractFileInfoFromBlock(block);
              if (fileInfo) {
                if (this.debugMode) {
                  this.log(`除錯：成功提取檔案資訊：${JSON.stringify(fileInfo)}`);
                }
                return fileInfo;
              }
            }
          }

          if (this.debugMode) {
            this.log('除錯：在最近的訊息中未找到檔案資訊，嘗試備用方法');
          }

          // 備用方案：嘗試舊方法作為後備
          return this.extractFileInfoFallback(button);
        } catch (error) {
          this.log(`提取檔案資訊時出錯：${error.message}`);
          if (this.debugMode) {
            this.log(`除錯：錯誤堆疊：${error.stack}`);
          }
          return null;
        }
      }

      // 從特定的程式碼區塊中提取檔案資訊
      extractFileInfoFromBlock(block) {
        try {
          if (this.debugMode) {
            this.log(`除錯：正在分析 class 為 ${block.className} 的區塊`);
          }

          // 在多個可能的位置尋找檔名
          let filename = null;
          let addedLines = 0;
          let deletedLines = 0;

          // 方法 1：.composer-code-block-filename span
          const filenameSpan =
            block.querySelector('.composer-code-block-filename span[style*="direction: ltr"]') ||
            block.querySelector('.composer-code-block-filename span') ||
            block.querySelector('.composer-code-block-filename');

          if (filenameSpan) {
            filename = filenameSpan.textContent.trim();
            if (this.debugMode) {
              this.log(`除錯：透過 span 找到檔名："${filename}"`);
            }
          }

          // 方法 2：尋找任何內容類似檔名的元素
          if (!filename) {
            const allSpans = block.querySelectorAll('span');
            for (const span of allSpans) {
              const text = span.textContent.trim();
              // 檢查文字是否像檔名 (有副檔名)
              if (text && text.includes('.') && text.length < 100 && !text.includes(' ')) {
                const parts = text.split('.');
                if (parts.length >= 2 && parts[parts.length - 1].length <= 10) {
                  filename = text;
                  if (this.debugMode) {
                    this.log(`除錯：透過模式匹配找到檔名："${filename}"`);
                  }
                  break;
                }
              }
            }
          }

          // 從狀態元素中提取 diff 統計資訊
          const statusElements = block.querySelectorAll(
            '.composer-code-block-status span, span[style*="color"]'
          );

          if (this.debugMode) {
            this.log(`除錯：找到 ${statusElements.length} 個狀態元素`);
          }

          for (const statusEl of statusElements) {
            const statusText = statusEl.textContent.trim();
            if (this.debugMode) {
              this.log(`除錯：狀態文字："${statusText}"`);
            }

            // 尋找 +N/-N 模式
            const addedMatch = statusText.match(/\+(\d+)/);
            const deletedMatch = statusText.match(/-(\d+)/);

            if (addedMatch) {
              addedLines = Math.max(addedLines, parseInt(addedMatch[1]));
              if (this.debugMode) {
                this.log(`除錯：找到增加的行數：${addedLines}`);
              }
            }
            if (deletedMatch) {
              deletedLines = Math.max(deletedLines, parseInt(deletedMatch[1]));
              if (this.debugMode) {
                this.log(`除錯：找到刪除的行數：${deletedLines}`);
              }
            }
          }

          if (filename) {
            const fileInfo = {
              filename,
              addedLines: addedLines || 0,
              deletedLines: deletedLines || 0,
              timestamp: new Date(),
            };

            if (this.debugMode) {
              this.log(`除錯：建立的檔案資訊物件：${JSON.stringify(fileInfo)}`);
            }

            return fileInfo;
          }

          if (this.debugMode) {
            this.log('除錯：此區塊中未找到檔名');
          }
          return null;
        } catch (error) {
          if (this.debugMode) {
            this.log(`除錯：extractFileInfoFromBlock 出錯：${error.message}`);
          }
          return null;
        }
      }

      // 備用方法 (原始方法)
      extractFileInfoFallback(button) {
        try {
          if (this.debugMode) {
            this.log('除錯：使用備用提取方法');
          }

          // 尋找包含此按鈕的 composer-code-block-container
          let container = button.closest('.composer-code-block-container');
          if (!container) {
            // 嘗試在父元素中尋找
            let parent = button.parentElement;
            let attempts = 0;
            while (parent && attempts < 10) {
              container = parent.querySelector('.composer-code-block-container');
              if (container) break;
              parent = parent.parentElement;
              attempts++;
            }
          }

          if (!container) {
            if (this.debugMode) {
              this.log('除錯：在備用方法中未找到容器');
            }
            return null;
          }

          // 從 .composer-code-block-filename 提取檔名
          let filenameElement = container.querySelector(
            '.composer-code-block-filename span[style*="direction: ltr"]'
          );
          if (!filenameElement) {
            filenameElement = container.querySelector('.composer-code-block-filename span');
          }
          if (!filenameElement) {
            filenameElement = container.querySelector('.composer-code-block-filename');
          }
          const filename = filenameElement ? filenameElement.textContent.trim() : '未知檔案';

          // 從 .composer-code-block-status 提取 diff 統計資訊
          const statusElement = container.querySelector('.composer-code-block-status span');
          let addedLines = 0;
          let deletedLines = 0;

          if (statusElement) {
            const statusText = statusElement.textContent;
            const addedMatch = statusText.match(/\+(\d+)/);
            const deletedMatch = statusText.match(/-(\d+)/);

            if (addedMatch) addedLines = parseInt(addedMatch[1]);
            if (deletedMatch) deletedLines = parseInt(deletedMatch[1]);

            if (this.debugMode) {
              this.log(
                `除錯：備用方法提取 - 檔案：${filename}, 狀態："${statusText}", +${addedLines}/-${deletedLines}`
              );
            }
          }

          return {
            filename,
            addedLines: addedLines || 0,
            deletedLines: deletedLines || 0,
            timestamp: new Date(),
          };
        } catch (error) {
          if (this.debugMode) {
            this.log(`除錯：備用方法出錯：${error.message}`);
          }
          return null;
        }
      }

      // 追蹤檔案接受情況
      trackFileAcceptance(fileInfo, buttonType = 'accept') {
        if (!fileInfo || !fileInfo.filename) return;

        const { filename, addedLines, deletedLines, timestamp } = fileInfo;

        // 標準化按鈕類型以進行一致追蹤
        const normalizedButtonType = this.normalizeButtonType(buttonType);

        // 計算此操作節省的時間
        const timeSaved = this.calculateTimeSaved(normalizedButtonType);

        // 確保數字有效 (不是 NaN)
        const safeAddedLines = isNaN(addedLines) ? 0 : addedLines;
        const safeDeletedLines = isNaN(deletedLines) ? 0 : deletedLines;
        const safeTimeSaved = isNaN(timeSaved) ? 0 : timeSaved;

        // 更新檔案統計
        if (this.analytics.files.has(filename)) {
          const existing = this.analytics.files.get(filename);
          existing.acceptCount++;
          existing.lastAccepted = timestamp;
          existing.totalAdded += safeAddedLines;
          existing.totalDeleted += safeDeletedLines;

          // 追蹤按鈕類型計數
          if (!existing.buttonTypes) {
            existing.buttonTypes = {};
          }
          existing.buttonTypes[normalizedButtonType] =
            (existing.buttonTypes[normalizedButtonType] || 0) + 1;
        } else {
          this.analytics.files.set(filename, {
            acceptCount: 1,
            firstAccepted: timestamp,
            lastAccepted: timestamp,
            totalAdded: safeAddedLines,
            totalDeleted: safeDeletedLines,
            buttonTypes: {
              [normalizedButtonType]: 1,
            },
          });
        }

        // 在會話中追蹤，並單獨追蹤按鈕類型
        this.analytics.sessions.push({
          filename,
          addedLines: safeAddedLines,
          deletedLines: safeDeletedLines,
          timestamp,
          buttonType: normalizedButtonType,
          timeSaved: safeTimeSaved,
        });

        // 更新按鈕類型計數器
        if (!this.analytics.buttonTypeCounts) {
          this.analytics.buttonTypeCounts = {};
        }
        this.analytics.buttonTypeCounts[normalizedButtonType] =
          (this.analytics.buttonTypeCounts[normalizedButtonType] || 0) + 1;

        this.analytics.totalAccepts++;

        this.logToPanel(
          `📁 ${filename} (+${safeAddedLines}/-${safeDeletedLines}) [${normalizedButtonType}] [節省 ${this.formatTimeDuration(
            safeTimeSaved
          )}]`,
          'file'
        );
        this.log(
          `檔案已接受：${filename} (+${safeAddedLines}/-${safeDeletedLines}) - 按鈕：${normalizedButtonType} - 節省時間：${this.formatTimeDuration(
            safeTimeSaved
          )}`
        );

        // 如果分析面板可見，則更新
        if (this.currentTab === 'analytics' || this.currentTab === 'roi') {
          this.updateAnalyticsContent();
        }

        // 更新主面板頁腳的 ROI 顯示
        this.updateMainFooter();

        // 儲存到儲存空間
        this.saveToStorage();
      }

      // 標準化按鈕類型以進行一致的分析
      normalizeButtonType(buttonType) {
        if (!buttonType) return '未知';

        const type = buttonType.toLowerCase().trim();

        // 將變體映射到標準類型
        if (type.includes('accept all')) return '全部接受';
        if (type.includes('accept')) return '接受';
        if (type.includes('run command')) return '執行命令';
        if (type.includes('run')) return '執行';
        if (type.includes('apply')) return '套用';
        if (type.includes('execute')) return '執行';
        if (type.includes('resume')) return '繼續對話';

        return type;
      }

      createControlPanel() {
        if (this.controlPanel) return;

        this.controlPanel = document.createElement('div');
        this.controlPanel.id = 'auto-accept-control-panel';

        // 建立帶有標籤頁的標頭
        const header = document.createElement('div');
        header.className = 'aa-header';

        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'aa-tabs';

        const mainTab = document.createElement('button');
        mainTab.className = 'aa-tab aa-tab-active';
        mainTab.textContent = '主面板';
        mainTab.onclick = () => this.switchTab('main');

        const analyticsTab = document.createElement('button');
        analyticsTab.className = 'aa-tab';
        analyticsTab.textContent = '分析';
        analyticsTab.onclick = () => this.switchTab('analytics');

        const roiTab = document.createElement('button');
        roiTab.className = 'aa-tab';
        roiTab.textContent = 'ROI';
        roiTab.onclick = () => this.switchTab('roi');

        tabsContainer.appendChild(mainTab);
        tabsContainer.appendChild(analyticsTab);
        tabsContainer.appendChild(roiTab);

        const headerControls = document.createElement('div');
        headerControls.className = 'aa-header-controls';

        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'aa-minimize';
        minimizeBtn.title = '最小化';
        minimizeBtn.textContent = '−';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'aa-close';
        closeBtn.title = '關閉';
        closeBtn.textContent = '×';

        headerControls.appendChild(minimizeBtn);
        headerControls.appendChild(closeBtn);

        header.appendChild(tabsContainer);
        header.appendChild(headerControls);

        // 建立主內容區域
        const mainContent = document.createElement('div');
        mainContent.className = 'aa-content aa-main-content';

        // 狀態部分
        const status = document.createElement('div');
        status.className = 'aa-status';

        const statusText = document.createElement('span');
        statusText.className = 'aa-status-text';
        statusText.textContent = '已停止';

        const clicksText = document.createElement('span');
        clicksText.className = 'aa-clicks';
        clicksText.textContent = '0 次點擊';

        status.appendChild(statusText);
        status.appendChild(clicksText);

        // 控制部分
        const controls = document.createElement('div');
        controls.className = 'aa-controls';

        const startBtn = document.createElement('button');
        startBtn.className = 'aa-btn aa-start';
        startBtn.textContent = '開始';

        const stopBtn = document.createElement('button');
        stopBtn.className = 'aa-btn aa-stop';
        stopBtn.textContent = '停止';
        stopBtn.disabled = true;

        const configBtn = document.createElement('button');
        configBtn.className = 'aa-btn aa-config';
        configBtn.textContent = '設定';

        controls.appendChild(startBtn);
        controls.appendChild(stopBtn);
        controls.appendChild(configBtn);

        // 設定面板
        const configPanel = document.createElement('div');
        configPanel.className = 'aa-config-panel';
        configPanel.style.display = 'none';

        const configOptions = [
          { id: 'aa-accept-all', text: '全部接受', checked: true },
          { id: 'aa-accept', text: '接受', checked: true },
          { id: 'aa-run', text: '執行', checked: true },
          { id: 'aa-apply', text: '套用', checked: true },
          { id: 'aa-resume', text: '繼續對話', checked: true },
        ];

        configOptions.forEach(option => {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = option.id;
          checkbox.checked = option.checked;

          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(' ' + option.text));
          configPanel.appendChild(label);
        });

        // 日誌部分
        const log = document.createElement('div');
        log.className = 'aa-log';

        // 主標籤頁的 ROI 頁腳
        const roiFooter = document.createElement('div');
        roiFooter.className = 'aa-roi-footer';

        // 主標籤頁的鳴謝部分
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'aa-credits';

        const creditsText = document.createElement('small');
        creditsText.textContent = '作者：';

        const creditsLink = document.createElement('a');
        creditsLink.href = 'https://linkedin.com/in/ivalsaraj';
        creditsLink.target = '_blank';
        creditsLink.textContent = '@ivalsaraj';

        creditsText.appendChild(creditsLink);
        creditsDiv.appendChild(creditsText);

        // 組合主內容
        mainContent.appendChild(status);
        mainContent.appendChild(controls);
        mainContent.appendChild(configPanel);
        mainContent.appendChild(log);
        mainContent.appendChild(roiFooter);
        mainContent.appendChild(creditsDiv);

        // 建立分析內容區域
        const analyticsContent = document.createElement('div');
        analyticsContent.className = 'aa-content aa-analytics-content';
        analyticsContent.style.display = 'none';

        // 組合所有部分
        this.controlPanel.appendChild(header);
        this.controlPanel.appendChild(mainContent);
        this.controlPanel.appendChild(analyticsContent);

        this.controlPanel.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    width: 280px;
                    background: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 12px;
                    color: #ccc;
                    z-index: 999999;
                    user-select: none;
                    max-height: 500px;
                    display: flex;
                    flex-direction: column;
                `;

        this.addPanelStyles();
        this.setupPanelEvents();
        document.body.appendChild(this.controlPanel);

        // 初始化分析內容並更新主頁腳
        this.updateAnalyticsContent();
        this.updateMainFooter();
      }

      updateMainFooter() {
        const roiFooter = this.controlPanel?.querySelector('.aa-roi-footer');
        if (!roiFooter) return;

        // 清除現有內容
        while (roiFooter.firstChild) {
          roiFooter.removeChild(roiFooter.firstChild);
        }

        // 計算 ROI 指標
        const totalTimeSaved = this.roiTracking.totalTimeSaved || 0;
        const totalAccepts = this.analytics.totalAccepts || 0;
        const sessionDuration = new Date() - this.analytics.sessionStart;

        // 安全計算以避免 NaN - 基於完整工作流程計算效率
        const averageManualWorkflowTime = this.roiTracking.averageCompleteWorkflow;
        const totalManualTime = totalAccepts * averageManualWorkflowTime;
        const totalAutomatedTime = totalAccepts * this.roiTracking.averageAutomatedWorkflow;
        const efficiencyGain =
          totalManualTime > 0
            ? ((totalManualTime - totalAutomatedTime) / totalManualTime) * 100
            : 0;

        const title = document.createElement('div');
        title.className = 'aa-roi-footer-title';
        title.textContent = '⚡ 工作流程 ROI';

        const stats = document.createElement('div');
        stats.className = 'aa-roi-footer-stats';

        const timeSavedSpan = document.createElement('span');
        timeSavedSpan.textContent = `節省時間：${this.formatTimeDuration(totalTimeSaved)}`;

        const efficiencySpan = document.createElement('span');
        efficiencySpan.textContent = `工作流程效率：${efficiencyGain.toFixed(1)}%`;

        stats.appendChild(timeSavedSpan);
        stats.appendChild(efficiencySpan);

        roiFooter.appendChild(title);
        roiFooter.appendChild(stats);
      }

      switchTab(tabName) {
        this.currentTab = tabName;

        // 更新標籤頁按鈕
        const tabs = this.controlPanel.querySelectorAll('.aa-tab');
        tabs.forEach(tab => {
          tab.classList.remove('aa-tab-active');
          if (
            tab.textContent.toLowerCase() === tabName ||
            (tabName === 'main' && tab.textContent === '主面板') ||
            (tabName === 'analytics' && tab.textContent === '分析') ||
            (tabName === 'roi' && tab.textContent === 'ROI')
          ) {
            tab.classList.add('aa-tab-active');
          }
        });

        // 更新內容可見性
        const mainContent = this.controlPanel.querySelector('.aa-main-content');
        const analyticsContent = this.controlPanel.querySelector('.aa-analytics-content');

        if (tabName === 'main') {
          mainContent.style.display = 'block';
          analyticsContent.style.display = 'none';
        } else if (tabName === 'analytics') {
          mainContent.style.display = 'none';
          analyticsContent.style.display = 'block';
          this.updateAnalyticsContent();
        } else if (tabName === 'roi') {
          mainContent.style.display = 'none';
          analyticsContent.style.display = 'block';
          this.updateAnalyticsContent();
        }
      }

      updateAnalyticsContent() {
        const analyticsContent = this.controlPanel.querySelector('.aa-analytics-content');
        if (!analyticsContent) return;

        // 清除現有內容
        analyticsContent.textContent = '';

        if (this.currentTab === 'analytics') {
          this.renderAnalyticsTab(analyticsContent);
        } else if (this.currentTab === 'roi') {
          this.renderROITab(analyticsContent);
        }
      }

      renderAnalyticsTab(container) {
        const now = new Date();
        const sessionDuration = Math.round((now - this.analytics.sessionStart) / 1000 / 60); // 分鐘

        // 計算總計
        let totalFiles = this.analytics.files.size;
        let totalAdded = 0;
        let totalDeleted = 0;

        this.analytics.files.forEach(fileData => {
          totalAdded += fileData.totalAdded;
          totalDeleted += fileData.totalDeleted;
        });

        // 建立分析摘要
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'aa-analytics-summary';

        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = '📊 會話分析';
        summaryDiv.appendChild(summaryTitle);

        const stats = [
          { label: '會話時長：', value: `${sessionDuration}分鐘` },
          { label: '總接受次數：', value: `${this.analytics.totalAccepts}` },
          { label: '已修改檔案：', value: `${totalFiles}` },
          {
            label: '增加行數：',
            value: `+${totalAdded}`,
            class: 'aa-stat-added',
          },
          {
            label: '刪除行數：',
            value: `-${totalDeleted}`,
            class: 'aa-stat-deleted',
          },
        ];

        stats.forEach(stat => {
          const statDiv = document.createElement('div');
          statDiv.className = 'aa-stat';

          const labelSpan = document.createElement('span');
          labelSpan.className = 'aa-stat-label';
          labelSpan.textContent = stat.label;

          const valueSpan = document.createElement('span');
          valueSpan.className = `aa-stat-value ${stat.class || ''}`;
          valueSpan.textContent = stat.value;

          statDiv.appendChild(labelSpan);
          statDiv.appendChild(valueSpan);
          summaryDiv.appendChild(statDiv);
        });

        // 添加按鈕類型細分
        if (
          this.analytics.buttonTypeCounts &&
          Object.keys(this.analytics.buttonTypeCounts).length > 0
        ) {
          const buttonTypeDiv = document.createElement('div');
          buttonTypeDiv.className = 'aa-button-types';

          const buttonTypeTitle = document.createElement('h5');
          buttonTypeTitle.textContent = '🎯 按鈕類型';
          buttonTypeTitle.style.cssText = 'margin: 8px 0 4px 0; font-size: 11px; color: #ddd;';
          buttonTypeDiv.appendChild(buttonTypeTitle);

          Object.entries(this.analytics.buttonTypeCounts).forEach(([type, count]) => {
            const typeDiv = document.createElement('div');
            typeDiv.className = 'aa-stat aa-button-type-stat';
            typeDiv.style.cssText = 'font-size: 10px; padding: 2px 0;';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'aa-stat-label';
            labelSpan.textContent = `${type}:`;

            const valueSpan = document.createElement('span');
            valueSpan.className = 'aa-stat-value';
            valueSpan.textContent = `${count}次`;

            // 添加特定類型的樣式
            if (type === '接受' || type === '全部接受') {
              valueSpan.style.color = '#4CAF50';
            } else if (type === '執行' || type === '執行命令') {
              valueSpan.style.color = '#FF9800';
            } else if (type === '繼續對話') {
              valueSpan.style.color = '#2196F3';
            } else {
              valueSpan.style.color = '#9C27B0';
            }

            typeDiv.appendChild(labelSpan);
            typeDiv.appendChild(valueSpan);
            buttonTypeDiv.appendChild(typeDiv);
          });

          summaryDiv.appendChild(buttonTypeDiv);
        }

        // 建立檔案部分
        const filesDiv = document.createElement('div');
        filesDiv.className = 'aa-analytics-files';

        const filesTitle = document.createElement('h4');
        filesTitle.textContent = '📁 檔案活動';
        filesDiv.appendChild(filesTitle);

        const filesList = document.createElement('div');
        filesList.className = 'aa-files-list';
        this.renderFilesList(filesList);
        filesDiv.appendChild(filesList);

        // 建立操作部分
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'aa-analytics-actions';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'aa-btn aa-btn-small';
        exportBtn.textContent = '匯出資料';
        exportBtn.onclick = () => this.exportAnalytics();

        const clearBtn = document.createElement('button');
        clearBtn.className = 'aa-btn aa-btn-small';
        clearBtn.textContent = '清除資料';
        clearBtn.onclick = () => this.clearAnalytics();

        actionsDiv.appendChild(exportBtn);
        actionsDiv.appendChild(clearBtn);

        // 建立鳴謝部分
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'aa-credits';

        const creditsText = document.createElement('small');
        creditsText.textContent = '作者：';

        const creditsLink = document.createElement('a');
        creditsLink.href = 'https://linkedin.com/in/ivalsaraj';
        creditsLink.target = '_blank';
        creditsLink.textContent = '@ivalsaraj';

        creditsText.appendChild(creditsLink);
        creditsDiv.appendChild(creditsText);

        // 附加所有部分
        container.appendChild(summaryDiv);
        container.appendChild(filesDiv);
        container.appendChild(actionsDiv);
        container.appendChild(creditsDiv);
      }

      renderROITab(container) {
        const now = new Date();
        const sessionDuration = now - this.analytics.sessionStart;

        // 使用安全備用值計算 ROI 指標
        const totalTimeSaved = this.roiTracking.totalTimeSaved || 0;
        const totalAccepts = this.analytics.totalAccepts || 0;
        const averageTimePerClick = totalAccepts > 0 ? totalTimeSaved / totalAccepts : 0;
        const productivityGain = sessionDuration > 0 ? (totalTimeSaved / sessionDuration) * 100 : 0;

        // 建立 ROI 摘要
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'aa-roi-summary';

        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = '⚡ 完整工作流程 ROI';
        summaryDiv.appendChild(summaryTitle);

        // 添加工作流程測量說明
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'aa-roi-explanation';
        explanationDiv.style.cssText =
          'font-size: 10px; color: #888; margin-bottom: 8px; line-height: 1.3;';
        explanationDiv.textContent =
          '衡量完整的 AI 工作流程：使用者提示 → Cursor 生成 → 手動觀看/點擊 vs 自動接受';
        summaryDiv.appendChild(explanationDiv);

        const roiStats = [
          {
            label: '總節省時間：',
            value: this.formatTimeDuration(totalTimeSaved),
            class: 'aa-roi-highlight',
          },
          {
            label: '會話時長：',
            value: this.formatTimeDuration(sessionDuration),
          },
          {
            label: '每次點擊平均節省：',
            value: this.formatTimeDuration(averageTimePerClick),
          },
          {
            label: '生產力提升：',
            value: `${productivityGain.toFixed(1)}%`,
            class: 'aa-roi-percentage',
          },
          { label: '自動化點擊次數：', value: `${totalAccepts}` },
        ];

        roiStats.forEach(stat => {
          const statDiv = document.createElement('div');
          statDiv.className = 'aa-stat';

          const labelSpan = document.createElement('span');
          labelSpan.className = 'aa-stat-label';
          labelSpan.textContent = stat.label;

          const valueSpan = document.createElement('span');
          valueSpan.className = `aa-stat-value ${stat.class || ''}`;
          valueSpan.textContent = stat.value;

          statDiv.appendChild(labelSpan);
          statDiv.appendChild(valueSpan);
          summaryDiv.appendChild(statDiv);
        });

        // 建立影響分析
        const impactDiv = document.createElement('div');
        impactDiv.className = 'aa-roi-impact';

        const impactTitle = document.createElement('h4');
        impactTitle.textContent = '📈 影響分析';
        impactDiv.appendChild(impactTitle);

        const impactText = document.createElement('div');
        impactText.className = 'aa-roi-text';

        // 使用安全除法計算不同情境
        const hourlyRate = sessionDuration > 0 ? totalTimeSaved / sessionDuration : 0;
        const dailyProjection = hourlyRate * (8 * 60 * 60 * 1000); // 8 小時工作日
        const weeklyProjection = dailyProjection * 5;
        const monthlyProjection = dailyProjection * 22; // 工作日

        const scenarios = [
          { period: '每日 (8小時)', saved: dailyProjection },
          { period: '每週 (5天)', saved: weeklyProjection },
          { period: '每月 (22天)', saved: monthlyProjection },
        ];

        scenarios.forEach(scenario => {
          const scenarioDiv = document.createElement('div');
          scenarioDiv.className = 'aa-roi-scenario';
          scenarioDiv.textContent = `${
            scenario.period
          }：節省 ${this.formatTimeDuration(scenario.saved)}`;
          impactText.appendChild(scenarioDiv);
        });

        impactDiv.appendChild(impactText);

        // 手動 vs 自動比較
        const comparisonDiv = document.createElement('div');
        comparisonDiv.className = 'aa-roi-comparison';

        const comparisonTitle = document.createElement('h4');
        comparisonTitle.textContent = '🔄 完整工作流程比較';
        comparisonDiv.appendChild(comparisonTitle);

        // 添加工作流程分解說明
        const workflowBreakdown = document.createElement('div');
        workflowBreakdown.className = 'aa-workflow-breakdown';
        workflowBreakdown.style.cssText =
          'font-size: 10px; color: #888; margin-bottom: 8px; line-height: 1.3;';

        const manualLine = document.createElement('div');
        manualLine.textContent = '手動：觀看生成 + 找按鈕 + 點擊 + 切換 (~30秒)';
        workflowBreakdown.appendChild(manualLine);

        const automatedLine = document.createElement('div');
        automatedLine.textContent = '自動：在您編碼時即時偵測和點擊 (~0.1秒)';
        workflowBreakdown.appendChild(automatedLine);

        comparisonDiv.appendChild(workflowBreakdown);

        const manualTime = totalAccepts * this.roiTracking.averageCompleteWorkflow;
        const automatedTime = totalAccepts * this.roiTracking.averageAutomatedWorkflow;

        const comparisonStats = [
          {
            label: '手動工作流程時間：',
            value: this.formatTimeDuration(manualTime),
            class: 'aa-roi-manual',
          },
          {
            label: '自動工作流程時間：',
            value: this.formatTimeDuration(automatedTime),
            class: 'aa-roi-auto',
          },
          {
            label: '工作流程效率：',
            value: `${
              manualTime > 0
                ? (((manualTime - automatedTime) / manualTime) * 100).toFixed(1)
                : '0.0'
            }%`,
            class: 'aa-roi-highlight',
          },
        ];

        comparisonStats.forEach(stat => {
          const statDiv = document.createElement('div');
          statDiv.className = 'aa-stat';

          const labelSpan = document.createElement('span');
          labelSpan.className = 'aa-stat-label';
          labelSpan.textContent = stat.label;

          const valueSpan = document.createElement('span');
          valueSpan.className = `aa-stat-value ${stat.class || ''}`;
          valueSpan.textContent = stat.value;

          statDiv.appendChild(labelSpan);
          statDiv.appendChild(valueSpan);
          comparisonDiv.appendChild(statDiv);
        });

        // 也為 ROI 標籤頁建立鳴謝部分
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'aa-credits';

        const creditsText = document.createElement('small');
        creditsText.textContent = '作者：';

        const creditsLink = document.createElement('a');
        creditsLink.href = 'https://linkedin.com/in/ivalsaraj';
        creditsLink.target = '_blank';
        creditsLink.textContent = '@ivalsaraj';

        creditsText.appendChild(creditsLink);
        creditsDiv.appendChild(creditsText);

        // 附加所有部分
        container.appendChild(summaryDiv);
        container.appendChild(impactDiv);
        container.appendChild(comparisonDiv);
        container.appendChild(creditsDiv);
      }

      renderFilesList(container) {
        if (this.analytics.files.size === 0) {
          const noFilesDiv = document.createElement('div');
          noFilesDiv.className = 'aa-no-files';
          noFilesDiv.textContent = '尚無檔案被修改';
          container.appendChild(noFilesDiv);
          return;
        }

        const sortedFiles = Array.from(this.analytics.files.entries()).sort(
          (a, b) => b[1].lastAccepted - a[1].lastAccepted
        );

        sortedFiles.forEach(([filename, data]) => {
          const timeAgo = this.getTimeAgo(data.lastAccepted);

          const fileItem = document.createElement('div');
          fileItem.className = 'aa-file-item';

          const fileName = document.createElement('div');
          fileName.className = 'aa-file-name';
          fileName.textContent = filename;

          const fileStats = document.createElement('div');
          fileStats.className = 'aa-file-stats';

          const fileCount = document.createElement('span');
          fileCount.className = 'aa-file-count';
          fileCount.textContent = `${data.acceptCount}次`;

          const fileChanges = document.createElement('span');
          fileChanges.className = 'aa-file-changes';
          fileChanges.textContent = `+${data.totalAdded}/-${data.totalDeleted}`;

          const fileTime = document.createElement('span');
          fileTime.className = 'aa-file-time';
          fileTime.textContent = timeAgo;

          fileStats.appendChild(fileCount);
          fileStats.appendChild(fileChanges);
          fileStats.appendChild(fileTime);

          fileItem.appendChild(fileName);
          fileItem.appendChild(fileStats);

          container.appendChild(fileItem);
        });
      }

      getTimeAgo(date) {
        const now = new Date();
        const diff = Math.round((now - date) / 1000); // 秒

        if (diff < 60) return `${diff}秒前`;
        if (diff < 3600) return `${Math.round(diff / 60)}分前`;
        if (diff < 86400) return `${Math.round(diff / 3600)}小時前`;
        return `${Math.round(diff / 86400)}天前`;
      }

      exportAnalytics() {
        const data = {
          session: {
            start: this.analytics.sessionStart,
            duration: new Date() - this.analytics.sessionStart,
            totalAccepts: this.analytics.totalAccepts,
          },
          files: Object.fromEntries(this.analytics.files),
          sessions: this.analytics.sessions,
          config: this.config,
          exportedAt: new Date(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cursor-auto-accept-extension-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.logToPanel('📥 分析資料已匯出', 'info');
      }

      clearAnalytics() {
        if (confirm('確定要清除所有分析資料嗎？此操作無法復原。')) {
          this.analytics.files.clear();
          this.analytics.sessions = [];
          this.analytics.totalAccepts = 0;
          this.analytics.sessionStart = new Date();
          this.updateAnalyticsContent();
          this.logToPanel('🗑️ 分析資料已清除', 'warning');
        }
      }

      addPanelStyles() {
        if (document.getElementById('auto-accept-styles')) return;

        const style = document.createElement('style');
        style.id = 'auto-accept-styles';
        style.textContent = `
                    .aa-header {
                        background: #2d2d2d;
                        padding: 6px 10px;
                        border-radius: 5px 5px 0 0;
                        cursor: move;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #333;
                    }
                    
                    .aa-tabs {
                        display: flex;
                        gap: 4px;
                    }
                    
                    .aa-tab {
                        background: #444;
                        border: none;
                        color: #ccc;
                        font-size: 11px;
                        cursor: pointer;
                        padding: 4px 8px;
                        border-radius: 3px;
                        transition: all 0.2s;
                    }
                    
                    .aa-tab:hover {
                        background: #555;
                    }
                    
                    .aa-tab-active {
                        background: #0d7377 !important;
                        color: white !important;
                    }
                    
                    .aa-header-controls {
                        display: flex;
                        gap: 4px;
                    }
                    
                    .aa-title {
                        font-weight: 500;
                        color: #fff;
                        font-size: 12px;
                    }
                    .aa-minimize, .aa-close {
                        background: #444;
                        border: none;
                        color: #ccc;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        padding: 2px 5px;
                        border-radius: 2px;
                        line-height: 1;
                        width: 16px;
                        height: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .aa-minimize:hover, .aa-close:hover {
                        background: #555;
                    }
                    .aa-close:hover {
                        background: #dc3545;
                        color: white;
                    }
                    .aa-content {
                        padding: 12px;
                        overflow-y: auto;
                        flex: 1;
                    }
                    .aa-status {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        padding: 6px 8px;
                        background: #252525;
                        border-radius: 4px;
                        font-size: 11px;
                    }
                    .aa-status-text.running {
                        color: #4CAF50;
                        font-weight: 500;
                    }
                    .aa-status-text.stopped {
                        color: #f44336;
                    }
                    .aa-clicks {
                        color: #888;
                    }
                    .aa-controls {
                        display: flex;
                        gap: 6px;
                        margin-bottom: 10px;
                    }
                    .aa-btn {
                        flex: 1;
                        padding: 6px 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: 500;
                        transition: all 0.2s;
                    }
                    .aa-btn-small {
                        flex: none;
                        padding: 4px 8px;
                        font-size: 10px;
                    }
                    .aa-start {
                        background: #4CAF50;
                        color: white;
                    }
                    .aa-start:hover:not(:disabled) {
                        background: #45a049;
                    }
                    .aa-stop {
                        background: #f44336;
                        color: white;
                    }
                    .aa-stop:hover:not(:disabled) {
                        background: #da190b;
                    }
                    .aa-config {
                        background: #2196F3;
                        color: white;
                    }
                    .aa-config:hover:not(:disabled) {
                        background: #1976D2;
                    }
                    .aa-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    .aa-config-panel {
                        background: #252525;
                        border-radius: 4px;
                        padding: 8px;
                        margin-bottom: 10px;
                    }
                    .aa-config-panel label {
                        display: block;
                        margin-bottom: 4px;
                        font-size: 11px;
                        cursor: pointer;
                    }
                    .aa-config-panel input[type="checkbox"] {
                        margin-right: 6px;
                    }
                    .aa-log {
                        background: #252525;
                        border-radius: 4px;
                        padding: 8px;
                        height: 120px;
                        overflow-y: auto;
                        font-size: 10px;
                        line-height: 1.3;
                    }
                    .aa-log-entry {
                        margin-bottom: 2px;
                        padding: 2px 4px;
                        border-radius: 2px;
                    }
                    .aa-log-entry.info {
                        color: #4CAF50;
                    }
                    .aa-log-entry.warning {
                        color: #FF9800;
                    }
                    .aa-log-entry.error {
                        color: #f44336;
                    }
                    .aa-log-entry.file {
                        color: #2196F3;
                        background: rgba(33, 150, 243, 0.1);
                    }
                    
                    /* 分析頁面樣式 */
                    .aa-analytics-summary {
                        background: #252525;
                        border-radius: 4px;
                        padding: 8px;
                        margin-bottom: 10px;
                    }
                    
                    .aa-analytics-summary h4 {
                        margin: 0 0 8px 0;
                        font-size: 12px;
                        color: #fff;
                    }
                    
                    .aa-stat {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                        font-size: 11px;
                    }
                    
                    .aa-stat-label {
                        color: #888;
                    }
                    
                    .aa-stat-value {
                        color: #fff;
                        font-weight: 500;
                    }
                    
                    .aa-stat-added {
                        color: #4CAF50;
                    }
                    
                    .aa-stat-deleted {
                        color: #f44336;
                    }
                    
                    .aa-analytics-files {
                        background: #252525;
                        border-radius: 4px;
                        padding: 8px;
                        margin-bottom: 10px;
                    }
                    
                    .aa-analytics-files h4 {
                        margin: 0 0 8px 0;
                        font-size: 12px;
                        color: #fff;
                    }
                    
                    .aa-files-list {
                        max-height: 150px;
                        overflow-y: auto;
                    }
                    
                    .aa-file-item {
                        padding: 4px 0;
                        border-bottom: 1px solid #333;
                    }
                    
                    .aa-file-item:last-child {
                        border-bottom: none;
                    }
                    
                    .aa-file-name {
                        font-size: 11px;
                        color: #fff;
                        font-weight: 500;
                        margin-bottom: 2px;
                        word-break: break-all;
                    }
                    
                    .aa-file-stats {
                        display: flex;
                        gap: 8px;
                        font-size: 10px;
                        color: #888;
                    }
                    
                    .aa-file-count {
                        background: #444;
                        padding: 1px 4px;
                        border-radius: 2px;
                        color: #ccc;
                    }
                    
                    .aa-file-changes {
                        color: #2196F3;
                    }
                    
                    .aa-file-time {
                        margin-left: auto;
                    }
                    
                    .aa-no-files {
                        color: #888;
                        font-size: 11px;
                        text-align: center;
                        padding: 20px;
                    }
                    
                    .aa-analytics-actions {
                        display: flex;
                        gap: 6px;
                        margin-bottom: 10px;
                    }
                    
                    .aa-analytics-actions .aa-btn {
                        background: #444;
                        color: #ccc;
                    }
                    
                    .aa-analytics-actions .aa-btn:hover {
                        background: #555;
                    }
                    
                    .aa-credits {
                        text-align: center;
                        padding: 8px;
                        border-top: 1px solid #333;
                        color: #666;
                    }
                    
                    .aa-credits a {
                        color: #2196F3;
                        text-decoration: none;
                    }
                    
                    .aa-credits a:hover {
                        text-decoration: underline;
                    }
                    
                    /* ROI 標籤頁樣式 */
                    .aa-roi-summary, .aa-roi-impact, .aa-roi-comparison {
                        margin-bottom: 12px;
                        padding: 8px;
                        background: #333;
                        border-radius: 4px;
                    }
                    
                    .aa-roi-highlight {
                        color: #4CAF50 !important;
                        font-weight: 600;
                    }
                    
                    .aa-roi-percentage {
                        color: #2196F3 !important;
                        font-weight: 600;
                    }
                    
                    .aa-roi-manual {
                        color: #FF9800 !important;
                    }
                    
                    .aa-roi-auto {
                        color: #4CAF50 !important;
                    }
                    
                    .aa-roi-text {
                        margin-top: 8px;
                    }
                    
                    .aa-roi-scenario {
                        margin: 4px 0;
                        padding: 4px;
                        background: #444;
                        border-radius: 3px;
                        font-size: 11px;
                        color: #ccc;
                    }
                    
                    /* ROI 頁腳樣式 (用於主標籤頁) */
                    .aa-roi-footer {
                        margin-top: 8px;
                        padding: 6px 8px;
                        background: #2d2d2d;
                        border-radius: 4px;
                        border-top: 1px solid #444;
                    }
                    
                    .aa-roi-footer-title {
                        font-size: 10px;
                        color: #fff;
                        font-weight: 600;
                        margin-bottom: 4px;
                    }
                    
                    .aa-roi-footer-stats {
                        display: flex;
                        justify-content: space-between;
                        font-size: 9px;
                        color: #888;
                    }
                    
                    .aa-roi-footer-stats span {
                        color: #4CAF50;
                    }
                    
                    /* 最小化功能 */
                    #auto-accept-control-panel.aa-minimized .aa-content {
                        display: none;
                    }
                    
                    #auto-accept-control-panel.aa-minimized {
                        height: auto;
                        max-height: none;
                    }
                `;
        document.head.appendChild(style);
      }

      setupPanelEvents() {
        const header = this.controlPanel.querySelector('.aa-header');
        const minimizeBtn = this.controlPanel.querySelector('.aa-minimize');
        const closeBtn = this.controlPanel.querySelector('.aa-close');
        const startBtn = this.controlPanel.querySelector('.aa-start');
        const stopBtn = this.controlPanel.querySelector('.aa-stop');
        const configBtn = this.controlPanel.querySelector('.aa-config');
        const configPanel = this.controlPanel.querySelector('.aa-config-panel');

        // 拖曳功能
        header.addEventListener('mousedown', e => {
          if (e.target === minimizeBtn || e.target === closeBtn) return;
          this.isDragging = true;
          const rect = this.controlPanel.getBoundingClientRect();
          this.dragOffset.x = e.clientX - rect.left;
          this.dragOffset.y = e.clientY - rect.top;
          e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
          if (!this.isDragging) return;
          const x = e.clientX - this.dragOffset.x;
          const y = e.clientY - this.dragOffset.y;
          this.controlPanel.style.left =
            Math.max(0, Math.min(window.innerWidth - this.controlPanel.offsetWidth, x)) + 'px';
          this.controlPanel.style.top =
            Math.max(0, Math.min(window.innerHeight - this.controlPanel.offsetHeight, y)) + 'px';
          this.controlPanel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
          this.isDragging = false;
        });

        // 控制按鈕
        minimizeBtn.addEventListener('click', () => {
          this.controlPanel.classList.toggle('aa-minimized');
        });

        closeBtn.addEventListener('click', () => {
          this.hideControlPanel();
        });

        startBtn.addEventListener('click', () => {
          this.start();
        });

        stopBtn.addEventListener('click', () => {
          this.stop();
        });

        configBtn.addEventListener('click', () => {
          configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
        });

        // 設定複選框
        const checkboxes = this.controlPanel.querySelectorAll(
          '.aa-config-panel input[type="checkbox"]'
        );
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            const configMap = {
              'aa-accept-all': 'enableAcceptAll',
              'aa-accept': 'enableAccept',
              'aa-run': 'enableRun',
              'aa-apply': 'enableApply',
              'aa-resume': 'enableResume',
            };
            const configKey = configMap[checkbox.id];
            if (configKey) {
              this.config[configKey] = checkbox.checked;
              this.config.enableRunCommand = this.config.enableRun;
              this.config.enableExecute = this.config.enableApply;
            }
          });
        });
      }

      updatePanelStatus() {
        if (!this.controlPanel) return;

        const statusText = this.controlPanel.querySelector('.aa-status-text');
        const clicksText = this.controlPanel.querySelector('.aa-clicks');
        const startBtn = this.controlPanel.querySelector('.aa-start');
        const stopBtn = this.controlPanel.querySelector('.aa-stop');

        if (this.isRunning) {
          statusText.textContent = '執行中';
          statusText.className = 'aa-status-text running';
          startBtn.disabled = true;
          stopBtn.disabled = false;
        } else {
          statusText.textContent = '已停止';
          statusText.className = 'aa-status-text stopped';
          startBtn.disabled = false;
          stopBtn.disabled = true;
        }

        clicksText.textContent = `${this.totalClicks} 次點擊`;
      }

      logToPanel(message, type = 'info') {
        if (!this.controlPanel) return;

        // 建立唯一的訊息鍵以防止重複
        const messageKey = `${type}:${message}`;
        const now = Date.now();

        // 如果在過去 2 秒內記錄了相同的訊息，則跳過
        if (this.loggedMessages.has(messageKey)) {
          return;
        }

        // 添加到已記錄的訊息中，並清理舊條目
        this.loggedMessages.add(messageKey);
        setTimeout(() => this.loggedMessages.delete(messageKey), 2000);

        const logContainer = this.controlPanel.querySelector('.aa-log');
        const logEntry = document.createElement('div');
        logEntry.className = `aa-log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // 只保留最後 20 個條目
        while (logContainer.children.length > 20) {
          logContainer.removeChild(logContainer.firstChild);
        }
      }

      showControlPanel() {
        if (!this.controlPanel) this.createControlPanel();
        this.controlPanel.style.display = 'flex';
      }

      hideControlPanel() {
        if (this.controlPanel) {
          this.controlPanel.style.display = 'none';
        }
      }

      log(message) {
        const timestamp = new Date().toISOString();
        const prefix = '[AutoAccept]';
        const fullMessage = `${prefix} ${timestamp} - ${message}`;

        // 控制台日誌
        console.log(fullMessage);

        // 面板日誌
        this.logToPanel(message, 'info');
      }

      // 尋找輸入框並檢查其前面的兄弟元素是否有按鈕
      findAcceptButtons() {
        const buttons = [];

        // 尋找輸入框
        const inputBox = document.querySelector('div.full-input-box');
        if (!inputBox) {
          this.log('未找到輸入框');
          return buttons;
        }

        // 檢查前面的兄弟元素是否有常規按鈕
        let currentElement = inputBox.previousElementSibling;
        let searchDepth = 0;

        while (currentElement && searchDepth < 5) {
          // 尋找任何包含 "Accept" 文字的可點擊元素
          const acceptElements = this.findAcceptInElement(currentElement);
          buttons.push(...acceptElements);

          currentElement = currentElement.previousElementSibling;
          searchDepth++;
        }

        // 如果啟用，也搜尋訊息氣泡中的 "繼續對話" 連結
        if (this.config.enableResume) {
          const resumeLinks = this.findResumeLinks();
          buttons.push(...resumeLinks);
        }

        return buttons;
      }

      // 在特定元素中尋找接受按鈕
      findAcceptInElement(element) {
        const buttons = [];

        // 取得所有可點擊元素 (divs, buttons, 帶有 click 處理器的 spans)
        const clickableSelectors = [
          'div[class*="button"]',
          'button',
          'div[onclick]',
          'div[style*="cursor: pointer"]',
          'div[style*="cursor:pointer"]',
          '[class*="anysphere"]',
          '[class*="cursor-button"]',
          '[class*="text-button"]',
          '[class*="primary-button"]',
          '[class*="secondary-button"]',
        ];

        for (const selector of clickableSelectors) {
          const elements = element.querySelectorAll(selector);
          for (const el of elements) {
            if (this.isAcceptButton(el)) {
              buttons.push(el);
            }
          }
        }

        // 同時檢查元素本身
        if (this.isAcceptButton(element)) {
          buttons.push(element);
        }

        return buttons;
      }

      // 檢查元素是否為接受按鈕
      isAcceptButton(element) {
        if (!element || !element.textContent) return false;

        // 首先檢查它是否為 "繼續對話" 連結
        if (this.config.enableResume && this.isResumeLink(element)) {
          return true;
        }

        const text = element.textContent.toLowerCase().trim();

        // 根據設定檢查每個模式
        const patterns = [
          { pattern: 'accept all', enabled: this.config.enableAcceptAll },
          { pattern: 'accept', enabled: this.config.enableAccept },
          { pattern: 'run command', enabled: this.config.enableRunCommand },
          { pattern: 'run', enabled: this.config.enableRun },
          { pattern: 'apply', enabled: this.config.enableApply },
          { pattern: 'execute', enabled: this.config.enableExecute },
          { pattern: 'resume', enabled: this.config.enableResume },
        ];

        // 檢查文字是否匹配任何已啟用的模式
        const matchesEnabledPattern = patterns.some(
          ({ pattern, enabled }) => enabled && text.includes(pattern)
        );

        if (!matchesEnabledPattern) return false;

        const isVisible = this.isElementVisible(element);
        const isClickable = this.isElementClickable(element);

        return isVisible && isClickable;
      }

      // 檢查元素是否可見
      isElementVisible(element) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity) > 0.1 &&
          rect.width > 0 &&
          rect.height > 0
        );
      }

      // 檢查元素是否可點擊
      isElementClickable(element) {
        const style = window.getComputedStyle(element);
        return (
          style.pointerEvents !== 'none' && !element.disabled && !element.hasAttribute('disabled')
        );
      }

      // 使用多種策略點擊元素
      clickElement(element) {
        try {
          // 確定按鈕類型以便更好地追蹤
          const buttonText = element.textContent.trim().toLowerCase();
          const isResumeLink = this.isResumeLink(element);

          if (this.debugMode) {
            this.log(`=== 除錯：呼叫 clickElement ===`);
            this.log(`按鈕文字： "${buttonText}"`);
            this.log(`是否為繼續對話連結： ${isResumeLink}`);
            this.log(`元素 class： ${element.className}`);
            this.log(`元素標籤： ${element.tagName}`);
          }

          // 在點擊前提取檔案資訊 (僅適用於非 "繼續對話" 按鈕)
          let fileInfo = null;
          if (!isResumeLink) {
            fileInfo = this.extractFileInfo(element);
            if (this.debugMode) {
              this.log(`除錯：檔案資訊提取結果：${fileInfo ? JSON.stringify(fileInfo) : 'null'}`);
            }
          }

          const rect = element.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          if (this.debugMode) {
            this.log(`除錯：元素位置：x=${x}, y=${y}`);
          }

          // 策略 1：直接點擊
          element.click();

          // 策略 2：滑鼠事件
          const mouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
          });
          element.dispatchEvent(mouseEvent);

          // 策略 3：聚焦和 Enter 鍵 (適用於按鈕和互動元素)
          if (element.focus) element.focus();
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true,
          });
          element.dispatchEvent(enterEvent);

          // 處理不同按鈕類型以進行分析
          if (isResumeLink) {
            // 對於 "繼續對話" 連結，只追蹤操作
            const timeSaved = this.calculateTimeSaved('resume-conversation');
            this.logToPanel(
              `🔄 點擊了繼續對話 [節省 ${this.formatTimeDuration(timeSaved)}]`,
              'info'
            );
            this.log(`點擊了繼續對話 - 節省時間：${this.formatTimeDuration(timeSaved)}`);

            // 追蹤按鈕類型計數
            if (!this.analytics.buttonTypeCounts) {
              this.analytics.buttonTypeCounts = {};
            }
            this.analytics.buttonTypeCounts['繼續對話'] =
              (this.analytics.buttonTypeCounts['繼續對話'] || 0) + 1;

            // 更新總計
            this.analytics.totalAccepts++;
            this.roiTracking.totalTimeSaved += timeSaved;

            // 儲存到儲存空間
            this.saveToStorage();
          } else if (fileInfo) {
            // 追蹤常規按鈕的檔案分析
            this.trackFileAcceptance(fileInfo, buttonText);
          } else {
            // 即使沒有檔案資訊，仍追蹤節省的時間
            const timeSaved = this.calculateTimeSaved(buttonText);
            this.logToPanel(
              `✓ 已點擊：${element.textContent.trim()} [節省 ${this.formatTimeDuration(
                timeSaved
              )}]`,
              'info'
            );

            // 追蹤按鈕類型計數
            const normalizedType = this.normalizeButtonType(buttonText);
            if (!this.analytics.buttonTypeCounts) {
              this.analytics.buttonTypeCounts = {};
            }
            this.analytics.buttonTypeCounts[normalizedType] =
              (this.analytics.buttonTypeCounts[normalizedType] || 0) + 1;

            // 更新總計
            this.analytics.totalAccepts++;
            this.roiTracking.totalTimeSaved += timeSaved;

            // 儲存到儲存空間
            this.saveToStorage();
          }

          // 更新 UI
          this.updatePanelStatus();
          if (this.currentTab === 'analytics' || this.currentTab === 'roi') {
            this.updateAnalyticsContent();
          }
          this.updateMainFooter();

          return true;
        } catch (error) {
          this.logToPanel(`點擊失敗：${error.message}`, 'warning');
          if (this.debugMode) {
            this.log(`除錯：點擊錯誤堆疊：${error.stack}`);
          }
          return false;
        }
      }

      // 主要執行
      checkAndClick() {
        try {
          const buttons = this.findAcceptButtons();

          if (buttons.length === 0) {
            // 不要因「未找到按鈕」而頻繁記錄日誌
            return;
          }

          // 點擊找到的第一個按鈕
          const button = buttons[0];
          const buttonText = button.textContent.trim().substring(0, 30);

          const success = this.clickElement(button);
          if (success) {
            this.totalClicks++;
            this.updatePanelStatus();
          }
        } catch (error) {
          this.log(`執行時出錯：${error.message}`);
        }
      }

      start() {
        if (this.isRunning) {
          this.logToPanel('已經在執行中', 'warning');
          return;
        }

        this.isRunning = true;
        this.totalClicks = 0;
        this.updatePanelStatus();

        // 初始檢查
        this.checkAndClick();

        // 設定間隔
        this.monitorInterval = setInterval(() => {
          this.checkAndClick();
        }, this.interval);

        this.logToPanel(`已開始 (間隔 ${this.interval / 1000} 秒)`, 'info');
      }

      stop() {
        if (!this.isRunning) {
          this.logToPanel('未在執行', 'warning');
          return;
        }

        clearInterval(this.monitorInterval);
        this.isRunning = false;
        this.updatePanelStatus();
        this.logToPanel(`已停止 (${this.totalClicks} 次點擊)`, 'info');
      }

      status() {
        return {
          isRunning: this.isRunning,
          interval: this.interval,
          totalClicks: this.totalClicks,
          config: this.config,
        };
      }

      // 設定控制方法
      enableOnly(buttonTypes) {
        // 首先停用所有
        Object.keys(this.config).forEach(key => {
          this.config[key] = false;
        });

        // 啟用指定的類型
        buttonTypes.forEach(type => {
          const configKey = `enable${type.charAt(0).toUpperCase() + type.slice(1)}`;
          if (this.config.hasOwnProperty(configKey)) {
            this.config[configKey] = true;
            this.log(`已啟用 ${type} 按鈕`);
          }
        });

        this.log(`設定已更新：僅啟用 ${buttonTypes.join(', ')} 按鈕`);
      }

      enableAll() {
        Object.keys(this.config).forEach(key => {
          this.config[key] = true;
        });
        this.log('已啟用所有按鈕類型');
      }

      disableAll() {
        Object.keys(this.config).forEach(key => {
          this.config[key] = false;
        });
        this.log('已停用所有按鈕類型');
      }

      toggle(buttonType) {
        const configKey = `enable${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}`;
        if (this.config.hasOwnProperty(configKey)) {
          this.config[configKey] = !this.config[configKey];
          this.log(`${buttonType} 按鈕 ${this.config[configKey] ? '已啟用' : '已停用'}`);
        } else {
          this.log(`未知的按鈕類型：${buttonType}`);
        }
      }

      enable(buttonType) {
        const configKey = `enable${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}`;
        if (this.config.hasOwnProperty(configKey)) {
          this.config[configKey] = true;
          this.log(`${buttonType} 按鈕已啟用`);
        } else {
          this.log(`未知的按鈕類型：${buttonType}`);
        }
      }

      disable(buttonType) {
        const configKey = `enable${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}`;
        if (this.config.hasOwnProperty(configKey)) {
          this.config[configKey] = false;
          this.log(`${buttonType} 按鈕已停用`);
        } else {
          this.log(`未知的按鈕類型：${buttonType}`);
        }
      }

      // 手動搜尋以進行除錯
      debugSearch() {
        this.log('=== 除錯搜尋 ===');
        const inputBox = document.querySelector('div.full-input-box');
        if (!inputBox) {
          this.log('未找到輸入框');
          return;
        }

        this.log('找到輸入框，正在檢查兄弟元素...');

        let currentElement = inputBox.previousElementSibling;
        let siblingIndex = 1;

        while (currentElement && siblingIndex <= 10) {
          this.log(
            `兄弟元素 ${siblingIndex}: ${currentElement.tagName} ${currentElement.className}`
          );

          // 檢查任何文字內容
          const text = currentElement.textContent ? currentElement.textContent.trim() : '';
          if (text) {
            this.log(`  文字： "${text.substring(0, 100)}"`);

            // 特別檢查 run/accept 模式
            const patterns = ['accept', 'run', 'execute', 'apply'];
            const foundPatterns = patterns.filter(pattern => text.toLowerCase().includes(pattern));
            if (foundPatterns.length > 0) {
              this.log(`  >>> 包含模式：${foundPatterns.join(', ')}`);
            }
          }

          // 檢查此兄弟元素中的按鈕
          const buttons = this.findAcceptInElement(currentElement);
          if (buttons.length > 0) {
            this.log(`  找到 ${buttons.length} 個可點擊按鈕！`);
            buttons.forEach((btn, i) => {
              this.log(`    按鈕 ${i + 1}: "${btn.textContent.trim().substring(0, 50)}"`);
            });
          }

          currentElement = currentElement.previousElementSibling;
          siblingIndex++;
        }

        this.log('=== 除錯結束 ===');
      }

      // 在訊息氣泡中尋找 "繼續對話" 連結
      findResumeLinks() {
        const resumeLinks = [];

        // 在 markdown 內容中尋找 "繼續對話" 連結
        const resumeSelectors = [
          '.markdown-link[data-link="command:composer.resumeCurrentChat"]',
          '.markdown-link[data-link*="resume"]',
          'span.markdown-link[data-link="command:composer.resumeCurrentChat"]',
        ];

        for (const selector of resumeSelectors) {
          const links = document.querySelectorAll(selector);
          for (const link of links) {
            if (this.isResumeLink(link)) {
              resumeLinks.push(link);
            }
          }
        }

        return resumeLinks;
      }

      // 檢查元素是否為 "繼續對話" 連結
      isResumeLink(element) {
        if (!element) return false;

        // 檢查 "繼續對話" 的特定屬性和文字
        const hasResumeCommand =
          element.getAttribute('data-link') === 'command:composer.resumeCurrentChat';
        const hasResumeText =
          element.textContent && element.textContent.toLowerCase().includes('resume');
        const isMarkdownLink = element.classList.contains('markdown-link');

        if (!hasResumeCommand && !hasResumeText) return false;

        const isVisible = this.isElementVisible(element);
        const isClickable = this.isElementClickable(element);

        return isVisible && isClickable;
      }

      // Diff 區塊偵測與分析
      findDiffBlocks() {
        const diffBlocks = [];

        // 在對話中尋找 composer diff 區塊
        const diffSelectors = [
          'div.composer-diff-block',
          'div.composer-code-block-container',
          'div.composer-tool-former-message',
        ];

        for (const selector of diffSelectors) {
          const blocks = document.querySelectorAll(selector);
          for (const block of blocks) {
            const diffInfo = this.analyzeDiffBlock(block);
            if (diffInfo) {
              diffBlocks.push(diffInfo);
            }
          }
        }

        return diffBlocks;
      }

      // 分析單一 diff 區塊的檔案資訊
      analyzeDiffBlock(block) {
        try {
          if (!block) return null;

          const diffInfo = {
            blockElement: block,
            timestamp: new Date(),
            files: [],
            changeType: '未知', // 'unknown'
          };

          // 尋找檔案標頭資訊
          const fileHeader = block.querySelector('.composer-code-block-header');
          if (fileHeader) {
            const fileInfo = this.extractFileInfoFromHeader(fileHeader);
            if (fileInfo) {
              diffInfo.files.push(fileInfo);
            }
          }

          // 在檔名 span 中尋找檔名
          const filenameSpan = block.querySelector('.composer-code-block-filename span');
          if (filenameSpan && !diffInfo.files.length) {
            const filename = filenameSpan.textContent.trim();
            if (filename) {
              diffInfo.files.push({
                name: filename,
                path: filename,
                extension: this.getFileExtension(filename),
              });
            }
          }

          // 檢查變更指示器 (+/- 數字)
          const statusSpan = block.querySelector(
            '.composer-code-block-status span[style*="color"]'
          );
          if (statusSpan) {
            const statusText = statusSpan.textContent.trim();
            if (statusText.includes('+')) {
              diffInfo.changeType = '增加'; // 'addition'
              diffInfo.linesAdded = this.extractNumber(statusText);
            } else if (statusText.includes('-')) {
              diffInfo.changeType = '刪除'; // 'deletion'
              diffInfo.linesDeleted = this.extractNumber(statusText);
            }
          }

          // 尋找增加和刪除
          const allStatusSpans = block.querySelectorAll(
            '.composer-code-block-status span[style*="color"]'
          );
          let hasAdditions = false,
            hasDeletions = false;

          allStatusSpans.forEach(span => {
            const text = span.textContent.trim();
            if (text.includes('+')) {
              hasAdditions = true;
              diffInfo.linesAdded = this.extractNumber(text);
            } else if (text.includes('-')) {
              hasDeletions = true;
              diffInfo.linesDeleted = this.extractNumber(text);
            }
          });

          if (hasAdditions && hasDeletions) {
            diffInfo.changeType = '修改'; // 'modification'
          } else if (hasAdditions) {
            diffInfo.changeType = '增加'; // 'addition'
          } else if (hasDeletions) {
            diffInfo.changeType = '刪除'; // 'deletion'
          }

          return diffInfo.files.length > 0 ? diffInfo : null;
        } catch (error) {
          this.log(`分析 diff 區塊時出錯：${error.message}`);
          return null;
        }
      }

      // 從程式碼區塊標頭提取檔案資訊
      extractFileInfoFromHeader(header) {
        try {
          const fileInfo = header.querySelector('.composer-code-block-file-info');
          if (!fileInfo) return null;

          const filenameElement = fileInfo.querySelector('.composer-code-block-filename span');
          const filename = filenameElement ? filenameElement.textContent.trim() : null;

          if (!filename) return null;

          return {
            name: filename,
            path: filename,
            extension: this.getFileExtension(filename),
            hasIcon: !!fileInfo.querySelector('.composer-code-block-file-icon'),
          };
        } catch (error) {
          this.log(`從標頭提取檔案資訊時出錯：${error.message}`);
          return null;
        }
      }

      // 從檔名獲取副檔名
      getFileExtension(filename) {
        if (!filename || typeof filename !== 'string') return '';
        const lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
      }

      // 從文字中提取數字 (例如, "+17" -> 17)
      extractNumber(text) {
        if (!text) return 0;
        const match = text.match(/[+-]?(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      }

      // 在對話中尋找最近的 diff 區塊
      findRecentDiffBlocks(maxAge = 30000) {
        // 預設 30 秒
        const allDiffs = this.findDiffBlocks();
        const cutoffTime = Date.now() - maxAge;

        return allDiffs.filter(diff => diff.timestamp && diff.timestamp.getTime() > cutoffTime);
      }

      // 獲取檔案變更的對話上下文
      getConversationContext() {
        const conversationDiv = document.querySelector('div.conversations');
        if (!conversationDiv) {
          this.log('未找到對話容器');
          return null;
        }

        const context = {
          conversationElement: conversationDiv,
          totalMessages: 0,
          recentDiffs: [],
          filesChanged: new Set(),
          lastActivity: null,
        };

        // 計算訊息氣泡數量
        const messageBubbles = conversationDiv.querySelectorAll('[data-message-index]');
        context.totalMessages = messageBubbles.length;

        // 尋找最近的 diff 區塊
        const recentDiffs = this.findRecentDiffBlocks();
        context.recentDiffs = recentDiffs;

        // 從最近的 diff 中提取唯一的檔案
        recentDiffs.forEach(diff => {
          diff.files.forEach(file => {
            context.filesChanged.add(file.name);
          });
        });

        // 將 Set 轉換為 Array 以便處理
        context.filesChanged = Array.from(context.filesChanged);

        // 尋找最後活動的時間戳
        if (messageBubbles.length > 0) {
          const lastBubble = messageBubbles[messageBubbles.length - 1];
          context.lastActivity = new Date(); // 使用目前時間作為近似值
        }

        return context;
      }

      // 帶有對話上下文的增強日誌記錄
      logConversationActivity() {
        const context = this.getConversationContext();
        if (!context) return;

        this.log('=== 對話活動 ===');
        this.log(`總訊息數：${context.totalMessages}`);
        this.log(`最近的 diff 數：${context.recentDiffs.length}`);
        this.log(`已變更檔案數：${context.filesChanged.length}`);

        if (context.filesChanged.length > 0) {
          this.log(`已變更檔案：${context.filesChanged.join(', ')}`);
        }

        context.recentDiffs.forEach((diff, index) => {
          this.log(
            `Diff ${index + 1}：${diff.changeType} - ${diff.files.map(f => f.name).join(', ')}`
          );
          if (diff.linesAdded) this.log(`  +${diff.linesAdded} 行增加`);
          if (diff.linesDeleted) this.log(`  -${diff.linesDeleted} 行刪除`);
        });

        this.log('=== 對話活動結束 ===');
      }
    }

    globalThis.autoAcceptAndAnalytics = autoAcceptAndAnalytics;
  }

  // 初始化
  if (!globalThis.simpleAccept) {
    globalThis.simpleAccept = new globalThis.autoAcceptAndAnalytics(2000);

    // 公開控制項
    globalThis.startAccept = () => globalThis.simpleAccept.start();
    globalThis.stopAccept = () => globalThis.simpleAccept.stop();
    globalThis.acceptStatus = () => globalThis.simpleAccept.status();
    globalThis.debugAccept = () => globalThis.simpleAccept.debugSearch();

    // 強制日誌測試函數
    globalThis.testLogs = () => {
      console.log('測試日誌 1 - console.log');
      console.info('測試日誌 2 - console.info');
      console.warn('測試日誌 3 - console.warn');
      console.error('測試日誌 4 - console.error');
      alert('測試：控制台日誌測試完成。請檢查上方的控制台。');
      return '日誌測試完成';
    };

    // 設定控制項
    globalThis.enableOnly = types => globalThis.simpleAccept.enableOnly(types);
    globalThis.enableAll = () => globalThis.simpleAccept.enableAll();
    globalThis.disableAll = () => globalThis.simpleAccept.disableAll();
    globalThis.toggleButton = type => globalThis.simpleAccept.toggle(type);
    globalThis.enableButton = type => globalThis.simpleAccept.enable(type);
    globalThis.disableButton = type => globalThis.simpleAccept.disable(type);

    // 分析控制項
    globalThis.exportAnalytics = () => globalThis.simpleAccept.exportAnalytics();
    globalThis.clearAnalytics = () => globalThis.simpleAccept.clearAnalytics();
    globalThis.clearStorage = () => globalThis.simpleAccept.clearStorage();
    globalThis.validateData = () => globalThis.simpleAccept.validateData();
    globalThis.toggleDebug = () => globalThis.simpleAccept.toggleDebug();
    globalThis.calibrateWorkflow = (manualSeconds, autoMs) =>
      globalThis.simpleAccept.calibrateWorkflowTimes(manualSeconds, autoMs);
    globalThis.showAnalytics = () => {
      globalThis.simpleAccept.switchTab('analytics');
      console.log('控制面板中的分析標籤頁已打開');
    };

    // 對話分析控制項
    globalThis.findDiffs = () => globalThis.simpleAccept.findDiffBlocks();
    globalThis.getContext = () => globalThis.simpleAccept.getConversationContext();
    globalThis.logActivity = () => globalThis.simpleAccept.logConversationActivity();
    globalThis.recentDiffs = maxAge => globalThis.simpleAccept.findRecentDiffBlocks(maxAge);

    // 除錯控制項
    globalThis.enableDebug = () => {
      globalThis.simpleAccept.debugMode = true;
      console.log('除錯模式已啟用 - 檔案提取日誌已啟動');
    };
    globalThis.disableDebug = () => {
      globalThis.simpleAccept.debugMode = false;
      console.log('除錯模式已停用');
    };

    // 強制顯示啟動訊息
    const startupMsg = '[autoAcceptAndAnalytics] 腳本已載入並啟動！';
    console.log(startupMsg);
    console.info(startupMsg);
    console.warn(startupMsg);

    // 同時建立視覺通知
    try {
      const notification = document.createElement('div');
      notification.textContent =
        '✅ 自動接受控制面板已就緒！現已加入檔案分析功能 - 請點擊「分析」標籤頁！';
      notification.style.cssText =
        'position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#4CAF50;color:white;padding:10px 20px;border-radius:5px;z-index:99999;font-weight:bold;max-width:400px;text-align:center;';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    } catch (e) {
      // 忽略
    }

    console.log('命令: startAccept(), stopAccept(), acceptStatus(), debugAccept()');
    console.log(
      '分析: showAnalytics(), exportAnalytics(), clearAnalytics(), clearStorage(), validateData()'
    );
    console.log('除錯: toggleDebug(), enableDebug(), disableDebug() - 控制除錯日誌');
    console.log('校準: calibrateWorkflow(manualSeconds, autoMs) - 調整工作流程計時');
    console.log('設定: enableOnly([types]), enableAll(), disableAll(), toggleButton(type)');
    console.log('對話: findDiffs(), getContext(), logActivity(), recentDiffs(maxAge)');
    console.log('類型: "acceptAll", "accept", "run", "runCommand", "apply", "execute", "resume"');
  }
})();
