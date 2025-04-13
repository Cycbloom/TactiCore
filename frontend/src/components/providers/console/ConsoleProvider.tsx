import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

import {
  createInitialConsole,
  updateConsole,
  addLogToOutput,
  clearConsoleOutput,
  executeCommandAndUpdateConsole,
  updateConsoleInput,
  updateHistoryIndex,
  updateConsoleShowLogs
} from './consoleUtils';

import { CommandAction, SpecialCommandResult, CommandResult } from '@/types/command';
import { logger, LogEntry } from '@/utils/logger';
import { ConsoleContextType, ConsoleState } from '@/types/console';

// ===== 上下文定义 =====

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
  // ===== 状态定义 =====
  const [consoles, setConsoles] = useState<ConsoleState[]>([]);
  const [activeConsoleId, setActiveConsoleId] = useState<string>('');
  const outputRef = useRef<CommandResult[]>([]);

  // ===== 初始化 =====
  // 初始化第一个控制台
  useEffect(() => {
    if (consoles.length === 0) {
      const initialConsole = createInitialConsole();
      setConsoles([initialConsole]);
      setActiveConsoleId(initialConsole.id);
    }
  }, [consoles.length]);

  // 设置输出引用
  useEffect(() => {
    const activeConsole = consoles.find(c => c.id === activeConsoleId);
    if (activeConsole) {
      outputRef.current = activeConsole.output;
    }
  }, [consoles, activeConsoleId]);

  // ===== 日志处理 =====
  // 添加日志监听器
  useEffect(() => {
    const handleLog = (entry: LogEntry) => {
      // 检查所有控制台的 showLogs 状态
      const consolesWithLogs = consoles.filter(c => c.showLogs);
      if (consolesWithLogs.length === 0) return;

      // 为每个启用了日志的控制台添加日志
      setConsoles(prev => {
        let newConsoles = [...prev];
        consolesWithLogs.forEach(console => {
          newConsoles = addLogToOutput(
            newConsoles,
            console.id,
            entry.level,
            entry.message,
            entry.data
          );
        });
        return newConsoles;
      });
    };

    const removeListener = logger.addListener(handleLog);
    return () => removeListener();
  }, [consoles]);

  // ===== 命令处理 =====
  // 处理特殊命令结果
  const handleSpecialCommandResult = useCallback(
    (consoleId: string, result: SpecialCommandResult) => {
      if (result.action === CommandAction.CLEAR_CONSOLE) {
        setConsoles(prev => clearConsoleOutput(prev, consoleId));
      }
    },
    []
  );

  // 处理命令提交
  const handleSubmit = useCallback(
    async (consoleId: string) => {
      const console = consoles.find(c => c.id === consoleId);
      if (!console || !console.input.trim()) return;

      const result = await console.commandManager.execute(console.input);

      // 使用简化后的函数一次性更新所有状态
      setConsoles(prev => executeCommandAndUpdateConsole(prev, consoleId, console.input, result));

      if ('action' in result) {
        handleSpecialCommandResult(consoleId, result);
      }
    },
    [consoles, handleSpecialCommandResult]
  );

  // ===== 输入处理 =====
  // 设置输入值
  const setInput = useCallback((consoleId: string, value: string) => {
    setConsoles(prev => updateConsoleInput(prev, consoleId, value));
  }, []);

  // 导航命令历史
  const navigateHistory = useCallback(
    (consoleId: string, direction: 'up' | 'down') => {
      const console = consoles.find(c => c.id === consoleId);
      if (!console) return;

      if (direction === 'up') {
        if (console.historyIndex < console.commandHistory.length - 1) {
          const newIndex = console.historyIndex + 1;
          setConsoles(prev => updateHistoryIndex(prev, consoleId, newIndex));
        }
      } else {
        if (console.historyIndex > -1) {
          const newIndex = console.historyIndex - 1;
          setConsoles(prev => updateHistoryIndex(prev, consoleId, newIndex));
        }
      }
    },
    [consoles]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (consoleId: string, e: React.KeyboardEvent) => {
      const console = consoles.find(c => c.id === consoleId);
      if (!console) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(consoleId);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory(consoleId, 'up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(consoleId, 'down');
      }
    },
    [consoles, handleSubmit, navigateHistory]
  );

  // ===== 控制台管理 =====
  // 创建新控制台
  const createConsole = useCallback(() => {
    const newConsole = createInitialConsole(`控制台 ${consoles.length + 1}`);
    setConsoles(prev => [...prev, newConsole]);
    setActiveConsoleId(newConsole.id);
  }, [consoles.length]);

  // 删除控制台
  const deleteConsole = useCallback(
    (consoleId: string) => {
      setConsoles(prev => {
        const newConsoles = prev.filter(c => c.id !== consoleId);
        if (newConsoles.length === 0) {
          // 如果删除后没有控制台了，创建一个新的
          const initialConsole = createInitialConsole();
          setActiveConsoleId(initialConsole.id);
          return [initialConsole];
        }
        // 如果删除的是当前活动控制台，切换到最后一个控制台
        if (consoleId === activeConsoleId) {
          setActiveConsoleId(newConsoles[newConsoles.length - 1].id);
        }
        return newConsoles;
      });
    },
    [activeConsoleId]
  );

  // 重命名控制台
  const renameConsole = useCallback((consoleId: string, newName: string) => {
    setConsoles(prev => updateConsole(prev, consoleId, { name: newName }));
  }, []);

  // 设置日志显示状态
  const setShowLogs = useCallback((consoleId: string, show: boolean) => {
    setConsoles(prev => updateConsoleShowLogs(prev, consoleId, show));
  }, []);

  // ===== 上下文值 =====
  const value = {
    consoles,
    activeConsoleId,
    setInput,
    handleSubmit,
    handleKeyDown,
    createConsole,
    deleteConsole,
    renameConsole,
    setActiveConsole: setActiveConsoleId,
    setShowLogs
  };

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
};
