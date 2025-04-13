import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

import { CommandManager } from '@/utils/command/manager';
import { CommandAction, SpecialCommandResult, CommandResult } from '@/types/command';
import { logger, LogEntry } from '@/utils/logger';

interface ConsoleContextType {
  input: string;
  output: CommandResult[];
  commandHistory: string[];
  historyIndex: number;
  setInput: (value: string) => void;
  handleSubmit: (input: string) => Promise<void>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export const useConsole = () => {
  const context = useContext(ConsoleContext);
  if (!context) {
    throw new Error('useConsole must be used within a ConsoleProvider');
  }
  return context;
};

interface ConsoleProviderProps {
  children: React.ReactNode;
}

export const ConsoleProvider: React.FC<ConsoleProviderProps> = ({ children }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<CommandResult[]>([]);
  const [commandManager, setCommandManager] = useState<CommandManager | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showLogs, setShowLogs] = useState(false);
  const outputRef = useRef<CommandResult[]>([]);

  // 初始化命令管理器
  useEffect(() => {
    const manager = new CommandManager();
    setCommandManager(manager);
  }, []);

  // 设置输出引用
  useEffect(() => {
    outputRef.current = output;
  }, [output]);

  // 添加日志监听器
  useEffect(() => {
    const handleLog = (entry: LogEntry) => {
      if (!showLogs) return;

      // 格式化日志消息
      const formattedMessage = formatLogEntry(entry);

      // 添加到输出
      setOutput(prev => [
        ...prev,
        {
          success: true,
          message: formattedMessage,
          isLog: true
        }
      ]);
    };

    // 添加监听器
    const removeListener = logger.addListener(handleLog);

    // 清理函数
    return () => {
      removeListener();
    };
  }, [showLogs]);

  // 格式化日志条目
  const formatLogEntry = (entry: LogEntry): string => {
    let message = `${entry.level}:${entry.message}`;

    if (entry.data && entry.data.length > 0) {
      message += ` ${JSON.stringify(entry.data)}`;
    }

    return message;
  };

  // 添加输出到控制台
  const addOutput = useCallback(
    (text: string, type: 'command' | 'success' | 'error' = 'command') => {
      setOutput(prev => [
        ...prev,
        {
          success: type !== 'error',
          message: text,
          isLog: false
        }
      ]);
    },
    []
  );

  // 检查是否是特殊命令结果
  const isSpecialCommandResult = (result: CommandResult): result is SpecialCommandResult => {
    return 'action' in result;
  };

  // 导航命令历史
  const navigateHistory = useCallback(
    (direction: 'up' | 'down') => {
      if (direction === 'up') {
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      } else {
        if (historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    },
    [commandHistory, historyIndex]
  );

  // 处理特殊命令结果
  const handleSpecialCommandResult = useCallback((result: SpecialCommandResult) => {
    if (result.action === CommandAction.CLEAR_CONSOLE) {
      setOutput([]);
    }
  }, []);

  // 处理命令提交
  const handleSubmit = useCallback(
    async (input: string) => {
      if (!input.trim() || !commandManager) return;

      // 添加命令到历史记录
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);

      // 清空输入
      setInput('');

      // 添加命令到输出
      addOutput(`> ${input}`, 'command');

      try {
        // 执行命令
        const result = await commandManager.execute(input);

        // 处理特殊命令结果
        if (isSpecialCommandResult(result)) {
          handleSpecialCommandResult(result);
        }

        // 添加结果到输出
        setOutput(prev => [...prev, result]);
      } catch (error) {
        setOutput(prev => [
          ...prev,
          {
            success: false,
            message: `错误: ${error instanceof Error ? error.message : String(error)}`,
            isLog: false
          }
        ]);
      }
    },
    [commandManager, addOutput, handleSpecialCommandResult]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(input);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory('down');
      }
    },
    [input, handleSubmit, navigateHistory]
  );

  const value = {
    input,
    output,
    commandHistory,
    historyIndex,
    setInput,
    handleSubmit,
    handleKeyDown,
    showLogs,
    setShowLogs
  };

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
};
