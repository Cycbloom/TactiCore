import React, { createContext, useContext, useState, useCallback } from 'react';

import { CommandManager } from '@/utils/command/manager';

interface ConsoleContextType {
  input: string;
  output: string[];
  commandHistory: string[];
  historyIndex: number;
  setInput: (value: string) => void;
  handleSubmit: () => Promise<void>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

const ConsoleContext = createContext<ConsoleContextType | null>(null);

export const useConsole = () => {
  const context = useContext(ConsoleContext);
  if (!context) {
    throw new Error('useConsole must be used within a ConsoleProvider');
  }
  return context;
};

export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandManager] = useState(() => new CommandManager());

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const result = await commandManager.execute(input);
    setOutput(prev => [
      ...prev,
      `> ${input}`,
      `${result.success ? 'success:' : 'error:'}${result.message} ${result.data ? `(${JSON.stringify(result.data)})` : ''}`
    ]);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    },
    [commandHistory, historyIndex]
  );

  const value = {
    input,
    output,
    commandHistory,
    historyIndex,
    setInput,
    handleSubmit,
    handleKeyDown
  };

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
};
