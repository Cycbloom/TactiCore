import { v4 as uuidv4 } from 'uuid';

import { ConsoleState } from '@/types/console';
import { CommandResult } from '@/types/command';
import { CommandManager } from '@/utils/command/manager';

// ===== 基础操作函数 =====

// 创建新的控制台状态
export const createInitialConsole = (name: string = '控制台 1'): ConsoleState => ({
  id: uuidv4(),
  name,
  input: '',
  output: [],
  commandHistory: [],
  historyIndex: -1,
  showLogs: false,
  commandManager: new CommandManager()
});

// 更新控制台状态
export const updateConsole = (
  consoles: ConsoleState[],
  consoleId: string,
  updates: Partial<ConsoleState>
): ConsoleState[] => {
  return consoles.map(console => {
    if (console.id === consoleId) {
      return { ...console, ...updates };
    }
    return console;
  });
};

// ===== 输入相关函数 =====

// 更新控制台输入
export const updateConsoleInput = (
  consoles: ConsoleState[],
  consoleId: string,
  input: string
): ConsoleState[] => {
  return updateConsole(consoles, consoleId, { input });
};

// 更新历史记录索引和输入
export const updateHistoryIndex = (
  consoles: ConsoleState[],
  consoleId: string,
  historyIndex: number
): ConsoleState[] => {
  const console = consoles.find(c => c.id === consoleId);
  if (!console) return consoles;

  // 根据历史索引设置输入值
  let input = '';
  if (historyIndex >= 0 && historyIndex < console.commandHistory.length) {
    input = console.commandHistory[console.commandHistory.length - 1 - historyIndex];
  }

  return updateConsole(consoles, consoleId, {
    historyIndex,
    input
  });
};

// ===== 输出相关函数 =====

// 添加命令到控制台输出
export const addCommandToOutput = (
  consoles: ConsoleState[],
  consoleId: string,
  command: string
): ConsoleState[] => {
  return updateConsole(consoles, consoleId, {
    output: [
      ...(consoles.find(c => c.id === consoleId)?.output || []),
      {
        success: true,
        message: `> ${command}`,
        isLog: false
      }
    ]
  });
};

// 添加命令结果到控制台输出
export const addCommandResultToOutput = (
  consoles: ConsoleState[],
  consoleId: string,
  result: CommandResult
): ConsoleState[] => {
  return updateConsole(consoles, consoleId, {
    output: [...(consoles.find(c => c.id === consoleId)?.output || []), result]
  });
};

// 添加日志到控制台输出
export const addLogToOutput = (
  consoles: ConsoleState[],
  consoleId: string,
  level: string,
  message: string,
  data?: any[]
): ConsoleState[] => {
  let logMessage = `${level}:${message}`;
  if (data && data.length > 0) {
    logMessage += ` ${JSON.stringify(data)}`;
  }

  return updateConsole(consoles, consoleId, {
    output: [
      ...(consoles.find(c => c.id === consoleId)?.output || []),
      {
        success: true,
        message: logMessage,
        isLog: true
      }
    ]
  });
};

// 清空控制台输出
export const clearConsoleOutput = (consoles: ConsoleState[], consoleId: string): ConsoleState[] => {
  return updateConsole(consoles, consoleId, { output: [] });
};

// ===== 历史记录相关函数 =====

// 添加命令到历史记录
export const addCommandToHistory = (
  consoles: ConsoleState[],
  consoleId: string,
  command: string
): ConsoleState[] => {
  const console = consoles.find(c => c.id === consoleId);
  if (!console) return consoles;

  return updateConsole(consoles, consoleId, {
    commandHistory: [...console.commandHistory, command],
    historyIndex: -1
  });
};

// ===== 设置相关函数 =====

// 更新控制台日志显示状态
export const updateConsoleShowLogs = (
  consoles: ConsoleState[],
  consoleId: string,
  showLogs: boolean
): ConsoleState[] => {
  return updateConsole(consoles, consoleId, { showLogs });
};

// ===== 命令执行相关函数 =====

// 执行命令并更新控制台
export const executeCommandAndUpdateConsole = (
  consoles: ConsoleState[],
  consoleId: string,
  command: string,
  result: CommandResult
): ConsoleState[] => {
  const console = consoles.find(c => c.id === consoleId);
  if (!console) return consoles;

  // 一次性更新所有状态
  return updateConsole(consoles, consoleId, {
    // 添加命令和结果到输出
    output: [
      ...console.output,
      {
        success: true,
        message: `> ${command}`,
        isLog: false
      },
      result
    ],
    // 清空输入
    input: '',
    // 更新历史记录
    commandHistory: [...console.commandHistory, command],
    historyIndex: -1
  });
};

// ===== 工具函数 =====

// 格式化日志条目
export const formatLogEntry = (entry: { level: string; message: string; data?: any[] }): string => {
  let message = `${entry.level}:${entry.message}`;
  if (entry.data && entry.data.length > 0) {
    message += ` ${JSON.stringify(entry.data)}`;
  }
  return message;
};
